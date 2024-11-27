import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const baseUrl = process.env.API_BASE_URL;
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables');
            return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
        }

        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'ID is required for fetching agency details' }, { status: 400 });
        }

        const res = await fetch(`${baseUrl}/agencies/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('API Error:', error);
            return NextResponse.json({ error: 'Failed to fetch agency details' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const baseUrl = process.env.API_BASE_URL;
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables');
            return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
        }

        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'ID is required for updating agency details' }, { status: 400 });
        }

        const body = await req.json();

        const res = await fetch(`${baseUrl}/agencies/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('API Error:', error);
            return NextResponse.json({ error: error.message || 'Failed to update agency details' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const baseUrl = process.env.API_BASE_URL;
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables');
            return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
        }

        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'ID is required for deletion' }, { status: 400 });
        }

        const res = await fetch(`${baseUrl}/agencies/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const error = await res.json();
            console.error('API Error:', error);
            return NextResponse.json({ error: error.message || 'Failed to delete agency' }, { status: res.status });
        }

        return NextResponse.json({ message: 'Agency deleted successfully' });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
