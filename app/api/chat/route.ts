import { NextResponse } from "next/server";

type ChatRequest = {
  message?: string;
};

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}

function buildReply(userTextRaw: string): string {
  const text = normalize(userTextRaw);

  if (!text) {
    return "Me manda o que você quer comprar e como pretende usar 🙂";
  }

  // intents
  const mentionsShoes = hasAny(text, ["tenis", "sapato", "sneaker", "corrida"]);
  const mentionsNike = text.includes("nike");
  const mentionsCheap = hasAny(text, [
    "barato",
    "preco",
    "promo",
    "promocao",
    "desconto",
    "custo beneficio"
  ]);
  const mentionsShaver = hasAny(text, [
    "maquina de barbear",
    "barbeador",
    "raspar",
    "lamina",
    "navalha"
  ]);
  const wantsSuggestion = hasAny(text, [
    "me recomenda",
    "recomenda",
    "sugestao",
    "sugestão",
    "indica",
    "qual voce escolhe",
    "qual o melhor"
  ]);

  // Quick help / greeting
  if (hasAny(text, ["oi", "ola", "olá", "eai", "e ai", "bom dia", "boa tarde", "boa noite"])) {
    return "Oi! Eu sou a Lux 🙂 Me diz o que você quer comprar e o que é mais importante pra você (preço, qualidade ou praticidade).";
  }

  // Shaver flow
  if (mentionsShaver) {
    return [
      "Fechou. É pra barba, cabeça ou corpo? E sua pele é sensível?",
      "Boa. Você quer raspar bem rente ou só aparar? E qual faixa de preço você quer gastar?",
      "Entendi. Você usa todo dia ou só de vez em quando? Isso muda o tipo ideal."
    ][0];
  }

  // Shoes flow
  if (mentionsShoes || mentionsNike) {
    if (mentionsCheap) {
      return "Show. Você quer um tênis mais pra corrida/treino ou casual? E qual é seu orçamento máximo?";
    }
    if (mentionsNike) {
      return "Nike é top 👟 Você prioriza conforto, estilo ou performance? E vai usar mais pra quê (treino, dia a dia, sair)?";
    }
    return "Boa! Você quer um tênis esportivo (treino/corrida) ou casual? E tem um orçamento em mente?";
  }

  // Price / promo flow
  if (mentionsCheap) {
    return "Perfeito. Qual é seu orçamento máximo? E você aceita alternativas parecidas (mesma proposta) mais baratas?";
  }

  // Suggestion flow
  if (wantsSuggestion) {
    const openers = [
      "Bora. Rapidinho:",
      "Fechou — duas perguntas e eu te digo o melhor:",
      "Boa. Me responde duas coisas:"
    ];
    return `${pickOne(openers)} 1) Quanto você quer gastar (faixa)? 2) O que você prioriza: preço, qualidade ou praticidade?`;
  }

  // Generic decision helper
  if (hasAny(text, ["duvida", "dúvida", "indecis", "nao sei", "não sei", "escolher", "decidir"])) {
    return "Normal. Me diz: qual é seu orçamento e quais 2 opções você está entre? Eu te digo qual faz mais sentido e por quê.";
  }

  // Fallback
  return "Entendi. Me fala o que você quer comprar e como vai usar (ex: dia a dia, trabalho, treino). Aí eu te guio sem você precisar pesquisar fora 🙂";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const message = typeof body.message === "string" ? body.message : "";

    const reply = buildReply(message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Ops — deu um erro aqui. Tenta mandar de novo em uma frase curta 🙂" },
      { status: 200 }
    );
  }
}
