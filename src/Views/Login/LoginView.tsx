'use client';
import UseAuthenticationViewModel from '@/ViewModels/Authentication/AuthenticationViewModel';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginView = () => {
    const router = useRouter();
    const [showRegister, setShowRegister] = useState(false);

    const { email, emailError, setEmail, password, passwordError, setPassword, signUp } = UseAuthenticationViewModel();
    return (

        <div className='bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 flex flex-col items-center justify-center min-h-[300px]'> {/* Ajuste a classe h-screen para min-h-screen */}
            <div className='w-full max-w-sm min-w-[200px]'>
                <div className='relative'>
                    <input
                        type='email'
                        className='w-full bg-transparent placeholder:text-slate-400  text-white text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'
                        placeholder='Digite seu e-mail'
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>

                        Use at least 6 characters, one uppercase, one lowercase and one number.
                    </p>
                </div>
            </div>

            {passwordError && <span className='text-red-600 text-sm'>{passwordError}</span>}

            <div className="flex flex-col items-center justify-center">
                {(
                    <button
                        onClick={() => router.replace("RegisterUser")}
                        className="p-3 bg-blue-500 text-white rounded-md shadow-md"
                    >
                        Cadastrar Conta
                    </button>
                )}
            </div>
            <button disabled={!!emailError || !!passwordError} className="mt-4 p-2 bg-blue-500 text-white rounded-md" onClick={signUp}>
                Entrar
            </button>
        </div>
    );
}

export default LoginView;
