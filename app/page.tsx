"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  author: "user" | "lux";
  text: string;
};

const LUX_REPLY =
  "Oi! Eu sou a Lux. Me diga o que você quer comprar que eu te ajudo 🙂";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    if (!isChatOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      author: "user",
      text: trimmed,
    };

    const luxMessage: Message = {
      id: `${Date.now()}-lux`,
      author: "lux",
      text: LUX_REPLY,
    };

    setMessages((prev) => [...prev, userMessage, luxMessage]);
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
          <div className="chat-overlay" onClick={handleClose}>
            <div
              className="chat-drawer open"
              onClick={(event) => event.stopPropagation()}
              aria-live="polite"
            >
              <header className="chat-drawer__header">
                <div>
                  <h2>Lux</h2>
                  <span className="status">online</span>
                </div>
                <button
                  className="close-button"
                  type="button"
                  onClick={handleClose}
                  aria-label="Fechar chat"
                >
                  ×
                </button>
              </header>
              <div className="messages">
                {messages.length === 0 ? (
                  <p className="empty">Nenhuma mensagem ainda.</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.author}`}
                    >
                      <span>{message.text}</span>
                    </div>
                  ))
                )}
              </div>
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
          </div>
        ) : null}
      </section>
    </main>
  );
}
