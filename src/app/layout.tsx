import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BudgetPath",
  description: "Aplicação criada com Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
