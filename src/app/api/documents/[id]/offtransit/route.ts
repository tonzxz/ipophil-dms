// src/app/api/documents/[id]/offtransit/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params; 
        const baseUrl = process.env.API_BASE_URL;
        if (!baseUrl) {
            console.error('API_BASE_URL is not defined in environment variables');
            return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
        }

        console.log(`Fetching document off transit with ID: ${id}`);

        const apiResponse = await fetch(`${baseUrl}/documents/${id}/offtransit`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('API Error:', errorData);
            // toast.error(errorData.message);

            return NextResponse.json(
                { error: `${errorData.message}` },
                { status: apiResponse.status }
            );
        }

        const data = await apiResponse.json();
        console.log('Document fetched successfully:', data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}