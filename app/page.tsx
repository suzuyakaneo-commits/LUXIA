"use client";

import { useState } from "react";

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
  const [lastRaw, setLastRaw] = useState("");
  const [lastReply, setLastReply] = useState("");

  const handleToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = Date.now();
    const userMessage: Message = {
      id: `${now}-user`,
      author: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let raw = "";
    let replyText = LUX_REPLY;

    try {
      const response = await fetch("/api/lux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      });
      raw = await response.text();
      try {
        const data = JSON.parse(raw) as { reply?: string; text?: string };
        replyText = data.reply ?? data.text ?? raw ?? LUX_REPLY;
      } catch {
        replyText = raw || LUX_REPLY;
      }
    } catch (error) {
      raw = error instanceof Error ? error.message : String(error);
      replyText = LUX_REPLY;
    }

    const luxMessage: Message = {
      id: `${now}-lux`,
      author: "lux",
      text: replyText,
    };

    setMessages((prev) => [...prev, luxMessage]);
    setLastRaw(raw);
    setLastReply(replyText);
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
                    className={`message ${message.author}`}
                  >
                    <span>{message.text}</span>
                  </div>
                ))
              )}
            </div>
            <div className="debug">
              <p>
                <strong>lastRaw:</strong> {lastRaw || "-"}
              </p>
              <p>
                <strong>lastReply:</strong> {lastReply || "-"}
              </p>
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
        ) : null}
      </section>
    </main>
  );
}
