import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, api routes, image optimization, and slicemachine
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/slice-simulator') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Redirect /services (or /lv/services) to /pakalpojumi for Latvian locale
  if (pathname === '/services') {
    const url = request.nextUrl.clone();
    url.pathname = '/pakalpojumi';
    return NextResponse.redirect(url, 307);
  }
  if (pathname.startsWith('/services/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/pakalpojumi/${pathname.substring('/services/'.length)}`;
    return NextResponse.redirect(url, 307);
  }
  if (pathname === '/lv/services') {
    const url = request.nextUrl.clone();
    url.pathname = '/pakalpojumi';
    return NextResponse.redirect(url, 307);
  }
  if (pathname.startsWith('/lv/services/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/pakalpojumi/${pathname.substring('/lv/services/'.length)}`;
    return NextResponse.redirect(url, 307);
  }

  // 2. Rewrite /pakalpojumi (or /lv/pakalpojumi) to /lv/services internally
  if (pathname === '/pakalpojumi') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/services';
    return NextResponse.rewrite(url);
  }
  if (pathname.startsWith('/pakalpojumi/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/lv/services/${pathname.substring('/pakalpojumi/'.length)}`;
    return NextResponse.rewrite(url);
  }
  if (pathname === '/lv/pakalpojumi') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/services';
    return NextResponse.rewrite(url);
  }
  if (pathname.startsWith('/lv/pakalpojumi/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/lv/services/${pathname.substring('/lv/pakalpojumi/'.length)}`;
    return NextResponse.rewrite(url);
  }

  // 3. Redirect /prices (or /lv/prices) to /cenas for Latvian locale
  if (pathname === '/prices') {
    const url = request.nextUrl.clone();
    url.pathname = '/cenas';
    return NextResponse.redirect(url, 307);
  }
  if (pathname === '/lv/prices') {
    const url = request.nextUrl.clone();
    url.pathname = '/cenas';
    return NextResponse.redirect(url, 307);
  }

  // 4. Rewrite /cenas (or /lv/cenas) to /lv/prices internally
  if (pathname === '/cenas') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/prices';
    return NextResponse.rewrite(url);
  }
  if (pathname === '/lv/cenas') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/prices';
    return NextResponse.rewrite(url);
  }

  // Check if pathname starts with a supported locale
  const hasLocale = pathname.startsWith('/en') || pathname.startsWith('/lv');

  if (!hasLocale) {
    // Rewrite internally to /lv
    const url = request.nextUrl.clone();
    url.pathname = `/lv${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
