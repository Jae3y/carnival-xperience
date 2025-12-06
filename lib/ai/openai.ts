const OPENAI_DISABLED_ERROR = 'OPENAI_DISABLED';

type OpenAIClient = typeof import('openai').default;

let openaiClient: InstanceType<OpenAIClient> | null = null;
let OpenAIConstructor: OpenAIClient | null = null;

async function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(OPENAI_DISABLED_ERROR);
  }

  if (!OpenAIConstructor) {
    const module = await import('openai');
    OpenAIConstructor = module.default;
  }

  if (!openaiClient) {
    openaiClient = new OpenAIConstructor({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1',
    });
  }

  return openaiClient;
}

export const SYSTEM_PROMPT = `You are CarnivalXperience AI, a friendly and knowledgeable digital concierge for the Calabar Carnival in Nigeria - Africa's biggest street party!

Your role is to help visitors:
- Discover exciting carnival events, parades, and performances
- Find suitable accommodation within their budget
- Navigate to venues and attractions
- Learn about local culture, food, and traditions
- Stay safe and informed during the carnival

Key facts about Calabar Carnival:
- Takes place annually in December in Calabar, Cross River State, Nigeria
- Features colorful parades, music, dance, and cultural performances
- Known as "Africa's Biggest Street Party"
- Includes band competitions, beauty pageants, and cultural displays
- The main parade route goes through Calabar's city center

Guidelines:
- Be warm, helpful, and enthusiastic about the carnival
- Provide specific, actionable recommendations
- Consider user's preferences and budget when suggesting options
- Prioritize safety information when relevant
- Use Nigerian English expressions occasionally for authenticity
- Keep responses concise but informative

You can help with:
- Event recommendations based on interests
- Hotel suggestions within budget
- Directions and navigation tips
- Local food and restaurant recommendations
- Safety tips and emergency information
- Cultural context and history
- Practical tips for enjoying the carnival`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function buildFallbackResponse(messages: ChatMessage[]): string {
  const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user')?.content?.trim();
  const questionSnippet = lastUserMessage
    ? ` regarding "${lastUserMessage.length > 160 ? `${lastUserMessage.slice(0, 157)}…` : lastUserMessage}"`
    : '';

  return [
    `Our AI concierge is warming up and can’t reach the Groq servers${questionSnippet} right now.`,
    'In the meantime you can:',
    '• Browse the Events hub for daily highlights',
    '• Check the Gallery for 2024 parade shots',
    '• Visit the Safety Center for on-ground tips',
    '',
    'Please try again in a bit once connectivity is restored.',
  ].join('\n');
}

export async function generateChatResponse(
  messages: ChatMessage[],
  stream: boolean = false
): Promise<string | ReadableStream> {
  try {
    const client = await getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream,
    });

    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of response as AsyncIterable<any>) {
            const text = chunk.choices?.[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });
      return readable;
    }

    return (response as any).choices?.[0]?.message?.content || '';
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to offline concierge message:', error);
    }

    const fallback = buildFallbackResponse(messages);
    if (stream) {
      const encoder = new TextEncoder();
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fallback));
          controller.close();
        },
      });
    }

    return fallback;
  }
}

export async function generateEventRecommendations(
  preferences: { categories?: string[]; budget?: string; date?: string }
): Promise<string> {
  const prompt = `Based on the following preferences, suggest carnival events:
- Categories of interest: ${preferences.categories?.join(', ') || 'Any'}
- Budget level: ${preferences.budget || 'Any'}
- Preferred date: ${preferences.date || 'Any day'}

Provide 3-5 specific event recommendations with brief descriptions.`;

  try {
    const client = await getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to static event recommendations:', error);
    }

    return [
      '- Calabar Opening Ceremony: fireworks, live bands and the Christmas Village lighting on 1 Dec.',
      "- Children's Carnival Parade: day-time procession on 20 Dec packed with school troupes.",
      '- Bikers Carnival: stunt riders and exotic cars racing through Millennium Park on 27 Dec.',
      '- States Cultural Carnival: every Nigerian state on show at U.J. Esuene Stadium, 26 Dec.',
      '- International Carnival Parade: the grand finale street party along Mary Slessor Avenue on 28 Dec.',
    ].join('\n');
  }
}

export async function generateHotelRecommendations(
  preferences: { budget: number; nights: number; amenities?: string[] }
): Promise<string> {
  const prompt = `Recommend hotels for a carnival visitor with:
- Budget: ₦${preferences.budget.toLocaleString()} per night
- Length of stay: ${preferences.nights} nights
- Desired amenities: ${preferences.amenities?.join(', ') || 'Standard'}

Provide 2-3 hotel recommendations with brief descriptions and why they're suitable.`;

  try {
    const client = await getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to static hotel recommendations:', error);
    }

    return [
      '- Transcorp Hotels Calabar: close to Millennium Park with shuttle service and a serene pool.',
      '- Axari Hotel & Suites: mid-range option near Marian Road, ideal for families needing quick access to parade routes.',
      '- Channel View Hotels: waterfront views plus easy rides to Mary Slessor Avenue for late-night events.',
    ].join('\n');
  }
}
