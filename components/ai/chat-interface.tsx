'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  className?: string;
}

const quickActions = [
  { label: '🎭 Event suggestions', prompt: 'What events are happening today?' },
  { label: '🏨 Find hotels', prompt: 'Recommend affordable hotels near the carnival' },
  { label: '🍔 Local food', prompt: 'What local dishes should I try during the carnival?' },
  { label: '📍 Navigation help', prompt: 'How do I get to the main parade route?' },
  { label: '🛡️ Safety tips', prompt: 'What safety tips should I know for the carnival?' },
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Welcome to CarnivalXperience! 🎭 I\'m your AI concierge for the Calabar Carnival. How can I help you make the most of Africa\'s biggest street party?',
  timestamp: new Date(),
};

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load or create session on mount
  const initializeSession = useCallback(async () => {
    try {
      // Try to load the most recent active session
      const response = await fetch('/api/concierge/sessions/latest');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.session) {
          setSessionId(data.session.id);
          // Load existing messages
          if (data.messages && data.messages.length > 0) {
            const loadedMessages: Message[] = data.messages.map((msg: { id: string; role: 'user' | 'assistant'; content: string; created_at: string }) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at),
            }));
            setMessages([WELCOME_MESSAGE, ...loadedMessages]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Create a new session if needed
  const ensureSession = async (): Promise<string | null> => {
    if (sessionId) return sessionId;

    try {
      const response = await fetch('/api/concierge/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Chat Session' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.session) {
          setSessionId(data.session.id);
          return data.session.id;
        }
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    return null;
  };

  // Save message to database
  const saveMessage = async (currentSessionId: string, role: 'user' | 'assistant', content: string) => {
    try {
      await fetch(`/api/concierge/sessions/${currentSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Ensure we have a session and save the user message
    const currentSessionId = await ensureSession();
    if (currentSessionId) {
      await saveMessage(currentSessionId, 'user', content);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Save assistant response to database
        if (currentSessionId) {
          await saveMessage(currentSessionId, 'assistant', data.message);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className={cn('flex flex-col h-full items-center justify-center', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-2 text-sm text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-purple-100'
              )}
            >
              {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-purple-600" />}
            </div>
            <Card className={cn('max-w-[80%] p-3', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-purple-600" />
            </div>
            <Card className="p-3 bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button key={action.label} variant="outline" size="sm" onClick={() => sendMessage(action.prompt)} className="text-xs">
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about the carnival..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
