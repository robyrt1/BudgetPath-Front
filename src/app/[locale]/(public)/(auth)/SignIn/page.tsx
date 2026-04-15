"use client";
import LoginView from "@/Views/auth/Login/LoginView";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SignInPage() {
  const t = useTranslations('auth');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0F1C] flex items-center justify-center px-4 py-8 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.12),_transparent_28%)]" />
      <div className="relative w-full max-w-[1500px] h-full mx-auto">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 lg:min-h-[800px] items-stretch">
          <div className="rounded-[40px] border border-white/5 bg-[#111827] p-8 lg:p-16 shadow-[0_40px_120px_rgba(2,8,41,0.24)] flex flex-col justify-center w-full">
            <LoginView />
          </div>

          <div className="hidden lg:flex items-center justify-center relative w-full overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#111827] to-[#0A0F1C] p-12 shadow-[0_40px_120px_rgba(2,8,41,0.28)]">
            <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-[#3B82F6]/5 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-center text-slate-100 max-w-lg w-full">
              <div className="space-y-8 mb-12">
                <div className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/5 px-6 py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#8ECBFF] mb-1">{t('welcome')}</p>
                    <h2 className="text-2xl font-semibold">{t('tagline')}</h2>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1D86FF]/15">
                    <Image src="/globe.svg" width={32} height={32} alt="Ilustração" />
                  </div>
                </div>

                <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-5">
                  <div className="h-48 rounded-[32px] bg-[#3B82F6]/10" />
                  <div className="h-24 rounded-[28px] bg-white/10" />
                </div>
              </div>

              <div className="grid gap-4 text-base leading-relaxed text-slate-300 px-2">
                <p>{t('description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
