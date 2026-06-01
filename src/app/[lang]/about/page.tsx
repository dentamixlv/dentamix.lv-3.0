import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import AboutClient from './AboutClient';
import { getPrismicLocale } from '../page';
import { renderPageLayout } from '../../layoutHelper';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  try {
    const uid = locale === 'en-us' ? 'about' : 'par-mums';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'par-mums' ? 'about' : 'par-mums';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    if (document && document.data && document.data.meta_title) {
      return {
        title: document.data.meta_title,
        description: document.data.meta_description || '',
      };
    }
  } catch (error) {
    // Ignore and use default metadata
  }

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

  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'about' : 'par-mums';
    let document;
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

  if (slices && slices.length > 0) {
    return renderPageLayout(slices, components);
  }

  return <AboutClient />;
}