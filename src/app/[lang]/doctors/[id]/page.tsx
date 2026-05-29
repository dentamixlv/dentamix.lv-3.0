import React from 'react';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../../slices';
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

  // Try custom page metadata first
  try {
    const pageDoc = await client.getByUID('page', id, { lang: locale });
    if (pageDoc) {
      const pageData = pageDoc.data as any;
      return {
        title: pageData.meta_title || `${pageData.title || id} | Dentamic`,
        description: pageData.meta_description || '',
      };
    }
  } catch (e) {
    // Ignore and fall back to doctor document
  }

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

  // 1. Try to find a custom 'page' document for this doctor (dynamic slice-based page)
  let slices = null;
  try {
    const doc = await client.getByUID('page', id, { lang: locale });
    slices = doc?.data?.slices || null;
  } catch (e) {
    // Ignore and fall back to structured doctor profile
  }

  if (slices && slices.length > 0) {
    const doctorDetailSliceIndex = slices.findIndex(
      (s: any) => s.slice_type === 'doctor_block' && s.variation === 'detail'
    );

    if (doctorDetailSliceIndex !== -1) {
      const doctorDetailSlice = { ...slices[doctorDetailSliceIndex] };
      // All other slices that are NOT DoctorBlock or PageTitle are embedded slices (e.g. TestimonialBlock)
      const embeddedSlices = slices.filter(
        (s: any, idx: number) => 
          idx !== doctorDetailSliceIndex && 
          s.slice_type !== 'page_title'
      );

      doctorDetailSlice.primary = {
        ...doctorDetailSlice.primary,
        embeddedSlices: embeddedSlices
      };

      // Now we only render PageTitle and DoctorBlock at the top level
      const topLevelSlices = slices.filter(
        (s: any, idx: number) => 
          idx === doctorDetailSliceIndex || 
          s.slice_type === 'page_title'
      ).map((s: any) => s.slice_type === 'doctor_block' && s.variation === 'detail' ? doctorDetailSlice : s);

      return <SliceZone slices={topLevelSlices} components={components} />;
    }

    return <SliceZone slices={slices} components={components} />;
  }

  // 2. Fallback: structured doctor profile document
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
        workplace: fallbackDoc?.workplace || (locale === 'en-us' ? 'Riga' : 'Rīga'),
        detailedBio: doc.data.detailedBio || null,
        qualifications: Array.isArray(doc.data.qualifications)
          ? doc.data.qualifications.map((q: any) => q.item || '')
          : [],
        workplaces: Array.isArray(doc.data.workplaces) && doc.data.workplaces.length > 0
          ? doc.data.workplaces.map((w: any) => w.item || '')
          : (fallbackDoc?.workplaces || (fallbackDoc?.workplace ? [fallbackDoc.workplace] : [locale === 'en-us' ? 'Riga' : 'Rīga'])),
        workplaceTitle: doc.data.workplace_title || undefined
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
