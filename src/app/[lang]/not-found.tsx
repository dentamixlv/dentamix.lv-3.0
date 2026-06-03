import React from 'react';
import { createClient } from '../../prismicio';
import { components } from '../../slices';
import NotFoundClient from './NotFoundClient';

export default async function NotFound() {
  let enSlices = null;
  let lvSlices = null;

  try {
    const client = createClient();
    const [enDoc, lvDoc] = await Promise.all([
      client.getByUID('page', '404-en', { lang: 'en-us' }).catch(() => null),
      client.getByUID('page', '404-lv', { lang: 'lv' }).catch(() => null),
    ]);

    enSlices = enDoc?.data?.slices || null;
    lvSlices = lvDoc?.data?.slices || null;
  } catch (error) {
    console.error('Error fetching 404 pages from Prismic:', error);
  }

  const fallbackEnUi = (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-4xl font-serif font-bold text-[#511B29] mb-3">Page Not Found</h2>
      <p className="text-xs text-[#6a5b5e] mb-6">Sorry, the page you are looking for does not exist or has been moved.</p>
      <a href="/en" className="px-6 py-3 bg-[#511B29] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#5d1726] transition-all">
        Back to Home
      </a>
    </div>
  );

  const fallbackLvUi = (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-4xl font-serif font-bold text-[#511B29] mb-3">Lapa nav atrasta</h2>
      <p className="text-xs text-[#6a5b5e] mb-6">Atvainojiet, meklētā lapa neeksistē vai ir pārvietota.</p>
      <a href="/" className="px-6 py-3 bg-[#511B29] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#5d1726] transition-all">
        Atgriezties sākumā
      </a>
    </div>
  );

  return (
    <NotFoundClient
      enSlices={enSlices}
      lvSlices={lvSlices}
      fallbackEnUi={fallbackEnUi}
      fallbackLvUi={fallbackLvUi}
    />
  );
}
