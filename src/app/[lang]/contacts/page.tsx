import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import ContactsClient from './ContactsClient';
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
      title: 'Contact Us | Dentamic Dental Clinic',
      description: 'Get in touch with Dentamic clinic branches in Riga and Adazi. Make an appointment or ask questions.',
    };
  }

  return {
    title: 'Kontakti | Dentamic zobārstniecība',
    description: 'Sazinieties ar Dentamic Centra (Rīga) un Pierīgas (Ādaži) filiālēm. Aizpildiet pieteikumu vai zvaniet.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'contacts' : 'kontakti';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'kontakti' ? 'contacts' : 'kontakti';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No contacts page found in Prismic, falling back to static contact view.");
  }

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  return <ContactsClient langCode={locale} />;
}
