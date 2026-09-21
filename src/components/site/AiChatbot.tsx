import { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";
import { Bot, X, Send, RotateCcw, Loader2, ChevronDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  content: `Assalomu alaykum! Men **UniTop AI** maslahatchiman.\n\n${DATA_YEAR}-yil o'tish ballari, universitetlar va yo'nalishlar bo'yicha savollaringizga javob beraman.\n\nQanday savolingiz bor?`,
  timestamp: "Hozir",
};

const QUICK_PROMPTS = [
  `${DATA_YEAR}-yil o'tish ballari`,
  "140 bilan qaysi OTM?",
  "TATU Dasturiy injiniring",
  "DTM necha ball?",
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom();
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
          replyText = "Javob olishda xatolik. Qaytadan urinib ko'ring.";
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Server bilan bog'lanishda uzilish. Qaytadan yuboring.",
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

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="AI Yordamchi"
            className="group flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Bot className="size-4" />
            <span className="text-sm font-medium">AI Yordamchi</span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950 ${
            isMinimized
              ? "bottom-20 md:bottom-6 right-4 w-64 h-12"
              : "bottom-16 md:bottom-6 right-0 md:right-6 w-full md:w-[380px] h-[calc(100vh-5rem)] md:h-[560px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <Bot className="size-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  UniTop AI
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {loading ? "Javob yozmoqda..." : "Onlayn"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([INITIAL_MESSAGE])}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <ChevronDown
                  className={`size-4 transition-transform ${isMinimized ? "rotate-180" : ""}`}
                />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <Bot className="size-3.5" />
                      </div>
                    )}
                    <div className="group relative max-w-[80%]">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <Markdown
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="list-disc pl-3 mb-1.5 space-y-0.5 text-sm">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-3 mb-1.5 space-y-0.5 text-sm">
                                {children}
                              </ol>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold">{children}</strong>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-black/10 px-1 py-0.5 text-xs dark:bg-white/10">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="opacity-0 group-hover:opacity-100 transition"
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
                  <div className="flex gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Bot className="size-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Loader2 className="size-3 animate-spin" />
                      <span>O'ylamoqda...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 2 && (
                <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
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
                    placeholder="Savol yozing..."
                    disabled={loading}
                    className="flex-1 max-h-24 min-h-[36px] resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-white"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || loading}
                    className="size-9 shrink-0 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </form>
                <div className="mt-1.5 text-center text-[10px] text-slate-400">
                  Gemini AI bilan quvvatlangan
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
