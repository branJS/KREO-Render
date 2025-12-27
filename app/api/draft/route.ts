import { NextResponse } from 'next/server';

// Simple API route that accepts draft content.  In a production app
// this handler would persist the draft content to a database or CMS.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received draft', body);
    // TODO: persist draft content (e.g. to Sanity or file system)
    return NextResponse.json({ message: 'Draft saved' });
  } catch (err: any) {
    return new NextResponse('Failed to parse request', { status: 400 });
  }
}