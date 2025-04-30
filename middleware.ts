import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('server_agent_token');

    // Allow logged-in users to skip login
    if (request.nextUrl.pathname.startsWith('/signin')) {
        if (!!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    }

    // If not logged in, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',              // 👈 Protect homepage
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/any-other-private-route/:path*',
        '/((?!_next|static|favicon.ico|api).*)', // fallback matcher
    ],
};
