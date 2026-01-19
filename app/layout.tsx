import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LuxAI Demo",
  description: "LuxAI minimal demo",
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
