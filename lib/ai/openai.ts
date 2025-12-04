import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors when API key is not set
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    // Use Groq API (OpenAI-compatible, Free)
    openaiClient = new OpenAI({ 
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
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

export async function generateChatResponse(
  messages: ChatMessage[],
  stream: boolean = false
): Promise<string | ReadableStream> {
  const client = getOpenAIClient();
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
        for await (const chunk of response as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });
    return readable;
  }

  return (response as OpenAI.Chat.Completions.ChatCompletion).choices[0]?.message?.content || '';
}

export async function generateEventRecommendations(
  preferences: { categories?: string[]; budget?: string; date?: string }
): Promise<string> {
  const prompt = `Based on the following preferences, suggest carnival events:
- Categories of interest: ${preferences.categories?.join(', ') || 'Any'}
- Budget level: ${preferences.budget || 'Any'}
- Preferred date: ${preferences.date || 'Any day'}

Provide 3-5 specific event recommendations with brief descriptions.`;

  const client = getOpenAIClient();
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
}

export async function generateHotelRecommendations(
  preferences: { budget: number; nights: number; amenities?: string[] }
): Promise<string> {
  const prompt = `Recommend hotels for a carnival visitor with:
- Budget: ₦${preferences.budget.toLocaleString()} per night
- Length of stay: ${preferences.nights} nights
- Desired amenities: ${preferences.amenities?.join(', ') || 'Standard'}

Provide 2-3 hotel recommendations with brief descriptions and why they're suitable.`;

  const client = getOpenAIClient();
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
}
