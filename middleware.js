import { NextResponse } from 'next/server';

export const config = {
    matcher: ['/admin/:path*'], // 👈 define protected routes here
  };

  
export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
  const loginUrl = new URL('/login', req.url);

  if (!token && isAdminPath) {
    return NextResponse.redirect(loginUrl);
  }

  // decode token to check role (basic JWT decode)
  if (token && isAdminPath) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      if (payload.role !== '1') {
        return NextResponse.redirect(new URL('/user/dashboard', req.url));
      }
    } catch (err) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
