// src\app\api\users\[id]\deactivate\route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function DELETE(
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

        const res = await fetch(`${baseUrl}/users/${params.id}/deactivate`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('API Error:', errorText)
            return NextResponse.json(
                { error: 'Failed to deactivate user' },
                { status: res.status }
            )
        }

        return NextResponse.json({ message: 'User deactivated' })

    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}