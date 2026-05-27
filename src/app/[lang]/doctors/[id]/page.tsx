import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../prismicio';
import DoctorProfileClient from './DoctorProfileClient';
import { getPrismicLocale } from '../../page';
import { getDoctors } from '../../../../data';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let doctor = null;
  try {
    const doc = await client.getByUID('doctor', id, { lang: locale });
    if (doc) {
      doctor = {
        name: doc.data.name || '',
        description: doc.data.description || '',
      };
    }
  } catch (e) {
    // Fallback
    const fallbackDoc = getDoctors(locale).find(d => d.id === id);
    if (fallbackDoc) {
      doctor = {
        name: fallbackDoc.name,
        description: fallbackDoc.description
      };
    }
  }

  if (!doctor) {
    return {
      title: 'Zobārsts nav atrasts | Dentamic',
    };
  }

  const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';
  return {
    title: `${doctor.name} | ${suffix}`,
    description: doctor.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { id, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let doctor = null;
  try {
    const doc = await client.getByUID('doctor', id, { lang: locale });
    if (doc) {
      const fallbackDoc = getDoctors(locale).find(d => d.id === id);
      doctor = {
        id: doc.uid!,
        name: doc.data.name || '',
        title: doc.data.name || '',
        category: doc.data.category || '',
        role: doc.data.role || '',
        description: doc.data.description || '',
        fullBio: Array.isArray(doc.data.fullBio) ? (doc.data.fullBio[0] as any)?.text || '' : (doc.data.fullBio as any) || '',
        image: doc.data.image?.url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
        specializations: Array.isArray(doc.data.specializations) 
          ? doc.data.specializations.map((s: any) => s.item || '') 
          : [],
        education: Array.isArray(doc.data.education) 
          ? doc.data.education.map((e: any) => e.item || '') 
          : [],
        languages: Array.isArray(doc.data.languages) 
          ? doc.data.languages.map((l: any) => l.item || '') 
          : [],
        workplace: fallbackDoc?.workplace || (locale === 'en-us' ? 'Riga' : 'Rīga')
      };
    }
  } catch (error) {
    console.warn(`Doctor profile UID "${id}" not found in Prismic, using fallback data.`);
  }

  if (!doctor) {
    doctor = getDoctors(locale).find(d => d.id === id) || null;
  }

  if (!doctor) {
    notFound();
  }

  return <DoctorProfileClient doctor={doctor} langCode={locale} />;
}
