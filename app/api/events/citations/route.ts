import { type NextRequest, NextResponse } from 'next/server';

import headers from '@/app/lib/headers';

export const revalidate = 3_600; // 1 hour

const url = process.env.NEXT_PUBLIC_API_URL + '/v2/events/citations';

export async function GET(request: NextRequest) {
    const fetch_size = request.nextUrl.searchParams.get('fetch_size');
    const page = request.nextUrl.searchParams.get('page');    

    try {
        const response = await fetch(url + `?fetch_size=${fetch_size}&page=${page}`, { headers });

        if (!response.ok) {
            return new NextResponse('Internal API Error', { status: 500 });
        }

        return NextResponse.json(await response.json());
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
