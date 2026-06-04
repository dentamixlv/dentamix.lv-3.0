import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import DoctorsClient from './DoctorsClient';
import { getPrismicLocale } from '../page';
import { extractDoctorFromPage } from '../../../data';
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

  const uid = locale === 'en-us' ? 'doctors' : 'zobarsti';
  let document = null;
  try {
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      try {
        document = await client.getByUID('page', 'zobardti', { lang: locale });
      } catch (e2) {
        const fallbackUid = uid === 'zobarsti' ? 'doctors' : 'zobarsti';
        document = await client.getByUID('page', fallbackUid, { lang: locale });
      }
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'Our Dentists | Dentamic Dental Clinic',
    description: 'Meet our professional dental team. High clinical precision and compassionate care in Riga and Adazi.',
  } : {
    title: 'Mūsu komanda | Dentamic zobārstniecība',
    description: 'Profesionāli speciālisti, kas apvieno klīnisko precizitāti un personalizētu, iejūtīgu aprūpi.',
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
    const uid = locale === 'en-us' ? 'doctors' : 'zobarsti';
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      try {
        document = await client.getByUID('page', 'zobardti', { lang: locale });
      } catch (e2) {
        const fallbackUid = uid === 'zobarsti' ? 'doctors' : 'zobarsti';
        document = await client.getByUID('page', fallbackUid, { lang: locale });
      }
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'doctors' found, falling back to standalone doctors list.");
  }

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'Our Dentists | Dentamic Dental Clinic' : 'Mūsu komanda | Dentamic zobārstniecība');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  let doctors = null;
  if (!slices || slices.length === 0) {
    try {
      const documents = await client.getAllByType('page', { lang: locale });
      const extracted = documents
        .map(d => extractDoctorFromPage(d))
        .filter((d): d is any => d !== null);
      if (extracted.length > 0) {
        doctors = extracted;
      }
    } catch (error) {
      console.warn("No doctors in Prismic, using fallback data.");
    }
  }

  const content = slices && slices.length > 0 ? (
    <SliceZone slices={slices} components={components} />
  ) : (
    <DoctorsClient langCode={locale} customDoctors={doctors} />
  );

  return (
    <>
      <SEOStructuredData
        id="doctors"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      {content}
    </>
  );
}
