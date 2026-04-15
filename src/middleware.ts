import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const publicPaths = ['/SignIn', '/RegisterUser'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathWithoutLocale = routing.locales.reduce(
        (path, locale) => path.replace(new RegExp(`^/${locale}`), ''),
        pathname
    ) || '/';

    // Public paths — just apply intl middleware (no auth check)
    const isPublicPath = publicPaths.some(p => pathWithoutLocale.startsWith(p));

    if (isPublicPath || pathWithoutLocale === '/') {
        return intlMiddleware(request);
    }

    // Private paths — check auth
    const token = request.cookies.get('token')?.value;
    if (!token) {
        const locale = routing.locales.find(l => pathname.startsWith(`/${l}`)) || routing.defaultLocale;
        return NextResponse.redirect(new URL(`/${locale}/SignIn`, request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        /*
         * Exclui os seguintes caminhos das regras do middleware:
         * 1. api (rotas de API)
         * 2. _next/static (arquivos JS/CSS compilados)
         * 3. _next/image (imagens otimizadas)
         * 4. favicon.ico, public assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};