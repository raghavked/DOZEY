import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGES: Record<string, string> = {
  en: "Hey! I'm Doze, your DOZEY health assistant! I can help you navigate the app, understand vaccination requirements, and manage your health records. What can I help you with?",
  es: "¡Hola! Soy Doze, tu asistente de salud de DOZEY. Puedo ayudarte a navegar la app, entender los requisitos de vacunación y gestionar tus registros médicos. ¿En qué puedo ayudarte?",
  fr: "Salut ! Je suis Doze, votre assistant santé DOZEY ! Je peux vous aider à naviguer dans l'application, comprendre les exigences de vaccination et gérer vos dossiers médicaux. Comment puis-je vous aider ?",
  hi: "नमस्ते! मैं Doze हूँ, आपका DOZEY स्वास्थ्य सहायक! मैं ऐप को नेविगेट करने, टीकाकरण आवश्यकताओं को समझने और आपके स्वास्थ्य रिकॉर्ड प्रबंधित करने में मदद कर सकता हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
  zh: "你好！我是 Doze，你的 DOZEY 健康助手！我可以帮你使用应用程序、了解疫苗接种要求，以及管理你的健康记录。有什么可以帮你的吗？",
  pt: "Olá! Sou o Doze, seu assistente de saúde DOZEY! Posso ajudá-lo a navegar no app, entender os requisitos de vacinação e gerenciar seus registros de saúde. Como posso ajudar?",
  ar: "مرحباً! أنا Doze، مساعدك الصحي في DOZEY! يمكنني مساعدتك في التنقل في التطبيق وفهم متطلبات التطعيم وإدارة سجلاتك الصحية. كيف يمكنني مساعدتك؟",
};

const ERROR_MESSAGES: Record<string, string> = {
  en: "I'm having a bit of trouble right now. Please try again in a moment!",
  es: "Estoy teniendo un pequeño problema. ¡Inténtalo de nuevo en un momento!",
  fr: "J'ai un petit souci en ce moment. Réessayez dans un instant !",
  hi: "मुझे अभी थोड़ी समस्या हो रही है। कृपया कुछ समय बाद पुनः प्रयास करें!",
  zh: "我现在遇到了一点问题，请稍后再试！",
  pt: "Estou com um pequeno problema agora. Tente novamente em instantes!",
  ar: "أواجه مشكلة صغيرة الآن. يرجى المحاولة مرة أخرى بعد قليل!",
};

function DozeAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="100" width="96" height="130" rx="22" fill="white" stroke="#4a7fb5" strokeWidth="3.5"/>
      <rect x="60" y="110" width="28" height="112" rx="13" fill="#eef1fc" opacity="0.6"/>
      <rect x="116" y="124" width="19" height="3" rx="1.5" fill="#4a7fb5" opacity="0.3"/>
      <rect x="116" y="154" width="19" height="3" rx="1.5" fill="#4a7fb5" opacity="0.3"/>
      <rect x="116" y="184" width="19" height="3" rx="1.5" fill="#4a7fb5" opacity="0.3"/>
      <rect x="60" y="164" width="80" height="58" rx="9" fill="#E8F8EF"/>
      <rect x="60" y="164" width="80" height="58" rx="9" fill="none" stroke="#4d9068" strokeWidth="1.8" opacity="0.5"/>
      <circle cx="88" cy="183" r="5" fill="white" stroke="#4d9068" strokeWidth="1.8"/>
      <circle cx="104" cy="194" r="3.5" fill="white" stroke="#4d9068" strokeWidth="1.5"/>
      <rect x="62" y="88" width="76" height="18" rx="9" fill="#4a7fb5"/>
      <rect x="90" y="50" width="20" height="46" rx="8" fill="#4a7fb5"/>
      <rect x="78" y="40" width="44" height="18" rx="9" fill="#4a7fb5"/>
      <rect x="88" y="228" width="24" height="20" rx="5" fill="#4a7fb5"/>
      <rect x="95" y="247" width="10" height="36" rx="4" fill="#dce6ff"/>
      <ellipse cx="100" cy="285" rx="5" ry="7" fill="#b0c0ef"/>
      <ellipse cx="82" cy="140" rx="16" ry="17" fill="white" stroke="#4a7fb5" strokeWidth="2.2"/>
      <ellipse cx="118" cy="140" rx="16" ry="17" fill="white" stroke="#4a7fb5" strokeWidth="2.2"/>
      <circle cx="84" cy="141" r="9" fill="#4a7fb5"/>
      <circle cx="120" cy="141" r="9" fill="#4a7fb5"/>
      <circle cx="87" cy="137" r="3.5" fill="white"/>
      <circle cx="123" cy="137" r="3.5" fill="white"/>
      <path d="M70 125 Q82 119 94 125" stroke="#4a7fb5" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M106 125 Q118 119 130 125" stroke="#4a7fb5" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M84 163 Q100 176 116 163" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="70" cy="159" rx="10" ry="7" fill="#8aab45" opacity="0.2"/>
      <ellipse cx="130" cy="159" rx="10" ry="7" fill="#8aab45" opacity="0.2"/>
      <ellipse cx="38" cy="148" rx="16" ry="11" fill="white" stroke="#4a7fb5" strokeWidth="2.5" transform="rotate(-30 38 148)"/>
      <circle cx="27" cy="158" r="11" fill="white" stroke="#4a7fb5" strokeWidth="2.5"/>
      <ellipse cx="162" cy="148" rx="16" ry="11" fill="white" stroke="#4a7fb5" strokeWidth="2.5" transform="rotate(30 162 148)"/>
      <circle cx="173" cy="158" r="11" fill="white" stroke="#4a7fb5" strokeWidth="2.5"/>
      <rect x="91" y="116" width="18" height="5" rx="2.5" fill="#4d9068" opacity="0.55"/>
      <rect x="97" y="110" width="5" height="18" rx="2.5" fill="#4d9068" opacity="0.55"/>
    </svg>
  );
}

function DozeButtonIcon() {
  return (
    <svg width="36" height="36" viewBox="30 35 140 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="100" width="96" height="130" rx="22" fill="white" stroke="#4a7fb5" strokeWidth="4"/>
      <rect x="60" y="164" width="80" height="58" rx="9" fill="#E8F8EF"/>
      <rect x="62" y="88" width="76" height="18" rx="9" fill="#4a7fb5"/>
      <rect x="90" y="50" width="20" height="46" rx="8" fill="#4a7fb5"/>
      <rect x="78" y="40" width="44" height="18" rx="9" fill="#4a7fb5"/>
      <ellipse cx="82" cy="140" rx="16" ry="17" fill="white" stroke="#4a7fb5" strokeWidth="2.5"/>
      <ellipse cx="118" cy="140" rx="16" ry="17" fill="white" stroke="#4a7fb5" strokeWidth="2.5"/>
      <circle cx="84" cy="141" r="9" fill="#4a7fb5"/>
      <circle cx="120" cy="141" r="9" fill="#4a7fb5"/>
      <circle cx="87" cy="137" r="3.5" fill="white"/>
      <circle cx="123" cy="137" r="3.5" fill="white"/>
      <path d="M84 163 Q100 176 116 163" stroke="#1d1d1f" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <rect x="88" y="228" width="24" height="20" rx="5" fill="#4a7fb5"/>
      <rect x="91" y="116" width="18" height="5" rx="2.5" fill="#4d9068" opacity="0.55"/>
      <rect x="97" y="110" width="5" height="18" rx="2.5" fill="#4d9068" opacity="0.55"/>
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#eef1fc] flex items-center justify-center flex-shrink-0 overflow-hidden">
        <DozeAvatar size={14} />
      </div>
      <div className="bg-[#f5f5f7] rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-[#4a7fb5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#4a7fb5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#4a7fb5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatMessage(content: string) {
  const parts = content.split('\n').filter(line => line.trim() !== '');
  return parts.map((line, i) => {
    let formatted = escapeHtml(line)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const isBullet = /^[-•]\s/.test(line.trim());
    const isNumbered = /^\d+[.)]\s/.test(line.trim());

    if (isBullet || isNumbered) {
      return <div key={i} className="ml-3 mb-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
    }
    return <div key={i} className="mb-1.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

export function DozeChat() {
  const { language } = useI18n();
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
      setMessages([{ role: 'assistant', content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en }]);
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
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: ERROR_MESSAGES[language] || ERROR_MESSAGES.en }]);
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
        className={`absolute bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{ height: isOpen ? '500px' : '0px', maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="bg-[#4a7fb5] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <DozeButtonIcon />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">Doze</h3>
              <p className="text-[11px] text-white/60">DOZEY Health Assistant</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-[#f5f5f7]/50">
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
                    ? 'bg-[#4a7fb5] text-white rounded-br-md'
                    : 'bg-white text-[#1d1d1f] rounded-bl-md shadow-sm'
                }`}
              >
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-black/5 bg-white px-3 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Doze anything..."
              className="flex-1 bg-[#f5f5f7] rounded-full px-4 py-2.5 text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none focus:ring-2 focus:ring-[#4a7fb5]/10 transition-shadow"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#4a7fb5] text-white flex items-center justify-center hover:bg-[#3d6d9e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={`ml-auto w-14 h-14 rounded-full shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md ${
          isOpen
            ? 'bg-[#4a7fb5] text-white'
            : 'bg-[#4a7fb5] text-white'
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
