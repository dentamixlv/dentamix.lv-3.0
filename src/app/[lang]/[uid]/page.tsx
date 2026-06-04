import React from 'react';
import { notFound } from 'next/navigation';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import { getPrismicLocale } from '../page';
import { renderPageLayout } from '../../layoutHelper';
import { constructMetadata, SEOStructuredData } from '../../seoHelper';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
    uid: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { uid, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let document = null;
  try {
    document = await client.getByUID('page', uid, { lang: locale });
  } catch (error) {
    // Ignore and fallback
  }

  return constructMetadata(document?.data, locale, {
    title: 'Dentamic',
    description: '',
  });
}

export default async function Page({ params }: PageProps) {
  const { uid, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let document = null;
  try {
    document = await client.getByUID('page', uid, { lang: locale });
  } catch (error) {
    console.warn(`Prismic document of type page with UID "${uid}" not found.`, error);
  }

  if (document && document.data?.slices && document.data.slices.length > 0) {
    const title = document.data.meta_title || 'Dentamic';
    const description = document.data.meta_description || '';
    const imageUrl = document.data.schema_image?.url || null;

    return (
      <>
        <SEOStructuredData
          id={`page-${uid}`}
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
        {renderPageLayout(document.data.slices, components)}
      </>
    );
  }

  notFound();
}
