"use client";
import UseAuthenticationViewModel from "@/ViewModels/Authentication/AuthenticationViewModel";
import { useRouter } from "next/navigation";

const LoginView = () => {
  const router = useRouter();
  const {
    loading,
    email,
    emailError,
    setEmail,
    password,
    passwordError,
    setPassword,
    signIn,
    errorSign,
  } = UseAuthenticationViewModel();

  const handleGoToHome = () => router.push('/home');
  const handleLogin = async () => {
    const response = await signIn();
    if (response) {
      handleGoToHome();
    }
  };

  return (
    <div className="w-full">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-3 rounded-full bg-white/5 px-4 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm shadow-[#3B82F6]/10">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4v16" />
              <path d="M9 4v16" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold tracking-tight text-white">RMTECH</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-300">SOFTWARE</div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white">Acessar Plataforma</h1>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </span>
            <input
              id="email"
              type="email"
              className="w-full rounded-3xl border border-[#374151] bg-[#1F2937] py-4 pl-14 pr-4 text-sm text-white placeholder-slate-400 shadow-sm transition focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/15"
              placeholder="robertpinto1190@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">Senha</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              id="password"
              type="password"
              className="w-full rounded-3xl border border-[#374151] bg-[#1F2937] py-4 pl-14 pr-4 text-sm text-white placeholder-slate-400 shadow-sm transition focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/15"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-3 flex items-start gap-2 text-sm text-slate-400">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </span>
            <span>Use pelo menos 8 caracteres, um maiúsculo, um minúsculo e um número.</span>
          </div>
        </div>
      </div>

      {passwordError && <p className="mt-4 text-sm font-medium text-red-500">{passwordError}</p>}
      {errorSign && <p className="mt-2 text-sm font-medium text-red-500">{errorSign}</p>}

      <div className="mt-8">
        <button
          type="button"
          disabled={!!emailError || !!passwordError || loading}
          onClick={handleLogin}
          className="w-full rounded-3xl bg-[#3B82F6] px-5 py-4 text-base font-semibold text-white shadow-lg shadow-[#3B82F6]/20 transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Entrar na minha conta
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-slate-400">
        Não tem registro?{' '}
        <button type="button" onClick={() => router.replace("RegisterUser")} className="font-semibold text-[#3B82F6] underline decoration-[#3B82F6] underline-offset-4">
          Criar conta
        </button>
      </p>
    </div>
  );
};

export default LoginView;
