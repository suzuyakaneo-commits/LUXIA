import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxAI – Demo",
  description: "LuxAI demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
