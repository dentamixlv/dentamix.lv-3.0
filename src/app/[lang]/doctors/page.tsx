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

  // 1. Try to load dynamic page content from slices first
  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'doctors' : 'zobarsti';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'zobarsti' ? 'doctors' : 'zobarsti';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
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
    const documents = await client.getAllByType('doctor', { lang: locale });
    if (documents && documents.length > 0) {
      doctors = documents.map(d => ({
        id: d.uid!,
        name: d.data.name || '',
        title: d.data.name || '',
        category: d.data.category || '',
        role: d.data.role || '',
        description: d.data.description || '',
        fullBio: Array.isArray(d.data.fullBio) ? (d.data.fullBio[0] as any)?.text || '' : (d.data.fullBio as any) || '',
        image: d.data.image?.url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
        specializations: Array.isArray(d.data.specializations) ? d.data.specializations.map((s: any) => s.item || '') : [],
        education: Array.isArray(d.data.education) ? d.data.education.map((e: any) => e.item || '') : [],
        languages: Array.isArray(d.data.languages) ? d.data.languages.map((l: any) => l.item || '') : [],
      }));
    }
  } catch (error) {
    console.warn("No doctors in Prismic, using fallback data.");
  }

  return <DoctorsClient langCode={locale} customDoctors={doctors} />;
}
