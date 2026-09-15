import { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";
import {
  Bot,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Loader2,
  ChevronDown,
  MessageSquare,
  Copy,
  Check,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { DATA_YEAR } from "@/data/demo";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Assalomu alaykum! Men **UniTop AI** — Oliy ta'lim va abituriyentlar bo'yicha sun'iy intellekt maslahatchisiman. 🎓\n\nSizga quyidagilar bo'yicha yordam bera olaman:\n- **${DATA_YEAR}-yil o'tish ballari** (grant va kontrakt)\n- **Universitet va yo'nalishlar** tanlash (TATU, TDIU, O'zMU va h.k.)\n- **DTM test tizimi** va ball hisoblash mezonlari\n- Shuningdek har qanday savolingizga javob beraman!\n\nQanday savolingiz bor?`,
  timestamp: "Hozir",
};

const QUICK_PROMPTS = [
  `${DATA_YEAR}-yil o'tish ballari qanday?`,
  "140 ball bilan qaysi OTMga kirsam bo'ladi?",
  "TATU Dasturiy injiniring ballari qancha?",
  "DTM testida maksimal necha ball to'plash mumkin?",
  "Admin bilan qanday bog'lansa bo'ladi?",
];

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim();
      if (!query || loading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const historyPayload = newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let replyText = "";

        const fetchRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyPayload }),
        });

        if (fetchRes.ok) {
          const json = await fetchRes.json();
          replyText = json.text || "";
        }

        if (!replyText) {
          replyText =
            "Kechirasiz, javob olishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring yoki admin bilan bog'laning: @unitopuz_support";
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error("Chat error:", err);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Server bilan bog'lanishda uzilish bo'ldi. Iltimos, qaytadan yuboring yoki savolingizni adminimizga yo'llang: @unitopuz_support",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    },
    [input, loading, messages],
  );

  // Listen for global custom open event
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setIsMinimized(false);
      if (customEvent.detail?.prompt) {
        handleSendMessage(customEvent.detail.prompt);
      }
    };
    window.addEventListener("open-unitop-chat", handleOpenChat);
    return () => window.removeEventListener("open-unitop-chat", handleOpenChat);
  }, [handleSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
          <button
            id="unitop-ai-launcher-btn"
            onClick={() => setIsOpen(true)}
            aria-label="UniTop AI Maslahatchisi"
            className="group relative flex items-center gap-2.5 rounded-full bg-navy px-4 py-3 text-white shadow-xl shadow-navy/30 transition-all duration-300 hover:scale-105 hover:bg-navy/95 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="relative flex size-6 items-center justify-center">
              <Bot className="size-5 transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400" />
            </span>
            <div className="flex flex-col items-start pr-1 text-left">
              <span className="text-xs font-bold leading-none tracking-tight flex items-center gap-1">
                UniTop AI <Sparkles className="size-3 text-amber-300 fill-amber-300" />
              </span>
              <span className="text-[10px] text-white/75 font-normal leading-tight">
                Savollarga javoblar
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="unitop-ai-chat-window"
          className={`fixed z-50 transition-all duration-200 ${
            isMinimized
              ? "bottom-20 md:bottom-6 right-4 w-72 h-14"
              : "bottom-16 md:bottom-6 right-0 md:right-6 w-full md:w-[420px] h-[calc(100vh-5rem)] md:h-[620px] max-h-[90vh]"
          } flex flex-col rounded-t-2xl md:rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 bg-navy px-4 py-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white border border-white/10">
                <Bot className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight leading-none text-white">
                  UniTop AI Maslahatchi
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-white/70 truncate leading-snug mt-0.5">
                  {DATA_YEAR}-yil o'tish ballari & Universitetlar
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Suhbatni yangilash"
                aria-label="Suhbatni yangilash"
                className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Kengaytirish" : "Kichraytirish"}
                aria-label={isMinimized ? "Kengaytirish" : "Kichraytirish"}
                className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <ChevronDown
                  className={`size-4 transition-transform ${isMinimized ? "rotate-180" : ""}`}
                />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Yopish"
                aria-label="Yopish"
                className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Bot className="size-3.5" />
                      </div>
                    )}

                    <div
                      className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-muted/70 text-foreground border border-border/70 rounded-bl-xs"
                      }`}
                    >
                      <div className="markdown-body select-text">
                        <Markdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                            ),
                            li: ({ children }) => <li className="mb-0.5">{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">{children}</strong>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target={href?.startsWith("http") ? "_blank" : undefined}
                                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="underline underline-offset-2 font-medium hover:text-primary transition"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2 text-[10px] opacity-60">
                        <span>{msg.timestamp}</span>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Nusxalash"
                            className="opacity-0 group-hover:opacity-100 transition p-0.5 hover:text-foreground"
                          >
                            {copiedId === msg.id ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Bot className="size-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-bl-xs bg-muted/70 border border-border/70 px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="size-3.5 animate-spin text-primary" />
                      <span>UniTop AI o'ylamoqda...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              {messages.length <= 2 && (
                <div className="border-t border-border/50 bg-secondary/30 px-3 py-2">
                  <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Sparkles className="size-3 text-primary" /> Tezkor savollar:
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="shrink-0 rounded-full border border-border/80 bg-background px-2.5 py-1 text-[11px] text-foreground hover:border-primary hover:bg-primary/5 transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Footer */}
              <div className="border-t border-border/80 bg-card p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Savolingizni yozing..."
                    disabled={loading}
                    className="flex-1 max-h-28 min-h-[40px] resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || loading}
                    className="size-10 shrink-0 rounded-xl"
                    aria-label="Yuborish"
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </form>

                <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-2.5 text-primary" /> Gemini AI bilan quvvatlangan
                  </span>
                  <a
                    href="https://t.me/unitopuz_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-foreground"
                  >
                    Admin: @unitopuz_support
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
