import React from 'react';
import { createClient } from '../../../prismicio';
import PricesClient from './PricesClient';
import { getPrismicLocale } from '../page';

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
  const client = createClient();

  let priceItems = null;
  try {
    const documents = await client.getAllByType('price_item', { lang: locale });
    if (documents && documents.length > 0) {
      priceItems = documents.map(d => ({
        category: d.data.category,
        name: d.data.name,
        price: d.data.price,
        note: d.data.note,
        order: Number(d.data.order) || 0
      }));
    }
  } catch (error) {
    console.warn("No price items in Prismic, falling back to static data.");
  }

  return <PricesClient langCode={locale} customPriceItems={priceItems} />;
}
