import React from 'react';
import { createClient } from '../../../prismicio';
import AboutClient from './AboutClient';
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
      title: 'About Us | Dentamic Dental Clinic',
      description: 'Learn about Dentamic - a modern dental clinic combining advanced technology with personalized care in Riga and Adazi.',
    };
  }

  return {
    title: 'Par Mums | Dentamic zobārstniecība',
    description: 'Uzziniet par Dentamic - mūsdienīgu zobārstniecības klīniku, kas apvieno jaunākās tehnoloģijas un individuālu pieeju.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let pageContent = null;
  try {
    const document = await client.getByUID('page', 'about', { lang: locale });
    if (document) {
      pageContent = {
        title: document.data.title || '',
        slices: document.data.slices || []
      };
    }
  } catch (error) {
    console.warn("No about page found in Prismic, falling back to static about view.");
  }

  return <AboutClient />;
}