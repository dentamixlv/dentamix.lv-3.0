import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import AboutClient from './AboutClient';
import { getPrismicLocale } from '../page';
import { renderPageLayout } from '../../layoutHelper';
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

  const uid = locale === 'en-us' ? 'about' : 'par-mums';
  let document = null;
  try {
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'par-mums' ? 'about' : 'par-mums';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'About Us | Dentamix Dental Clinic',
    description: 'Learn about Dentamix - a modern dental clinic combining advanced technology with personalized care in Riga and Adazi.',
  } : {
    title: 'Par Mums | Dentamix zobārstniecība',
    description: 'Uzziniet par Dentamix - mūsdienīgu zobārstniecības klīniku, kas apvieno jaunākās tehnoloģijas un individuālu pieeju.',
  };

  return constructMetadata(document?.data, locale, fallback, { type: 'about' });
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let slices = null;
  let document = null;
  try {
    const uid = locale === 'en-us' ? 'about' : 'par-mums';
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'par-mums' ? 'about' : 'par-mums';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No about/par-mums page found in Prismic, falling back to static about view.");
  }

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'About Us | Dentamix Dental Clinic' : 'Par Mums | Dentamix zobārstniecība');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  const content = slices && slices.length > 0 ? (
    renderPageLayout(slices, components)
  ) : (
    <AboutClient />
  );

  return (
    <>
      <SEOStructuredData
        id="about"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      {content}
    </>
  );
}