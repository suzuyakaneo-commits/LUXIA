"use client";

import { useState } from "react";

type Message = {
  id: string;
  role: "user" | "lux";
  text: string;
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [debug, setDebug] = useState({ lastRaw: "", lastReply: "" });

  const handleToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", text: trimmed },
    ]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed }),
    });
    const data = await res.json();
    const text = data.reply ?? data.message ?? JSON.stringify(data);
    setDebug({
      lastRaw: JSON.stringify(data, null, 2),
      lastReply: text,
    });
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-lux`, role: "lux", text },
    ]);
    setInput("");
  };

  return (
    <main className="page">
      <header className="hero">
        <h1>LuxAI – Demo</h1>
        <p>Lux está online</p>
      </header>

      <section className="chat">
        <button className="lux-button" type="button" onClick={handleToggle}>
          Lux
        </button>

        {isChatOpen ? (
          <div className="chat-panel" aria-live="polite">
            <div className="messages">
              {messages.length === 0 ? (
                <p className="empty">Nenhuma mensagem ainda.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role}`}
                  >
                    <span>{message.text}</span>
                  </div>
                ))
              )}
            </div>
            <details className="debug">
              <summary>Debug</summary>
              <div>
                <strong>Last reply:</strong>
                <pre>{debug.lastReply}</pre>
              </div>
              <div>
                <strong>Last raw:</strong>
                <pre>{debug.lastRaw}</pre>
              </div>
            </details>
            <form className="composer" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Digite sua mensagem"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        ) : null}
      </section>
    </main>
  );
}
