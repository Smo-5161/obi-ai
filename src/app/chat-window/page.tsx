"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindowPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [brainId, setBrainId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Omi — Assistant";
    const stored = window.localStorage.getItem("omi-chat-brain");
    if (stored) {
      setBrainId(stored);
      return;
    }
    fetch("/api/brains")
      .then((r) => (r.ok ? r.json() : []))
      .then((b: { id: string }[]) => setBrainId(b[0]?.id ?? ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = useCallback(async () => {
    const q = question.trim();
    if (!q || asking || !brainId) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    setAsking(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brainId, question: q }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: msg.content }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Je n'ai pas pu répondre (session expirée ou Brain indisponible)." },
        ]);
      }
    } finally {
      setAsking(false);
    }
  }, [asking, brainId, question]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between border-b-2 border-line bg-accent px-3 py-2 text-background">
        <span className="text-sm font-bold">Omi — Assistant</span>
        <span className="text-[10px] opacity-80">fenêtre libre</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto bg-background p-2">
        {messages.length === 0 && (
          <p className="mt-4 text-center text-xs text-muted">
            Posez une question sur les processus de votre poste.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap border-2 p-2 text-xs ${
              m.role === "user"
                ? "ml-auto border-ink bg-accent text-background"
                : "border-line bg-paper-raised text-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {asking && (
          <div className="border-2 border-line bg-paper-raised p-2 text-xs text-muted">
            Omi réfléchit…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t-2 border-line p-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Ex: Comment faire le reporting ?"
          autoFocus
          className="min-w-0 flex-1 border-2 border-line bg-paper-raised p-1.5 text-xs text-text-strong"
        />
        <button
          onClick={ask}
          disabled={asking || !brainId}
          className="shrink-0 border-2 border-ink bg-accent px-2 text-xs font-bold text-background disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
