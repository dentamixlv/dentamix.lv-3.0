import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import TestimonialsClient from './TestimonialsClient';
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
      title: 'Patient Testimonials | Dentamic Dental Clinic',
      description: 'Read reviews and smile stories from our happy patients at Dentamic Dental Clinic.',
    };
  }

  return {
    title: 'Atsauksmes | Dentamic zobārstniecība',
    description: 'Pacientu patiesas atsauksmes un stāsti par veikto zobu labošanu un estētisko restaurāciju.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to load dynamic page content from slices first
  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'testimonials' : 'atsauksmes';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'atsauksmes' ? 'testimonials' : 'atsauksmes';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'testimonials' found, falling back to standalone testimonials list.");
  }

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  // 2. Fallback to querying testimonial cards dynamically
  let testimonials = null;
  try {
    const documents = await client.getAllByType('testimonial', { lang: locale });
    if (documents && documents.length > 0) {
      testimonials = documents.map(d => ({
        id: d.uid!,
        author: d.data.author || '',
        initials: d.data.initials || 'PT',
        bgColor: d.data.bgColor || 'bg-[#511B29] text-white',
        treatment: d.data.treatment || '',
        doctor: d.data.doctor || '',
        rating: Number(d.data.rating) || 5,
        date: d.data.date || '',
        advTag: d.data.advTag || '',
        quote: d.data.quote || '',
        story: d.data.story || ''
      }));
    }
  } catch (error) {
    console.warn("No testimonials in Prismic, using fallback data.");
  }

  return (
    <>
      <div className="pt-8 pb-4 md:pt-12 md:pb-6 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {locale === 'en-us' ? 'PATIENT TESTIMONIALS' : 'PACIENTU ATSAUKSMES'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {locale === 'en-us' ? 'Patient Testimonials' : 'Pacientu atsauksmes'}
          </h1>
        </div>
      </div>
      <TestimonialsClient langCode={locale} customTestimonials={testimonials} hideHeader={true} />
    </>
  );
}

