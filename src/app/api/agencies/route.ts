import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

/**
 * Handles fetching all agencies (GET).
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized: No valid session' },
                { status: 401 }
            );
        }

        const baseUrl = process.env.API_BASE_URL;

        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables');
            return NextResponse.json(
                { error: 'API base URL is not configured' },
                { status: 500 }
            );
        }

        const apiResponse = await fetch(`${baseUrl}/agencies`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('Failed to fetch agencies:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch agencies', details: errorData },
                { status: apiResponse.status }
            );
        }

        const agencies = await apiResponse.json();
        return NextResponse.json(agencies);
    } catch (error) {
        console.error('Error fetching agencies:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * Handles creating a new agency (POST).
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized: No valid session' },
                { status: 401 }
            );
        }

        const baseUrl = process.env.API_BASE_URL;
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables');
            return NextResponse.json(
                { error: 'API base URL is not configured' },
                { status: 500 }
            );
        }

        const body = await req.json();

        // Validate required fields
        if (!body.name || body.name.trim() === '') {
            return NextResponse.json(
                { error: 'Agency name is required' },
                { status: 400 }
            );
        }

        if (!body.code || body.code.trim() === '') {
            return NextResponse.json(
                { error: 'Agency code is required' },
                { status: 400 }
            );
        }

        const payload = {
            name: body.name,
            code: body.code,
            description: body.description || '',
            created_by: session.user.id,
            active: true,
        };

        const apiResponse = await fetch(`${baseUrl}/agencies`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('Failed to create agency:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to create agency' },
                { status: apiResponse.status }
            );
        }

        const agency = await apiResponse.json();
        return NextResponse.json(agency);
    } catch (error) {
        console.error('Error creating agency:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
