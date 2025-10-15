"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Loading = dynamic(() => import("./loading"), { ssr: false });
const HomeView = dynamic(() => import("@/Views/home/HomeView"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const token = useSelector((state: any) => {
    return state.auth.token
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token === undefined) return;

    if (!token) {
      router.push("/SignIn");
    } else {
      setIsAuthenticated(true);
    }
  }, [token, router]);

  if (token === undefined || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <HomeView />
  );
}
