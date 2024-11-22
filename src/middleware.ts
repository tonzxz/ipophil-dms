// src\middleware.ts
/**
 * Authentication and Authorization Middleware
 * 
 * This middleware handles authentication and role-based access control for the application.
 * It protects routes, manages admin access, and handles session validation.
 * 
 * @package    NextAuth
 * @subpackage Middleware
 * @category   Authentication
 * 
 * @see https://next-auth.js.org/configuration/callbacks
 * @see https://nextjs.org/docs/middleware
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Routes that require administrator privileges
 * 
 * @constant {string[]}
 */
const ADMIN_ROUTES = ['/users', '/types']

/**
 * NextAuth Middleware Configuration
 * 
 * @middleware
 * @function
 * @async
 * 
 * @description
 * Handles authentication and authorization for protected routes:
 * - Validates user sessions and tokens
 * - Manages role-based access control
 * - Redirects unauthorized access attempts
 * - Handles automatic logout for invalid sessions
 * 
 * @example
 * // Protected route access
 * // Only admin users can access /users and /types routes
 * // Non-admin users are redirected to /dashboard
 * // Unauthenticated users are redirected to login (/)
 * 
 * @throws {UnauthorizedError} When access is denied due to invalid credentials
 * @returns {NextResponse} Middleware response (redirect or next)
 */
export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const pathname = req.nextUrl.pathname

        // Redirect to login if no token (except for login page)
        if (!token && pathname !== '/') {
            return NextResponse.redirect(new URL('/', req.url))
        }

        const userRole = token?.role

        // Check for protected admin routes
        const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

        // Handle unauthorized admin route access
        if (isAdminRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            /**
             * Authorization callback
             * 
             * @callback
             * @param {Object} params - Authorization parameters
             * @param {JWT} params.token - JWT token containing user information
             * @param {Request} params.req - Next.js request object
             * @returns {boolean} Authorization status
             */
            authorized: ({ token, req }) => {
                // Allow access to login page without token
                if (req.nextUrl.pathname === '/') {
                    return true
                }
                return !!token
            },
        },
    }
)

/**
 * Middleware Configuration
 * 
 * @constant {Object}
 * @property {string[]} matcher - Array of route patterns to match
 * 
 * @description
 * Defines which routes the middleware should be applied to:
 * - / (login page)
 * - /dashboard/* (protected dashboard routes)
 * - /users/* (admin only routes)
 * - /types/* (admin only routes)
 */
export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/users/:path*',
        '/types/:path*',
    ]
}