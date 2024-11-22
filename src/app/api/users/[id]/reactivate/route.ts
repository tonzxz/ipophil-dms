// src\app\api\users\[id]\reactivate\route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const baseUrl = process.env.API_BASE_URL
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables')
            return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 })
        }

        const res = await fetch(`${baseUrl}/users/${params.id}/reactivate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('API Error:', errorText)
            return NextResponse.json(
                { error: 'Failed to reactivate user' },
                { status: res.status }
            )
        }

        return NextResponse.json({ message: 'User reactivated' })

    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}