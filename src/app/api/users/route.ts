// src\app\api\users\route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { createUserSchema } from '@/lib/validations/user/create'
import { z } from 'zod'
import { fileToBase64 } from '@/lib/utils/file'

type FormData = {
    [key: string]: string | boolean | File | null | undefined
}

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

        const res = await fetch(`${baseUrl}/users`, {
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error('API Error:', await res.text())
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Server Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
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
                const base64 = await fileToBase64(value)
                rawData[key] = base64
                continue
            }

            // All other values
            rawData[key] = value
        }

        // Validate the data
        const validatedData = createUserSchema.parse(rawData)

        // Auto-generate username
        const { first_name, last_name } = validatedData
        const username = `${first_name.toLowerCase()}.${last_name.toLowerCase()}`

        // Add username to the validated data
        validatedData.user_name = username

        const res = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('API Error:', errorText)
            throw new Error(`Failed to create user: ${errorText}`)
        }

        const data = await res.json()
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