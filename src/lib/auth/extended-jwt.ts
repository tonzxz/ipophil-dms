// src\lib\auth\extended-jwt.ts
import type { JWT } from 'next-auth/jwt'

export interface ExtendedJWT extends JWT {
    rememberMe?: boolean
}