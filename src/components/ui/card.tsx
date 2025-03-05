import { cn } from "@/libs/utils";
import { ReactNode } from "react";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("bg-white shadow-md rounded-xl p-4", className)}>{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
