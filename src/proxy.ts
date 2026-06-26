// Proxy routing configuration
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function handleRequest(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Skip static files, api routes, image optimization, and slicemachine
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/slice-simulator') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Normalize en-us to en (e.g. resolved paths from Prismic link fields)
  if (pathname.startsWith('/en-us')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace('/en-us', '/en');
    return NextResponse.redirect(url, 307);
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
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname.startsWith('/pakalpojumi/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/lv/services/${pathname.substring('/pakalpojumi/'.length)}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname === '/lv/pakalpojumi') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/services';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname.startsWith('/lv/pakalpojumi/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/lv/services/${pathname.substring('/lv/pakalpojumi/'.length)}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
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
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname === '/lv/cenas') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/prices';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // 5. Redirect /testimonials (or /lv/testimonials) to /atsauksmes for Latvian locale
  if (pathname === '/testimonials') {
    const url = request.nextUrl.clone();
    url.pathname = '/atsauksmes';
    return NextResponse.redirect(url, 307);
  }
  if (pathname === '/lv/testimonials') {
    const url = request.nextUrl.clone();
    url.pathname = '/atsauksmes';
    return NextResponse.redirect(url, 307);
  }

  // 6. Rewrite /atsauksmes (or /lv/atsauksmes) to /lv/testimonials internally
  if (pathname === '/atsauksmes') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/testimonials';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname === '/lv/atsauksmes') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/testimonials';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // 7. Redirect /contacts (or /lv/contacts) to /kontakti for Latvian locale
  if (pathname === '/contacts') {
    const url = request.nextUrl.clone();
    url.pathname = '/kontakti';
    return NextResponse.redirect(url, 307);
  }
  if (pathname === '/lv/contacts') {
    const url = request.nextUrl.clone();
    url.pathname = '/kontakti';
    return NextResponse.redirect(url, 307);
  }

  // 8. Rewrite /kontakti (or /lv/kontakti) to /lv/contacts internally
  if (pathname === '/kontakti') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/contacts';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname === '/lv/kontakti') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/contacts';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // 9. Redirect /doctors (or /lv/doctors) to /zobarsti for Latvian locale
  if (pathname === '/doctors') {
    const url = request.nextUrl.clone();
    url.pathname = '/zobarsti';
    return NextResponse.redirect(url, 307);
  }
  if (pathname === '/lv/doctors') {
    const url = request.nextUrl.clone();
    url.pathname = '/zobarsti';
    return NextResponse.redirect(url, 307);
  }
  if (pathname.startsWith('/doctors/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/zobarsti/${pathname.substring('/doctors/'.length)}`;
    return NextResponse.redirect(url, 307);
  }
  if (pathname.startsWith('/lv/doctors/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/zobarsti/${pathname.substring('/lv/doctors/'.length)}`;
    return NextResponse.redirect(url, 307);
  }

  // 10. Redirect /en/zobarsti to /en/doctors (EN locale switch from Latvian page)
  if (pathname === '/en/zobarsti') {
    const url = request.nextUrl.clone();
    url.pathname = '/en/doctors';
    return NextResponse.redirect(url, 307);
  }
  if (pathname.startsWith('/en/zobarsti/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/en/doctors/${pathname.substring('/en/zobarsti/'.length)}`;
    return NextResponse.redirect(url, 307);
  }

  // 11. Redirect about pages
  // Redirect /about (or /lv/about) to /par-mums for Latvian locale
  if (pathname === '/about') {
    const url = request.nextUrl.clone();
    url.pathname = '/par-mums';
    return NextResponse.redirect(url, 307);
  }
  if (pathname === '/lv/about') {
    const url = request.nextUrl.clone();
    url.pathname = '/par-mums';
    return NextResponse.redirect(url, 307);
  }
  // Rewrite /par-mums (or /lv/par-mums) to /lv/about internally
  if (pathname === '/par-mums') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/about';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname === '/lv/par-mums') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/about';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  // EN locale - redirect /en/par-mums to /en/about
  if (pathname === '/en/par-mums') {
    const url = request.nextUrl.clone();
    url.pathname = '/en/about';
    return NextResponse.redirect(url, 307);
  }

  // Redirect policy pages
  // Redirect /en/privatuma-politika to /en/privacy-policy
  if (
    pathname === '/en/privatuma-politika' ||
    pathname === '/en/privacy' ||
    pathname === '/privacy-policy' ||
    pathname === '/lv/privacy-policy' ||
    pathname === '/privacy' ||
    pathname === '/lv/privacy'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/en/privacy-policy';
    return NextResponse.redirect(url, 307);
  }

  // Redirect /en/sikdatnu-politika to /en/cookie-policy
  if (
    pathname === '/en/sikdatnu-politika' ||
    pathname === '/en/cookies' ||
    pathname === '/cookie-policy' ||
    pathname === '/lv/cookie-policy' ||
    pathname === '/cookies' ||
    pathname === '/lv/cookies'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/en/cookie-policy';
    return NextResponse.redirect(url, 307);
  }





  // 12. Rewrite /zobarsti (or /lv/zobarsti) to /lv/doctors internally
  if (pathname === '/zobarsti') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/doctors';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname === '/lv/zobarsti') {
    const url = request.nextUrl.clone();
    url.pathname = '/lv/doctors';
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname.startsWith('/zobarsti/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/lv/doctors/${pathname.substring('/zobarsti/'.length)}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }
  if (pathname.startsWith('/lv/zobarsti/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/lv/doctors/${pathname.substring('/lv/zobarsti/'.length)}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // Check if pathname starts with a supported locale
  const hasLocale = pathname.startsWith('/en') || pathname.startsWith('/lv');

  if (!hasLocale) {
    // Rewrite internally to /lv
    const url = request.nextUrl.clone();
    url.pathname = `/lv${pathname}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export function proxy(request: NextRequest) {
  const response = handleRequest(request);

  // Inject HTTP security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default proxy;
