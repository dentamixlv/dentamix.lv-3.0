import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import DoctorsClient from './DoctorsClient';
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

  let slices = null;
  try {
    const document = await client.getByUID('page', 'doctors', { lang: locale });
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'doctors' found, falling back to standalone doctors list.");
  }

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  return <DoctorsClient langCode={locale} />;
}
