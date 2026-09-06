'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, Send, RotateCcw, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { isReducedMotion } from '@/lib/motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

interface AIAssistantProps {
  initialSettings?: {
    enabled?: boolean;
    assistantName?: string;
    welcomeMessage?: string;
    suggestedPrompts?: string;
  } | null;
}

export default function AIAssistant({ initialSettings }: AIAssistantProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Assistant Configuration State
  const [isEnabled, setIsEnabled] = useState(initialSettings?.enabled ?? true);
  const [assistantName, setAssistantName] = useState(
    initialSettings?.assistantName || 'Nizam Nawabs Assistant'
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialSettings?.welcomeMessage ||
      "Hey. I'm the Nizam Nawabs Assistant. What would you like to know about the team?"
  );
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(() => {
    const raw =
      initialSettings?.suggestedPrompts ||
      'Who are Nizam Nawabs?;Show me the roster;When is the next match?;Tell me about Season 1;Latest team news';
    return raw
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean);
  });

  // Chat UI State
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch live CMS settings on mount if not provided via props
  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.enabled === 'boolean') setIsEnabled(data.enabled);
        if (data.assistantName) setAssistantName(data.assistantName);
        if (data.welcomeMessage) setWelcomeMessage(data.welcomeMessage);
        if (Array.isArray(data.suggestedPrompts) && data.suggestedPrompts.length > 0) {
          setSuggestedPrompts(data.suggestedPrompts);
        }
      })
      .catch(() => {
        // use default fallback
      });
  }, []);

  // Handle body scroll locking on mobile
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, streamingContent, isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Toggle Open/Close
  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !hasOpenedOnce) {
        setHasOpenedOnce(true);
      }
      return next;
    });
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([]);
    setStreamingContent('');
    setErrorBanner(null);
  };

  // Send message
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setErrorBanner(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newHistory.map((m) => ({ role: m.role, content: m.content })),
          pathname,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'The assistant is temporarily unavailable. Please try again.');
      }

      if (!res.body) {
        throw new Error('No response stream received from assistant.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      // Add final assistant message to chat history
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: accumulated || "I don't have that information yet.",
        },
      ]);
      setStreamingContent('');
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorBanner(err.message || 'The assistant is temporarily unavailable. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content: 'The assistant is temporarily unavailable. Please try again.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  // Render markdown helper (renders bold, bullet lists, and internal router links)
  const renderMessageContent = (content: string) => {
    // Regex for [Link Title](/route)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    // Split lines for list formatting
    const lines = content.split('\n');

    return (
      <div className="space-y-2">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

          const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
          const lineText = isBullet ? trimmed.slice(2) : trimmed;

          // Parse markdown links and bold formatting within the line
          const elements: React.ReactNode[] = [];
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = linkRegex.exec(lineText)) !== null) {
            if (match.index > lastIndex) {
              elements.push(parseBold(lineText.substring(lastIndex, match.index), `${lineIdx}-${lastIndex}`));
            }
            const label = match[1];
            const href = match[2];

            // Render internal link with seamless route navigation
            elements.push(
              <button
                key={`link-${lineIdx}-${match.index}`}
                onClick={() => {
                  setIsOpen(false);
                  router.push(href);
                }}
                className="inline-flex items-center gap-1 font-semibold text-brand-orange hover:text-white underline underline-offset-2 transition-colors duration-150 mx-1 cursor-pointer"
              >
                <span>{label}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            );
            lastIndex = match.index + match[0].length;
          }

          if (lastIndex < lineText.length) {
            elements.push(parseBold(lineText.substring(lastIndex), `${lineIdx}-${lastIndex}`));
          }

          if (isBullet) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1">
                <span className="text-brand-orange select-none mt-1 font-bold text-xs">•</span>
                <div className="flex-1">{elements}</div>
              </div>
            );
          }

          return <p key={lineIdx}>{elements}</p>;
        })}
      </div>
    );
  };

  const parseBold = (text: string, keyPrefix: string): React.ReactNode => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, idx) =>
      idx % 2 === 1 ? (
        <strong key={`${keyPrefix}-${idx}`} className="font-bold text-white">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Backdrop for Mobile Bottom Sheet */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[997] bg-black/65 backdrop-blur-sm sm:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Floating Assistant Trigger Button */}
      <div
        className="fixed z-[998]"
        style={{
          bottom: 'max(1.25rem, calc(var(--sab, 0px) + 1.25rem))',
          right: 'max(1.25rem, calc(var(--sar, 0px) + 1.25rem))',
        }}
      >
        <button
          ref={buttonRef}
          onClick={handleToggle}
          aria-label={isOpen ? 'Close Nizam Nawabs AI Assistant' : 'Open Nizam Nawabs AI Assistant'}
          aria-expanded={isOpen}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#0A0A0D] border-2 border-brand-orange/60 hover:border-brand-orange text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.8)] hover:shadow-[0_12px_28px_rgba(255,94,0,0.3)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-brand-black"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 rounded-full bg-brand-orange/15 blur-md pointer-events-none group-hover:bg-brand-orange/25 transition-colors" />

          {/* Attention indicator dot on initial load */}
          {!hasOpenedOnce && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-brand-orange border-2 border-brand-black animate-pulse" />
          )}

          {/* Icon state */}
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <div className="relative text-brand-orange group-hover:text-white transition-colors">
              <AssistantBrandedIcon className="w-7 h-7" />
            </div>
          )}
        </button>
      </div>

      {/* Assistant Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Nizam Nawabs AI Assistant"
          className="fixed z-[999] bg-[#09090B] border border-surface-border/90 shadow-[0_24px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            /* Mobile styles: Bottom Sheet */
            inset-x-0 bottom-0 h-[88vh] max-h-[88dvh] rounded-t-3xl rounded-b-none sm:rounded-2xl
            /* Desktop styles: Floating Box */
            sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[580px] sm:max-h-[calc(100vh-8rem)]
            animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95"
        >
          {/* Mobile Drag Handle */}
          <div className="sm:hidden w-full flex items-center justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-zinc-700" />
          </div>

          {/* Panel Header */}
          <div className="px-5 py-3.5 border-b border-surface-border/70 flex items-center justify-between bg-surface-dark/95 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-orange/15 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0">
                <AssistantBrandedIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight uppercase leading-none">
                  NIZAM NAWABS AI
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-orange block pt-0.5">
                  {assistantName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  onClick={handleResetChat}
                  title="Clear conversation"
                  aria-label="Clear chat history"
                  className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-elevated transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-elevated transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 flex items-center justify-between text-xs text-red-300 font-sans">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="line-clamp-1">{errorBanner}</span>
              </div>
              <button
                onClick={() => setErrorBanner(null)}
                className="text-[10px] uppercase font-bold text-red-400 hover:text-white ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 text-xs sm:text-sm font-sans no-scrollbar">
            {/* Initial Assistant Greeting */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm p-3.5 text-zinc-200 leading-relaxed shadow-sm">
                <p>{welcomeMessage}</p>
              </div>
            </div>

            {/* Quick Action Prompt Chips (Shown when conversation is fresh) */}
            {messages.length === 0 && suggestedPrompts.length > 0 && (
              <div className="pt-2 pl-10 space-y-2">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-zinc-400 block">
                  SUGGESTED QUESTIONS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      disabled={isLoading}
                      className="text-left text-xs font-sans text-zinc-300 bg-surface-elevated hover:bg-surface-border hover:text-white border border-surface-border px-3 py-1.5 rounded-xl transition-all duration-200 hover:border-brand-orange/50 active:scale-95"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-orange text-white rounded-tr-sm font-medium'
                      : msg.isError
                      ? 'bg-red-950/40 border border-red-500/40 text-red-200 rounded-tl-sm'
                      : 'bg-surface-card border border-surface-border text-zinc-200 rounded-tl-sm'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Streaming Message in Progress */}
            {streamingContent && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-3.5 bg-surface-card border border-surface-border text-zinc-200 leading-relaxed shadow-sm">
                  {renderMessageContent(streamingContent)}
                  <span className="inline-block w-1.5 h-4 ml-1 bg-brand-orange animate-pulse align-middle" />
                </div>
              </div>
            )}

            {/* Thinking state (Subtle pulsing dots) */}
            {isLoading && !streamingContent && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3.5 sm:p-4 border-t border-surface-border/70 bg-surface-dark/95 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about Nizam Nawabs..."
                disabled={isLoading}
                className="flex-1 bg-[#121214] border border-surface-border/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all font-sans disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                aria-label="Send message"
                className="w-11 h-11 rounded-xl bg-brand-orange hover:bg-brand-orangeHover disabled:opacity-40 disabled:hover:bg-brand-orange text-white flex items-center justify-center transition-all duration-200 shrink-0 shadow-lg shadow-brand-orange/20 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <span className="text-[10px] font-sans text-zinc-500 tracking-wider uppercase font-medium">
                POWERED BY GOOGLE GEMINI • NIZAM NAWABS
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Custom Branded Basketball + AI Geometric Crest Icon
function AssistantBrandedIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Basketball Perimeter */}
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Horizontal Seam */}
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
      {/* Left Arc Seam */}
      <path d="M 7.5 3.5 C 10 7.5, 10 16.5, 7.5 20.5" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
      {/* Right Arc Seam */}
      <path d="M 16.5 3.5 C 14 7.5, 14 16.5, 16.5 20.5" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
      {/* Core AI Diamond Sparkle */}
      <path
        d="M 12 7.5 L 13.2 10.8 L 16.5 12 L 13.2 13.2 L 12 16.5 L 10.8 13.2 L 7.5 12 L 10.8 10.8 Z"
        fill="#FF5E00"
      />
    </svg>
  );
}
