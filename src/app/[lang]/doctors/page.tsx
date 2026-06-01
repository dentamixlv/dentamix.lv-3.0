import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import DoctorsClient from './DoctorsClient';
import { getPrismicLocale } from '../page';
import { extractDoctorFromPage } from '../../../data';

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
      title: 'Our Dentists | Dentamic Dental Clinic',
      description: 'Meet our professional dental team. High clinical precision and compassionate care in Riga and Adazi.',
    };
  }

  return {
    title: 'Mūsu komanda | Dentamic zobārstniecība',
    description: 'Profesionāli speciālisti, kas apvieno klīnisko precizitāti un personalizētu, iejūtīgu aprūpi.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to load dynamic page content from slices first
  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'doctors' : 'zobarsti';
    let document;
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

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  // 2. Fallback to querying doctor cards dynamically
  let doctors = null;
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

  return <DoctorsClient langCode={locale} customDoctors={doctors} />;
}
