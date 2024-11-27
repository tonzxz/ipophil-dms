import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

/**
 * Handles fetching all user feedbacks (GET).
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

        const apiResponse = await fetch(`${baseUrl}/user-feedbacks`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('Failed to fetch user feedbacks:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch user feedbacks', details: errorData },
                { status: apiResponse.status }
            );
        }

        const agencies = await apiResponse.json();
        return NextResponse.json(agencies);
    } catch (error) {
        console.error('Error fetching user feedbacks:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * Handles creating a new user feedback (POST).
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
        if (!body.feedback_text || body.feedback_text.trim() === '') {
            return NextResponse.json(
                { error: 'Feedback field is required' },
                { status: 400 }
            );
        }


        const payload = {
            feedback_text: body.feedback_text
        };

        console.log(payload);

        const apiResponse = await fetch(`${baseUrl}/user-feedbacks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('Failed to create user feedback:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to create user feedback' },
                { status: apiResponse.status }
            );
        }

        const feedback = await apiResponse.json();
        return NextResponse.json(feedback);
    } catch (error) {
        console.error('Error creating user feedback:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
