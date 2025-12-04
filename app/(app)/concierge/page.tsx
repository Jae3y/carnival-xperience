"use client";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, History, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChatInterface } from '@/components/ai/chat-interface';
import {
	  Sheet,
	  SheetContent,
	  SheetHeader,
	  SheetTitle,
	  SheetTrigger,
	} from '@/components/ui/sheet';

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  lastMessage?: string;
}

	export default function ConciergePage() {
	  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Current Session',
      createdAt: new Date(),
      lastMessage: 'Welcome to CarnivalXperience!',
    },
  ]);
	  const [activeSessionId, setActiveSessionId] = useState('1');
	  const shouldReduceMotion = useReducedMotion();

	  const containerTransition = {
	    duration: 0.3,
	    ease: 'easeOut',
	  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Session ${sessions.length + 1}`,
      createdAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

	  const deleteSession = (sessionId: string) => {
    if (sessions.length === 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions[0].id === sessionId ? sessions[1]?.id : sessions[0].id);
    }
	  };

	  return (
	    <motion.div
	      className="flex h-[calc(100vh-4rem)] flex-col"
	      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	      animate={{ opacity: 1, y: 0 }}
	      transition={containerTransition}
	    >
	      {/* Header */}
	      <motion.div
	        className="flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-sm"
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...containerTransition, delay: 0.05 }}
	      >
	        <div className="flex items-center gap-3">
	          <motion.div
	            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cx-gold via-cx-flame to-cx-pink"
	            animate={
	              shouldReduceMotion
	                ? { opacity: 1 }
	                : { opacity: [0.9, 1, 0.9], scale: [1, 1.06, 1] }
	            }
	            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
	          >
	            <Sparkles className="h-5 w-5 text-cx-deep" />
	          </motion.div>
	          <div>
	            <h1 className="font-semibold leading-tight">AI Concierge</h1>
	            <p className="text-sm text-muted-foreground">
	              Your personal carnival guide
	            </p>
	          </div>
	        </div>
	        <div className="flex items-center gap-2">
	          <Button variant="outline" size="sm" onClick={createNewSession}>
	            <Plus className="mr-2 h-4 w-4" />
	            New Chat
	          </Button>
	          <Sheet>
	            <SheetTrigger asChild>
	              <Button variant="outline" size="sm">
	                <History className="mr-2 h-4 w-4" />
	                History
	              </Button>
	            </SheetTrigger>
	            <SheetContent>
	              <SheetHeader>
	                <SheetTitle>Chat History</SheetTitle>
	              </SheetHeader>
	              <div className="mt-4 space-y-2">
	                {sessions.map((session) => (
	                  <Card
	                    key={session.id}
	                    className={`cursor-pointer transition-colors ${
	                      activeSessionId === session.id
	                        ? 'border-primary/80 bg-primary/5'
	                        : 'hover:border-primary/60'
	                    }`}
	                    onClick={() => setActiveSessionId(session.id)}
	                  >
	                    <CardContent className="flex items-center justify-between p-3">
	                      <div className="min-w-0 flex-1">
	                        <p className="truncate text-sm font-medium">
	                          {session.title}
	                        </p>
	                        <p className="truncate text-xs text-muted-foreground">
	                          {session.lastMessage || 'No messages yet'}
	                        </p>
	                        <p className="mt-1 text-xs text-muted-foreground">
	                          {session.createdAt.toLocaleDateString()}
	                        </p>
	                      </div>
	                      {sessions.length > 1 && (
	                        <Button
	                          variant="ghost"
	                          size="icon"
	                          className="h-8 w-8 flex-shrink-0"
	                          onClick={(e) => {
	                            e.stopPropagation();
	                            deleteSession(session.id);
	                          }}
	                          aria-label="Delete chat session"
	                        >
	                          <Trash2 className="h-4 w-4 text-muted-foreground" />
	                        </Button>
	                      )}
	                    </CardContent>
	                  </Card>
	                ))}
	              </div>
	            </SheetContent>
	          </Sheet>
	        </div>
	      </motion.div>

	      {/* Chat Interface */}
	      <motion.div
	        className="flex-1 overflow-hidden"
	        initial={{ opacity: 0 }}
	        animate={{ opacity: 1 }}
	        transition={{ ...containerTransition, delay: 0.1 }}
	      >
	        <ChatInterface key={activeSessionId} />
	      </motion.div>
	    </motion.div>
	  );
}

