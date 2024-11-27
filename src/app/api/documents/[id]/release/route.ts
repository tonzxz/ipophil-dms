// src/app/api/documents/[id]/release/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function POST(req: Request, { params }: { params: { id: string } }) {
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
        const body = await req.json();

        console.log(
            `Releasing document ID: ${id} to agency: ${body.to_agency_id} with remarks: ${
                body.remarks || 'None'
            } and action: ${body.document_action}`
        );

        const apiResponse = await fetch(`${baseUrl}/documents/${id}/release`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to_agency_id: body.to_agency_id,
                remarks: body.remarks || '', 
                document_action: body.document_action, 
            }),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('API Error:', errorData);
            return NextResponse.json(
                { error: `${errorData.message}` },
                { status: apiResponse.status }
            );
        }

        const data = await apiResponse.json();
        console.log('Document released successfully:', data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
