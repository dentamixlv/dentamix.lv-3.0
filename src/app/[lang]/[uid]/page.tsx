import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import { getPrismicLocale } from '../page';
import { renderPageLayout } from '../../layoutHelper';
import { constructMetadata, SEOStructuredData, getAlternativeLanguageRedirect } from '../../seoHelper';
import { LanguageUpdater } from '../../../components/LanguageContext';

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

  if (!document) {
    const redirectUrl = await getAlternativeLanguageRedirect({
      client,
      id: uid,
      currentLocale: locale,
      pageType: 'page',
      routeType: 'page',
    });
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  let alternateLanguageUrl = null;
  if (document && Array.isArray(document.alternate_languages)) {
    const alt = document.alternate_languages.find((a: any) => a.lang === (locale === 'en-us' ? 'lv' : 'en-us'));
    if (alt && alt.uid) {
      if (locale === 'en-us') {
        alternateLanguageUrl = `/${alt.uid}`;
      } else {
        alternateLanguageUrl = `/en/${alt.uid}`;
      }
    }
  }

  if (document && document.data?.slices && document.data.slices.length > 0) {
    const title = document.data.meta_title || 'Dentamic';
    const description = document.data.meta_description || '';
    const imageUrl = document.data.schema_image?.url || null;

    return (
      <>
        <LanguageUpdater url={alternateLanguageUrl} />
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
