import React from 'react';
import { headers } from 'next/headers';
import { createClient } from '../../prismicio';
import { renderPageLayout } from '../layoutHelper';
import { components } from '../../slices';

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('referer') || '';

  const isEn = pathname.includes('/en/') || pathname.endsWith('/en');
  const locale = isEn ? 'en-us' : 'lv';
  const uid = isEn ? '404-en' : '404-lv';

  try {
    const client = createClient();
    const document = await client.getByUID('page', uid, { lang: locale });
    const slices = document?.data?.slices;

    if (slices && slices.length > 0) {
      return <>{renderPageLayout(slices, components)}</>;
    }
  } catch (error) {
    console.error('Error fetching 404 page from Prismic:', error);
  }

  // Fallback UI if Prismic fetch fails or has no slices
  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-4xl font-serif font-bold text-[#511B29] mb-3">
        {isEn ? 'Page Not Found' : 'Lapa nav atrasta'}
      </h2>
      <p className="text-xs text-[#6a5b5e] mb-6">
        {isEn
          ? 'Sorry, the page you are looking for does not exist or has been moved.'
          : 'Atvainojiet, meklētā lapa neeksistē vai ir pārvietota.'}
      </p>
      <a
        href={isEn ? '/en' : '/'}
        className="px-6 py-3 bg-[#511B29] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#5d1726] transition-all"
      >
        {isEn ? 'Back to Home' : 'Atgriezties sākumā'}
      </a>
    </div>
  );
}
