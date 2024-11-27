// src/lib/auth/config.ts
import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { ExtendedUser } from '../dms/schema'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error('Please enter both username and password')
                }

                try {
                    const res = await fetch(process.env.API_AUTH_LOGIN as string, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            identifier: credentials.identifier,
                            password: credentials.password
                        }),
                        cache: 'no-store'
                    })

                    const data = await res.json()
                    
                    if (!res.ok) {
                        throw new Error(data.message || 'Authentication failed')
                    }

                    if (!data.token) {
                        throw new Error('Invalid response from the server: missing token')
                    }

                    const user = parseUserFromToken(data.token)

                    if (!user || !user.user_id || !user.email || !user.role) {
                        throw new Error('Invalid response from the server: missing user information')
                    }

                    // Map the user data to match NextAuth's User interface
                    return {
                        ...user,
                        id: user.user_id, // Map user_id to id for NextAuth
                        accessToken: data.token,
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    throw new Error('Invalid credentials')
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    ...user,
                    // accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000
                }
            }
            try {
                const res = await fetch(process.env.API_AUTH_REFRESH_TOKEN as string, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                })


                if (!res.ok && res.status !== 401) {
                    
                    return { ...token, error: 'RefreshTokenError' as const }
                }

                const data = await res.json()
                return {
                    ...token,
                    accessToken: data.token ?? '',
                    accessTokenExpires: res.status !== 401 ? Date.now() + 24 * 60 * 60 * 1000 : -Date.now()
                }
            } catch (error) {
                console.error('Error refreshing token:', error)
                return { ...token, error: 'RefreshTokenError' as const }
            }
        },

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...token,
                    id: token.id,
                    accessTokenExpires: token.accessTokenExpires
                }
            }
        }
    },
    pages: {
        signIn: '/'
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 // 24 hours
    },
    debug: process.env.NODE_ENV === 'development'
}

// Helper function to parse user information from the token
function parseUserFromToken(token: string): ExtendedUser | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            user_id: payload.user_id,
            email: payload.email,
            user_name: payload.user_name,
            role: payload.role,
            agency_id: payload.agency_id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            middle_name: payload.middle_name,
            title: payload.title,
            type: payload.type,
            avatar: payload.avatar,
            active: payload.active,
            agency_name: payload.agency_name,
            created_at: payload.created_at,
            updated_at: payload.updated_at
        }
    } catch (error) {
        console.error('Error parsing token:', error)
        return null
    }
}