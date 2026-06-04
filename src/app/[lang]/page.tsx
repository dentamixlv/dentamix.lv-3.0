import React from 'react';
import { createClient } from '../../prismicio';
import HomeClient from './HomeClient';
import { constructMetadata, SEOStructuredData } from '../seoHelper';

export function getPrismicLocale(lang?: string | string[]) {
  const code = Array.isArray(lang) ? lang[0] : lang;
  if (code?.toLowerCase() === 'en') return 'en-us';
  return 'lv';
}

interface PageProps {
  params: Promise<{
    lang?: string | string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  const uid = locale === 'en-us' ? 'home' : 'sakums';
  let document = null;
  try {
    try {
      document = await client.getByUID('homepage', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'sakums' ? 'home' : 'sakums';
      document = await client.getByUID('homepage', fallbackUid, { lang: locale });
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'Dentamic | Premium Dental Clinic',
    description: 'Premium dental clinic with advanced technology and personalized care in Riga and Adazi.',
  } : {
    title: 'Dentamic | Premium zobārstniecības klīnika',
    description: 'Premium zobārstniecības klīnikas mājaslapa ar interaktīvu vizīšu pieteikšanas un speciālistu vizītkaršu sistēmu.',
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
    const uid = locale === 'en-us' ? 'home' : 'sakums';
    try {
      document = await client.getByUID('homepage', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'sakums' ? 'home' : 'sakums';
      document = await client.getByUID('homepage', fallbackUid, { lang: locale });
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn(`Prismic homepage document for locale "${locale}" with UID not found, falling back to static content.`, error);
  }

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'Dentamic | Premium Dental Clinic' : 'Dentamic | Premium zobārstniecības klīnika');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  return (
    <>
      <SEOStructuredData
        id="homepage"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      <HomeClient slices={slices} langCode={locale} />
    </>
  );
}