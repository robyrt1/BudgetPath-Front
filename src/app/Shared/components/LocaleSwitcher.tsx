'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

const FLAG: Record<string, string> = {
    pt: '🇧🇷',
    en: '🇺🇸',
};

const LABEL: Record<string, string> = {
    pt: 'Português',
    en: 'English',
};

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const switchLocale = (newLocale: string) => {
        // Replace locale prefix in current path
        const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
        router.push(`/${newLocale}${pathWithoutLocale || '/'}`);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                title={LABEL[locale]}
            >
                <span className="text-lg">{FLAG[locale]}</span>
                <span className="hidden sm:inline text-xs font-medium">{LABEL[locale]}</span>
                <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-36 rounded-xl border border-white/10 bg-[#111827] shadow-xl z-50 overflow-hidden">
                    {routing.locales.map(l => (
                        <button
                            key={l}
                            onClick={() => switchLocale(l)}
                            className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${
                                l === locale
                                    ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="text-base">{FLAG[l]}</span>
                            <span>{LABEL[l]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
