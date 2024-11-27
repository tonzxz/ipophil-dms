// src/types/next-auth.d.ts
import { ExtendedUser } from '@/lib/dms/schema'
declare module 'next-auth' {
    interface Session {
        expires: string
        user: ExtendedUser & {
            id: string
            accessToken: string
            accessTokenExpires: number
        }
    }

    interface User extends ExtendedUser {
        id: string
        accessToken: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends ExtendedUser {
        id: string
        accessToken: string
        accessTokenExpires: number
        error?: 'TokenExpiredError' | 'RefreshTokenError'
    }
}
