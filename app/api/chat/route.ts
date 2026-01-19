import { NextResponse } from "next/server";

type ChatPayload = {
  message?: string;
  text?: string;
  input?: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getReply = (input: string) => {
  const message = normalize(input);

  if (/\b(oi|ola|olá|eai|e ai|bom dia|boa tarde|boa noite)\b/.test(message)) {
    return "Oi! Como posso te ajudar hoje?";
  }

  if (/\b(preco|preço|valor|custa|custar)\b/.test(message)) {
    return "Posso te ajudar com preços. Qual produto você quer saber?";
  }

  if (/\b(frete|entrega|envio|prazo)\b/.test(message)) {
    return "Temos entrega rápida. Me diga sua cidade para estimar o prazo.";
  }

  if (/\b(obrigado|obrigada|valeu|agradecido)\b/.test(message)) {
    return "De nada! Se precisar de algo, é só chamar.";
  }

  return "Certo! Me diga mais detalhes sobre o que você procura.";
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ChatPayload;
  const text = body.message ?? body.text ?? body.input ?? "";
  const reply = getReply(text);

  return NextResponse.json({
    reply,
    message: reply,
  });
}
