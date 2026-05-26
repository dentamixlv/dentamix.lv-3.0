import React from 'react';
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

  let pageContent = null;
  try {
    const document = await client.getByUID('page', 'contacts', { lang: locale });
    if (document) {
      pageContent = {
        title: document.data.title || '',
        slices: document.data.slices || []
      };
    }
  } catch (error) {
    console.warn("No contacts page found in Prismic, falling back to static contact view.");
  }

  return <ContactsClient langCode={locale} pageContent={pageContent} />;
}
