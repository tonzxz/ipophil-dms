// src/middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/home', '/dashboard', '/users', '/types']
const ADMIN_ROUTES = ['/users', '/types']

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    if (path === '/') {
        return NextResponse.next()
    }

    const token = await getToken({ req })

    if (!token && PROTECTED_ROUTES.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (token?.role !== 'admin' && ADMIN_ROUTES.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/home', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/home/:path*', '/dashboard/:path*', '/users/:path*', '/types/:path*']
}