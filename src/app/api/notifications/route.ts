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

        const apiResponse = await fetch(`${baseUrl}/notifications`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('Failed to fetch notifications:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch unotifications', details: errorData },
                { status: apiResponse.status }
            );
        }

        const agencies = await apiResponse.json();
        return NextResponse.json(agencies);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
