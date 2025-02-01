"use client";
import { UseRegisterUserViewModel } from "@/ViewModels/RegisterUser/RegisterUserViewModel";
import { useRouter } from "next/navigation";

const RegisterUserView = () => {
  const {
    loading,
    name,
    nameError,
    setName,
    email,
    emailError,
    setEmail,
    password,
    messageSuccess,
    passwordError,
    errorResponse,
    setPassword,
    register,
  } = UseRegisterUserViewModel();

  const router = useRouter();
  const handleGoToSignUp = () => router.replace('/SignUp');

  const handleRegister = async () => {
      const response = await register();
      if (response) {
        handleGoToSignUp()
      }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 flex flex-col items-center justify-center min-h-[300px]">
      <label className="text-2xl text-gray-900 dark:text-white pb-2">Cadastrar Conta</label>
      <div className="w-full max-w-sm min-w-[200px]">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-transparent placeholder:text-slate-400  text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Digite seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <div className="relative">
          <input
            type="email"
            className="w-full bg-transparent placeholder:text-slate-400  text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <div className="relative">
          <input
            type="password"
            className="w-full pl-3 pr-3 py-2 bg-transparent placeholder:text-write-400 text-white text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
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
            Use pelo menos 6 caracteres, um maiúsculo, um minúsculo e um número.
          </p>
        </div>
      </div>
      {messageSuccess && (
        <span className="text-green-600 text-sm">{messageSuccess}</span>
      )}
      {errorResponse && (
        <span className="text-red-600 text-sm">{errorResponse}</span>
      )}
      {passwordError && (
        <span className="text-red-600 text-sm">{passwordError}</span>
      )}
      {emailError && <span className="text-red-600 text-sm">{emailError}</span>}
      {nameError && <span className="text-red-600 text-sm">{nameError}</span>}
      {loading ? (
        <div className="loader"></div>
      ) : (
        <button
          disabled={
            !!emailError || !!passwordError || !email || !password || !name
          }
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          onClick={handleRegister}
        >
          Cadastrar
        </button>
      )}
    </div>
  );
};

export default RegisterUserView;
