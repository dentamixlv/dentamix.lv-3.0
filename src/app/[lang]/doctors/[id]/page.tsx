import React from 'react';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../../slices';
import { createClient } from '../../../../prismicio';
import DoctorProfileClient from './DoctorProfileClient';
import { getPrismicLocale } from '../../page';
import { getDoctors, extractDoctorFromPage } from '../../../../data';
import { renderPageLayout } from '../../../layoutHelper';

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

  // Try custom page first
  try {
    const pageDoc = await client.getByUID('page', id, { lang: locale });
    if (pageDoc) {
      doctor = extractDoctorFromPage(pageDoc);
    }
  } catch (e) {
    // Ignore and fall back to local doctors database
  }

  // Fallback to local doctors database if not found in custom page
  if (!doctor) {
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
    return renderPageLayout(slices, components, {
      showBackButton: true,
      backButtonText: locale === 'en-us' ? 'Back to Dentists' : 'Atpakaļ pie zobārstiem',
      backButtonHref: locale === 'en-us' ? '/en/doctors' : '/zobarsti',
    });
  }

  // 2. Fallback: static doctor data
  const doctor = getDoctors(locale).find(d => d.id === id) || null;

  if (!doctor) {
    notFound();
  }

  return (
    <>
      <div className="pt-8 pb-4 md:pt-12 md:pb-6 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block text-center">
            {doctor.category === 'SPECIĀLISTE' || doctor.category === 'SPECIALIST' ? doctor.role : doctor.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {doctor.name}
          </h1>
          {doctor.description && (
            <p className="text-base text-[#6a5b5e] mt-2 font-medium">
              {doctor.description}
            </p>
          )}
        </div>
      </div>
      <DoctorProfileClient doctor={doctor} langCode={locale} />
    </>
  );
}
