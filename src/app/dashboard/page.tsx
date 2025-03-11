"use client";

import DashboardView from "@/Views/dashboard/dashboardView";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../Shared/components/Sidebar";
import Loading from "./loading";

export default function Dashboard() {
  const router = useRouter();
  const token = useSelector((state: any) => {
    return state.auth.token
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token === undefined) return;

    if (!token) {
      router.push("/SignUp");
    } else {
      setIsAuthenticated(true);
    }
  }, [token, router]);

  if (token === undefined || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <div style={{ padding: "20px" }}>

      <Sidebar />

      <DashboardView />
    </div>
  );
}
