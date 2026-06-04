import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import PricesClient from './PricesClient';
import { getPrismicLocale } from '../page';
import { getPricesFromGoogleSheets } from '../../../data/prices';
import { constructMetadata, SEOStructuredData } from '../../seoHelper';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  const uid = locale === 'en-us' ? 'prices' : 'cenas';
  let document = null;
  try {
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'cenas' ? 'prices' : 'cenas';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'Prices & Quality | Dentamic Dental Clinic',
    description: 'Clear and simple pricing with zero hidden fees and full cost transparency at Dentamic.',
  } : {
    title: 'Cenas un kvalitāte | Dentamic zobārstniecība',
    description: 'Skaidrs un saprotams cenrādis bez slēptiem maksājumiem ar pilnīgu izmaksu pārredzamību.',
  };

  return constructMetadata(document?.data, locale, fallback);
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let slices = null;
  let document = null;
  try {
    const uid = locale === 'en-us' ? 'prices' : 'cenas';
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

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'Prices & Quality | Dentamic Dental Clinic' : 'Cenas un kvalitāte | Dentamic zobārstniecība');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  let initialPriceItems = [];
  if (!slices || slices.length === 0) {
    try {
      initialPriceItems = await getPricesFromGoogleSheets(locale);
    } catch (error) {
      console.warn("Failed to fetch Google Sheets prices server-side, client-side fallback will be used.", error);
    }
  }

  const content = slices && slices.length > 0 ? (
    (() => {
      const lastSlice = slices[slices.length - 1];
      if (lastSlice.slice_type === 'cta_block') {
        const mainSlices = slices.slice(0, -1);
        return (
          <>
            <SliceZone slices={mainSlices} components={components} />
            <SliceZone slices={[lastSlice]} components={components} context={{ isBottom: true }} />
          </>
        );
      }
      return <SliceZone slices={slices} components={components} />;
    })()
  ) : (
    <PricesClient langCode={locale} initialPriceItems={initialPriceItems} />
  );

  return (
    <>
      <SEOStructuredData
        id="prices"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      {content}
    </>
  );
}


