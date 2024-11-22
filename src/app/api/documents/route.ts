// src/app/api/documents/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function GET() {
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

        const res = await fetch(`${baseUrl}/documents`, {
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error('API Error:', await res.text())
            return NextResponse.json({ error: 'Failed to fetch documents' }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
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

        const body = await req.json()

        const documentPayload = body;

        console.error('Sending payload:', documentPayload)

        const res = await fetch(`${baseUrl}/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(documentPayload)
        })

        if (!res.ok) {
            const errorData = await res.text()
            console.error('API Error:', errorData)
            return NextResponse.json({ error: 'Failed to create document', details: errorData }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
