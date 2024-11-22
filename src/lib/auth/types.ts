// src\lib\auth\types.ts
import type { ExtendedUser } from '@/lib/dms/schema'

export type NextAuthUser = ExtendedUser & {
    id: string
    accessToken: string
}

export type NullableNextAuthUser = NextAuthUser | null

declare module 'next-auth' {
    interface Session {
        user: NullableNextAuthUser
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends NextAuthUser {
        accessTokenExpires: number
        error?: 'TokenExpiredError' | 'RefreshTokenError'
    }
}