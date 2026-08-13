"use client";

import { RootState } from "@/Redux/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Loading = dynamic(() => import("./loading"), { ssr: false });
const AiView = dynamic(() => import("@/Views/ai/AiView"), { ssr: false });

export default function AiPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => {
    return state.auth.token;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token === undefined) return;

    if (!token) {
      router.push("SignIn");
    } else {
      setIsAuthenticated(true);
    }
  }, [token, router]);

  if (!isAuthenticated) {
    return <Loading />;
  }

  return <AiView />;
}
