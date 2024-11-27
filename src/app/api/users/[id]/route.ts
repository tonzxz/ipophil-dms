// src\app\api\users\[id]\route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { updateUserSchema } from '@/lib/validations/user/create'
import { z } from 'zod'
import { fileToBase64 } from '@/lib/utils/file'

type FormData = {
    [key: string]: string | boolean | File | null | undefined
}

export async function GET(
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

        const res = await fetch(`${baseUrl}/users/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error('API Error:', await res.text())
            return NextResponse.json({ error: 'Failed to fetch user' }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
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

        const formData = await request.formData()
        const rawData: FormData = {}

        // Process form data
        for (const [key, value] of formData.entries()) {
            // Handle boolean conversion
            if (key === 'active') {
                rawData[key] = value === 'true'
                continue
            }

            // Handle File objects (avatar)
            if (value instanceof File) {
                // Only process if it's a new file upload
                const base64 = await fileToBase64(value)
                rawData[key] = base64
                continue
            }

            // All other values
            rawData[key] = value
        }

        // console.log('Raw form data received:', rawData)

        // Validate the data
        const validatedData = updateUserSchema.parse(rawData)

        // console.log('Validated form data:', validatedData)

        const { id } = params;

        const res = await fetch(`${baseUrl}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('API Error:', errorText)
            throw new Error(`Failed to update user: ${errorText}`)
        }

        const data = await res.json()
        // console.log('API Response:', data)
        return NextResponse.json(data)

    } catch (error) {
        console.error('Server Error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

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

        const res = await fetch(`${baseUrl}/users/${params.id}`, {
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
                { error: 'Failed to delete user' },
                { status: res.status }
            )
        }

        return NextResponse.json({ message: 'User deleted' })

    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}