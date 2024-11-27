
// src/hooks/use-session-expiration.ts
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useSessionExpiration() {
    const { data: session } = useSession()
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        const userExpiry = session?.user?.accessTokenExpires
        if (userExpiry) {
            const timeUntilExpiry = userExpiry - Date.now()

            if (timeUntilExpiry > 0) {
                timeoutRef.current = setTimeout(async () => {
                    await signOut({ redirect: false })
                    router.push('/')
                }, timeUntilExpiry)
            } else {
                signOut({ redirect: false }).then(() => {
                    router.push('/')
                })
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [session?.user?.accessTokenExpires, router])
}
