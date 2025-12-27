import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only protect /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const auth = req.headers.get('authorization');
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminUser || !adminPass) {
    return new NextResponse('Admin credentials not configured', { status: 500 });
  }

  if (!auth || !auth.startsWith('Basic ')) {
    const res = new NextResponse('Authentication required', { status: 401 });
    res.headers.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res;
  }

  const b64 = auth.split(' ')[1] || '';
  let decoded = '';
  try {
    decoded = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('utf8');
  } catch (e) {
    decoded = '';
  }
  const [user, pass] = decoded.split(':');

  if (user !== adminUser || pass !== adminPass) {
    const res = new NextResponse('Invalid credentials', { status: 401 });
    res.headers.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
