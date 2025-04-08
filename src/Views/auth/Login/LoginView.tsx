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
      handleGoToHome()
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 flex flex-col items-center justify-center">
      <label className="text-2xl text-gray-900 dark:text-white pb-3">
        Sign in to our platform
      </label>
      <div className="w-full max-w-sm min-w-[500px]">
        <div className="relative">
          <input
            type="email"
            className="w-full bg-transparent placeholder:text-slate-200  text-white text-lg border border-slate-600 rounded-md pl-3 pr-16 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full max-w-sm min-w-[500px] mt-4">
        <div className="relative">
          <input
            type="password"
            className="w-full pl-3 pr-10 py-3 bg-transparent placeholder:text-slate-200 text-white text-lg border border-slate-600 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="flex items-start mt-2 text-xs text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-1.5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
            Use pelo menos 6 caracteres, um maiúsculo, um minúsculo e um número.{" "}
          </p>
        </div>
      </div>
      {passwordError && (
        <span className="text-red-600 text-sm">{passwordError}</span>
      )}
      {errorSign && (
        <span className="text-red-600 text-sm">{errorSign}</span>
      )}

      {loading ? (
        <div className="loader"></div>
      ) : (
        <button
          disabled={!!emailError || !!passwordError}
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          onClick={handleLogin}
        >
          Login to your account
        </button>
      )}
      <div className="mt-4 flex flex-col items-center justify-center">
        {
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300" onClick={() => router.replace("RegisterUser")}>
            Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
          </div>
          // <label
          //   onClick={() => router.replace("RegisterUser")}
          //   className="text-xs text-blue-400 cursor-pointer"
          // >
          //   Create Account
          // </label>
        }
      </div>
    </div>
  );
};

export default LoginView;
