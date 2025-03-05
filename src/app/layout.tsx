import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../Redux/Providers"; // Importe os Providers
import "../styles/globals.css";
import Header from "./Shared/components/Header";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <title>BudgetPath</title>
        <meta name="Description" content="Aplicação criada com Next"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Header />
        <Providers>{children}</Providers> {/* Redux Provider */}
      </body>
    </html>
  );
}
