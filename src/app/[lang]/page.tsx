import React from 'react';
import { createClient } from '../../prismicio';
import HomeClient from './HomeClient';
import { constructMetadata, SEOStructuredData, SEODentistStructuredData } from '../seoHelper';

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
    description: 'Premium zobārstniecības klīnikas mājaslapa ar interaktīvu vizīšu pieteikšanas un speciālistu vizītkaršu sistemu.',
  };

  return constructMetadata(document?.data, locale, fallback, { type: 'home' });
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

  // Fetch Prismic clinics from footer settings for Dentist schema
  let footerClinics = null;
  try {
    const footerDoc = await client.getSingle('footer', { lang: locale });
    if (footerDoc && Array.isArray(footerDoc.data?.clinics)) {
      footerClinics = footerDoc.data.clinics
        .filter((c: any) => c.name || c.address)
        .map((c: any) => ({
          id: c.name?.toLowerCase().includes('adazi') || c.name?.toLowerCase().includes('ādaži') ? 'adazi' : 'riga',
          name: c.name || '',
          address: c.address || '',
          phone: c.phone || '',
          email: c.email || '',
          workHoursWeekdays: c.work_hours_weekdays || '',
          workHoursSaturday: c.work_hours_saturday || '',
          workHoursSunday: c.work_hours_sunday || '',
        }));
    }
  } catch (error) {
    console.warn("Failed to fetch Prismic footer clinics for Dentist structured data schema, falling back to local static clinics.", error);
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
      <SEODentistStructuredData locale={locale} prismicClinics={footerClinics} />
      <HomeClient slices={slices} langCode={locale} />
    </>
  );
}