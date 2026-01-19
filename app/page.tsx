"use client";

import { useState } from "react";

type Message = {
  id: string;
  author: "user" | "lux";
  text: string;
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [debugReply, setDebugReply] = useState("");
  const [debugRaw, setDebugRaw] = useState("");

  const handleToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      author: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmed }),
    });

    const data = await res.json();
    const raw = JSON.stringify(data);
    const text = data.reply ?? data.message ?? raw;

    const luxMessage: Message = {
      id: `${Date.now()}-lux`,
      author: "lux",
      text,
    };

    setMessages((prev) => [...prev, luxMessage]);
    setDebugReply(text);
    setDebugRaw(raw);
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
            <p>
              DEBUG last reply: {debugReply}
              <br />
              DEBUG last raw: {debugRaw}
            </p>
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
