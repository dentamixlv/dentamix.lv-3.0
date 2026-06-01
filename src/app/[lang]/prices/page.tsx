import React from 'react';
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

  let initialPriceItems = [];
  try {
    initialPriceItems = await getPricesFromGoogleSheets();
  } catch (error) {
    console.warn("Failed to fetch Google Sheets prices server-side, client-side fallback will be used.", error);
  }

  return <PricesClient langCode={locale} initialPriceItems={initialPriceItems} />;
}

