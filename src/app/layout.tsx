import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../Redux/Providers";
import "../styles/globals.css";
import LayoutWrapper from "./Shared/components/LayoutWrapper"; // Importamos o wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance",
  description: "Aplicação criada com Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>BudgetPath</title>
        <meta name="description" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
