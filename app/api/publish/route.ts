import { NextResponse } from 'next/server';

// Simple API route that accepts published content.  In a production app
// this handler would save the content as published and maybe trigger a
// rebuild or revalidation.  Here it simply returns success.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received publication', body);
    // TODO: persist published content (e.g. to Sanity or file system)
    return NextResponse.json({ message: 'Published' });
  } catch (err: any) {
    return new NextResponse('Failed to parse request', { status: 400 });
  }
}