// src/app/(auth)/layout.tsx
'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AppSidebar } from '@/components/custom/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSessionExpiration } from '@/hooks/use-session-expiration'
import { CountProvider } from '@/lib/context/count-context'

type ChildrenProps = {
    children: React.ReactNode
}

export default function AuthLayout({ children }: ChildrenProps) {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        }
    })

    useSessionExpiration()

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
        }

        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])

    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!session?.user || !session) {
        return null
    }

    return (
        <CountProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main className='flex-1'>
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </CountProvider>
    )
}