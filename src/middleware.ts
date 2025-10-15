import { NextRequest, NextResponse } from 'next/server';

const legacyPrefixes = ['/SignIn', '/RegisterUser']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value || null;

    if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.next()
    }

    if (token) {
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/SignIn', request.url))
}

export const config = {
    // matcher: ['/home/*']
    // matcher: ['/home/*', '/transactions/:path*', '/Debts/:path*', '/Categories/:path*', '/Account/:path*', '/Profile/:path*'],
}