"use client";
import { RootState } from '@/Redux/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push("SignIn");
    } else {
      router.push("home");
    }
  }, [token, router]);

  return null;
}
