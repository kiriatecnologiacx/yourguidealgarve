import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouGuideAlgarve — As melhores experiências no Algarve",
  description:
    "Atividades, tours, ingressos e experiências inesquecíveis em todo o Algarve. Reservas com cancelamento gratuito.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">{children}</body>
    </html>
  );
}
