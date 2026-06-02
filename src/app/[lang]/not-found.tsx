'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '../../prismicio';
import { renderPageLayout } from '../layoutHelper';
import { components } from '../../slices';

export default function NotFound() {
  const pathname = usePathname();
  const [slices, setSlices] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const isEn = pathname.startsWith('/en/') || pathname === '/en';
  const locale = isEn ? 'en-us' : 'lv';
  const uid = isEn ? '404-en' : '404-lv';

  useEffect(() => {
    const fetchNotFoundPage = async () => {
      try {
        const client = createClient();
        const document = await client.getByUID('page', uid, { lang: locale });
        if (document?.data?.slices) {
          setSlices(document.data.slices);
        }
      } catch (error) {
        console.error('Error fetching 404 page from Prismic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotFoundPage();
  }, [uid, locale]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#de7c8a]"></div>
      </div>
    );
  }

  if (slices && slices.length > 0) {
    return <>{renderPageLayout(slices, components)}</>;
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
