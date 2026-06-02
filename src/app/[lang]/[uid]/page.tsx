import React from 'react';
import { notFound } from 'next/navigation';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import { getPrismicLocale } from '../page';
import { renderPageLayout } from '../../layoutHelper';

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

  try {
    const document = await client.getByUID('page', uid, { lang: locale });
    const data = document?.data as any;
    if (document && data && data.meta_title) {
      return {
        title: data.meta_title,
        description: data.meta_description || '',
      };
    }
  } catch (error) {
    // Ignore and fallback to default page metadata
  }

  return {
    title: 'Dentamic',
  };
}

export default async function Page({ params }: PageProps) {
  const { uid, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  try {
    const document = await client.getByUID('page', uid, { lang: locale });
    const slices = document?.data?.slices || null;

    if (slices && slices.length > 0) {
      return renderPageLayout(slices, components);
    }
  } catch (error) {
    console.warn(`Prismic document of type page with UID "${uid}" not found.`, error);
  }

  notFound();
}
