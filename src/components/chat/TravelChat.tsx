'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TravelChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status !== 'ready';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    
    sendMessage({ role: 'user', parts: [{ type: 'text', text: localInput }] });
    setLocalInput('');
  };

  const getMessageText = (m: any) => {
    return m.parts
      ? m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      : m.content || '';
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Travel Concierge</h3>
                  <p className="text-blue-100 text-xs">Always ready to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                  <Bot className="w-12 h-12 text-blue-500" />
                  <p className="text-sm">Xin chào! Mình là trợ lý Ảo của The Coastal Edit.<br/>Bạn muốn tìm địa điểm nào ở Phan Thiết?</p>
                </div>
              )}
              
              {messages.map(m => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-sm text-sm'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      <div className="prose dark:prose-invert prose-sm max-w-none prose-p:my-1 prose-a:text-blue-500 hover:prose-a:underline">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {getMessageText(m)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      getMessageText(m)
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                 <div className="flex gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                     <Bot className="w-4 h-4 text-blue-600" />
                   </div>
                   <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                   </div>
                 </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
              <div className="relative flex items-center">
                <input
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Hỏi về địa điểm, lịch trình..."
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !localInput.trim()}
                  className="absolute right-1 w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulsing ring when closed to attract attention */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-offset-2 animate-ping opacity-20"></span>
        )}
      </motion.button>
    </div>
  );
}
