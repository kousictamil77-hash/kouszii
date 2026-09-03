'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { LocalStore } from '@/lib/storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I am your AI Workout Assistant. Ask me about your stats, calories burned, or workout history!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stats = LocalStore.getDashboardStats();
      const profile = LocalStore.getProfile();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          context: { stats, profile } 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-dark-bg shadow-glow-emerald transition-all duration-300 hover:scale-110 z-40 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI Workout Coach</h3>
              <p className="text-[10px] text-emerald-400 font-medium">Online</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div 
                className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl text-sm bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your progress..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 p-1.5 rounded-full bg-emerald-500 text-dark-bg hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
