import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = ['/login', '/pricing', '/privacy', '/terms', '/support'];

function proxyHandler(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow root path
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Allow public paths (exact match or subpaths)
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Check for auth token (cookie)
  const token = req.cookies.get('token');

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export default proxyHandler;
export const proxy = proxyHandler;

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/prospects/:path*',
    '/leads/:path*',
    '/campaigns/:path*',
    '/meetings/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/ai-inbox/:path*',
    '/email/:path*',
    '/whatsapp/:path*',
    '/linkedin/:path*',
    '/conversations/:path*',
    '/ai-assistant/:path*',
    '/knowledge-base/:path*',
    '/calendar/:path*',
    '/analytics/:path*',
    '/telephone-ai/:path*',
    '/ai-settings/:path*',
    '/clients/:path*',
    '/consents/:path*',
  ],
};
