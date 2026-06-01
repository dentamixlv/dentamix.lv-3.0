import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import PricesClient from './PricesClient';
import { getPrismicLocale } from '../page';
import { getPricesFromGoogleSheets } from '../../../data/prices';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);

  // Try to load metadata from Prismic page document first
  const client = createClient();
  try {
    const uid = locale === 'en-us' ? 'prices' : 'cenas';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'cenas' ? 'prices' : 'cenas';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    if (document && document.data && document.data.meta_title) {
      return {
        title: document.data.meta_title,
        description: document.data.meta_description || '',
      };
    }
  } catch (error) {
    // Ignore and use default fallback metadata
  }

  if (locale === 'en-us') {
    return {
      title: 'Prices & Quality | Dentamic Dental Clinic',
      description: 'Clear and simple pricing with zero hidden fees and full cost transparency at Dentamic.',
    };
  }

  return {
    title: 'Cenas un kvalitāte | Dentamic zobārstniecība',
    description: 'Skaidrs un saprotams cenrādis bez slēptiem maksājumiem ar pilnīgu izmaksu pārredzamību.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to load dynamic page content from Prismic slices first
  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'prices' : 'cenas';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'cenas' ? 'prices' : 'cenas';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'prices' / 'cenas' found, falling back to standalone prices list.");
  }

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  // 2. Standalone fallback (using Google Sheets fetching)
  let initialPriceItems = [];
  try {
    initialPriceItems = await getPricesFromGoogleSheets(locale);
  } catch (error) {
    console.warn("Failed to fetch Google Sheets prices server-side, client-side fallback will be used.", error);
  }

  return <PricesClient langCode={locale} initialPriceItems={initialPriceItems} />;
}


