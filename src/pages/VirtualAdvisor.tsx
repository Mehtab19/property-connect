import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Building2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prime-x-chat`;

const VirtualAdvisor = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm your Prime X Property Advisor.\n\nI'm here to personally guide you through finding the perfect property. Let's start simple — **are you looking to buy, rent, or invest?**",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages, mode: "virtual-advisor" }),
      });

      if (!resp.ok || !resp.body) throw new Error(`Error: ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > newMessages.length) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I ran into a hiccup. Could you try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-lg gradient-purple-blue flex items-center justify-center">
          <Building2 className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground">Virtual Property Advisor</h1>
          <p className="text-xs text-muted-foreground">Your personal guide</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}>
            <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-secondary" : "gradient-purple-blue"}`}>
              {msg.role === "user" ? <User className="w-4 h-4 text-secondary-foreground" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${msg.role === "user" ? "bg-secondary text-secondary-foreground rounded-tr-md" : "bg-card border border-border text-foreground rounded-tl-md shadow-glow"}`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_li]:mb-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full gradient-purple-blue flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-md px-5 py-4 shadow-glow">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-float" />
                <span className="w-2 h-2 rounded-full bg-primary animate-float" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-float" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-lg border-t border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-muted text-foreground rounded-full px-5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-full gradient-purple-blue flex items-center justify-center text-primary-foreground disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualAdvisor;
