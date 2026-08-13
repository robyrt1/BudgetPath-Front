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
    signInWithGoogle,
    errorSign,
  } = UseAuthenticationViewModel();

  const handleGoToHome = () => router.push('/home');
  const handleLogin = async () => {
    const response = await signIn();
    if (response) {
      handleGoToHome();
    }
  };

  const handleGoogleLogin = async () => {
    const response = await signInWithGoogle();
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
              placeholder="digite seu email"
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

      <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-sm">ou</span>
          <div className="flex-grow border-t border-white/10"></div>
      </div>

      <div>
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-base font-semibold text-white shadow-md transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Entrar com Google
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
