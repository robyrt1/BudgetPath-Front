import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../Redux/Providers"; // Importe os Providers
import "./globals.css";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <Providers>{children}</Providers> {/* Redux Provider */}
      </body>
    </html>
  );
}
