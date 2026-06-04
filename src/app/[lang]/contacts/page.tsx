import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import ContactsClient from './ContactsClient';
import { getPrismicLocale } from '../page';
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

  const uid = locale === 'en-us' ? 'contacts' : 'kontakti';
  let document = null;
  try {
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'kontakti' ? 'contacts' : 'kontakti';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'Contact Us | Dentamic Dental Clinic',
    description: 'Get in touch with Dentamic clinic branches in Riga and Adazi. Make an appointment or ask questions.',
  } : {
    title: 'Kontakti | Dentamic zobārstniecība',
    description: 'Sazinieties ar Dentamic Centra (Rīga) un Pierīgas (Ādaži) filiālēm. Aizpildiet pieteikumu vai zvaniet.',
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
    const uid = locale === 'en-us' ? 'contacts' : 'kontakti';
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

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'Contact Us | Dentamic Dental Clinic' : 'Kontakti | Dentamic zobārstniecība');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  const content = slices && slices.length > 0 ? (
    <SliceZone slices={slices} components={components} />
  ) : (
    <ContactsClient langCode={locale} />
  );

  return (
    <>
      <SEOStructuredData
        id="contacts"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      {content}
    </>
  );
}
