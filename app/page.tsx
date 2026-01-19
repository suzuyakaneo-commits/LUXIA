"use client";

import { useMemo, useState } from "react";

type ChatMsg = { role: "user" | "lux"; text: string };

export default function Home() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  const statusText = useMemo(() => "Lux está online", []);

  function send() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    // resposta instantânea (Lux bebê)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "lux",
          text: "Oi! Eu sou a Lux. Me diga o que você quer comprar que eu te ajudo 🙂"
        }
      ]);
    }, 150);
  }

  return (
    <main className="container">
      <div className="card">
        <h1 style={{ margin: 0 }}>LuxAI – Demo</h1>
        <p style={{ marginTop: 6, marginBottom: 14, opacity: 0.8 }}>
          {statusText}
        </p>

        <div className="row">
          <button
            className="luxBubble"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir Lux"
            title="Abrir Lux"
          >
            Lux
          </button>

          <div style={{ opacity: 0.75 }}>
            Clique na Lux para abrir o mini chat.
          </div>
        </div>

        {open && (
          <div className="chat">
            <div className="messages">
              {messages.length === 0 ? (
                <div style={{ opacity: 0.6, fontSize: 14 }}>
                  Envie uma mensagem para ver a Lux responder.
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`msg ${m.role === "user" ? "user" : "lux"}`}
                  >
                    {m.text}
                  </div>
                ))
              )}
            </div>

            <div className="composer">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <button onClick={send}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
