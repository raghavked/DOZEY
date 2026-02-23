import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE = "Hey! I'm Doze, your DOZEY health assistant! I can help you navigate the app, understand vaccination requirements, and manage your health records. What can I help you with?";
const ERROR_MESSAGE = "I'm not fully set up yet, but I'll be ready soon! In the meantime, feel free to explore the app.";

function DozeAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="100" width="96" height="130" rx="22" fill="white" stroke="#1051a5" strokeWidth="3.5"/>
      <rect x="60" y="110" width="28" height="112" rx="13" fill="#eef1fc" opacity="0.6"/>
      <rect x="116" y="124" width="19" height="3" rx="1.5" fill="#1051a5" opacity="0.3"/>
      <rect x="116" y="154" width="19" height="3" rx="1.5" fill="#1051a5" opacity="0.3"/>
      <rect x="116" y="184" width="19" height="3" rx="1.5" fill="#1051a5" opacity="0.3"/>
      <rect x="60" y="164" width="80" height="58" rx="9" fill="#E8F8EF"/>
      <rect x="60" y="164" width="80" height="58" rx="9" fill="none" stroke="#26844f" strokeWidth="1.8" opacity="0.5"/>
      <circle cx="88" cy="183" r="5" fill="white" stroke="#26844f" strokeWidth="1.8"/>
      <circle cx="104" cy="194" r="3.5" fill="white" stroke="#26844f" strokeWidth="1.5"/>
      <rect x="62" y="88" width="76" height="18" rx="9" fill="#1051a5"/>
      <rect x="90" y="50" width="20" height="46" rx="8" fill="#1051a5"/>
      <rect x="78" y="40" width="44" height="18" rx="9" fill="#1051a5"/>
      <rect x="88" y="228" width="24" height="20" rx="5" fill="#1051a5"/>
      <rect x="95" y="247" width="10" height="36" rx="4" fill="#dce6ff"/>
      <ellipse cx="100" cy="285" rx="5" ry="7" fill="#b0c0ef"/>
      <ellipse cx="82" cy="140" rx="16" ry="17" fill="white" stroke="#1051a5" strokeWidth="2.2"/>
      <ellipse cx="118" cy="140" rx="16" ry="17" fill="white" stroke="#1051a5" strokeWidth="2.2"/>
      <circle cx="84" cy="141" r="9" fill="#1051a5"/>
      <circle cx="120" cy="141" r="9" fill="#1051a5"/>
      <circle cx="87" cy="137" r="3.5" fill="white"/>
      <circle cx="123" cy="137" r="3.5" fill="white"/>
      <path d="M70 125 Q82 119 94 125" stroke="#1051a5" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M106 125 Q118 119 130 125" stroke="#1051a5" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M84 163 Q100 176 116 163" stroke="#22283a" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="70" cy="159" rx="10" ry="7" fill="#97bf2d" opacity="0.2"/>
      <ellipse cx="130" cy="159" rx="10" ry="7" fill="#97bf2d" opacity="0.2"/>
      <ellipse cx="38" cy="148" rx="16" ry="11" fill="white" stroke="#1051a5" strokeWidth="2.5" transform="rotate(-30 38 148)"/>
      <circle cx="27" cy="158" r="11" fill="white" stroke="#1051a5" strokeWidth="2.5"/>
      <ellipse cx="162" cy="148" rx="16" ry="11" fill="white" stroke="#1051a5" strokeWidth="2.5" transform="rotate(30 162 148)"/>
      <circle cx="173" cy="158" r="11" fill="white" stroke="#1051a5" strokeWidth="2.5"/>
      <rect x="91" y="116" width="18" height="5" rx="2.5" fill="#26844f" opacity="0.55"/>
      <rect x="97" y="110" width="5" height="18" rx="2.5" fill="#26844f" opacity="0.55"/>
    </svg>
  );
}

function DozeButtonIcon() {
  return (
    <svg width="36" height="36" viewBox="30 35 140 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="100" width="96" height="130" rx="22" fill="white" stroke="#1051a5" strokeWidth="4"/>
      <rect x="60" y="164" width="80" height="58" rx="9" fill="#E8F8EF"/>
      <rect x="62" y="88" width="76" height="18" rx="9" fill="#1051a5"/>
      <rect x="90" y="50" width="20" height="46" rx="8" fill="#1051a5"/>
      <rect x="78" y="40" width="44" height="18" rx="9" fill="#1051a5"/>
      <ellipse cx="82" cy="140" rx="16" ry="17" fill="white" stroke="#1051a5" strokeWidth="2.5"/>
      <ellipse cx="118" cy="140" rx="16" ry="17" fill="white" stroke="#1051a5" strokeWidth="2.5"/>
      <circle cx="84" cy="141" r="9" fill="#1051a5"/>
      <circle cx="120" cy="141" r="9" fill="#1051a5"/>
      <circle cx="87" cy="137" r="3.5" fill="white"/>
      <circle cx="123" cy="137" r="3.5" fill="white"/>
      <path d="M84 163 Q100 176 116 163" stroke="#22283a" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <rect x="88" y="228" width="24" height="20" rx="5" fill="#1051a5"/>
      <rect x="91" y="116" width="18" height="5" rx="2.5" fill="#26844f" opacity="0.55"/>
      <rect x="97" y="110" width="5" height="18" rx="2.5" fill="#26844f" opacity="0.55"/>
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#eef1fc] flex items-center justify-center flex-shrink-0 overflow-hidden">
        <DozeAvatar size={14} />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-[#1051a5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#1051a5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#1051a5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export function DozeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const supabase = await getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: trimmed,
          history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: ERROR_MESSAGE }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 sm:p-6">
      <div
        className={`absolute bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{ height: isOpen ? '500px' : '0px', maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="bg-[#1051a5] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <DozeButtonIcon />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">Doze</h3>
              <p className="text-[11px] text-blue-200">DOZEY Health Assistant</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-gray-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-end gap-2'} mb-3`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#eef1fc] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <DozeAvatar size={14} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1051a5] text-white rounded-br-md'
                    : 'bg-white text-[#22283a] rounded-bl-md shadow-sm border border-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white px-3 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Doze anything..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-[#22283a] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1051a5]/30 transition-shadow"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#1051a5] text-white flex items-center justify-center hover:bg-[#0d4289] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={`ml-auto w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen
            ? 'bg-[#22283a] text-white'
            : 'bg-[#1051a5] text-white'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
