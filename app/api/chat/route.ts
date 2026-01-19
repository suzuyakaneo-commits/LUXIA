import { NextResponse } from "next/server";

type ChatRequest = {
  message: string;
};

const DEFAULT_REPLY =
  "Me fala o que você quer comprar e como você vai usar. Aí eu te faço 2 perguntas rápidas e te guio pra melhor escolha 🙂";

const RULES: Array<{
  match: (message: string) => boolean;
  reply: string;
}> = [
  {
    match: (message) => message.includes("tênis") || message.includes("tenis"),
    reply: "Você quer pra treino/corrida, casual ou dia a dia? E qual orçamento máximo?",
  },
  {
    match: (message) => message.includes("nike"),
    reply: "Nike tem várias linhas. Você prioriza conforto, estilo ou performance? E quanto quer gastar?",
  },
  {
    match: (message) =>
      message.includes("barato") ||
      message.includes("promo") ||
      message.includes("promoção") ||
      message.includes("preço") ||
      message.includes("preco"),
    reply: "Qual é seu teto de orçamento? Prefere o mais barato possível ou melhor custo-benefício?",
  },
  {
    match: (message) =>
      message.includes("máquina de barbear") ||
      message.includes("maquina de barbear") ||
      message.includes("barbeador") ||
      message.includes("aparador"),
    reply: "É pra barba, cabelo ou corpo? Sua pele é sensível? Vai usar todo dia ou só às vezes?",
  },
  {
    match: (message) => message.includes("microfone"),
    reply: "É pra gravação de voz, live/stream ou reunião? Vai usar no PC ou celular? Tem um orçamento?",
  },
  {
    match: (message) => message.includes("teclado"),
    reply: "Você quer pra jogar ou trabalhar? Prefere mecânico ou não liga? Qual faixa de preço?",
  },
  {
    match: (message) =>
      message.includes("me recomenda") ||
      message.includes("sugere") ||
      message.includes("sugestão"),
    reply:
      "Fechado. Me diz só 2 coisas: (1) seu orçamento máximo e (2) o que é prioridade: preço, qualidade ou marca?",
  },
];

const getReply = (message: string) => {
  const normalized = message.toLowerCase();

  const rule = RULES.find(({ match }) => match(normalized));
  return rule?.reply ?? DEFAULT_REPLY;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const reply = getReply(body.message ?? "");

  return NextResponse.json({ reply });
}
