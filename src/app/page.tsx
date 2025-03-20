"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
export default function Home() {
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push("/SignUp");
    }
    else {
      router.push("/home");
    }
  }, [token, router]);

  return null;
}
