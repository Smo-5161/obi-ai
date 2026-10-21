"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [brainId, setBrainId] = useState<string>("");
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/brains")
      .then((r) => (r.ok ? r.json() : []))
      .then((b: { id: string }[]) => setBrainId(b[0]?.id ?? ""))
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function onPointerDown(e: React.PointerEvent) {
    dragRef.current = {
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    setPos({
      x: Math.min(Math.max(e.clientX - dragRef.current.dx, 8), window.innerWidth - 80),
      y: Math.min(Math.max(e.clientY - dragRef.current.dy, 8), window.innerHeight - 60),
    });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  async function ask() {
    const q = question.trim();
    if (!q || asking || !brainId) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    setAsking(true);
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
    setAsking(false);
  }

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 select-none rounded-none border-2 border-ink bg-accent px-4 py-3 font-bold text-background shadow-[3px_3px_0_0_var(--ink)]"
          aria-label="Ouvrir l'assistant Omi"
        >
          Demander à Omi
        </button>
      ) : (
        <div
          className="fixed z-50 flex w-80 flex-col rounded-none border-2 border-ink bg-paper-raised shadow-[4px_4px_0_0_var(--ink)]"
          style={{ left: pos.x, top: pos.y }}
        >
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="flex cursor-move items-center justify-between border-b-2 border-line bg-accent px-3 py-2 text-background"
          >
            <span className="text-sm font-bold">Omi</span>
            <div className="flex items-center gap-2">
              {brainId && (
                <Link
                  href={`/brains/${brainId}`}
                  className="text-xs underline hover:text-paper"
                  onClick={(e) => e.stopPropagation()}
                >
                  Brain
                </Link>
              )}
              <button
                onClick={() => setOpen(false)}
                className="border border-background px-1.5 text-xs font-bold hover:bg-background hover:text-accent"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
          </div>

          <div className="h-64 space-y-2 overflow-y-auto border-b-2 border-line bg-background p-2">
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

          <div className="flex gap-2 p-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="Ex: Comment faire le reporting ?"
              className="min-w-0 flex-1 border-2 border-line bg-background p-1.5 text-xs text-text-strong"
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
      )}
    </>
  );
}
