import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import TestimonialsClient from './TestimonialsClient';
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

  const uid = locale === 'en-us' ? 'testimonials' : 'atsauksmes';
  let document = null;
  try {
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'atsauksmes' ? 'testimonials' : 'atsauksmes';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'Patient Testimonials | Dentamic Dental Clinic',
    description: 'Read reviews and smile stories from our happy patients at Dentamic Dental Clinic.',
  } : {
    title: 'Atsauksmes | Dentamic zobārstniecība',
    description: 'Pacientu patiesas atsauksmes un stāsti par veikto zobu labošanu un estētisko restaurāciju.',
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
    const uid = locale === 'en-us' ? 'testimonials' : 'atsauksmes';
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

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'Patient Testimonials | Dentamic Dental Clinic' : 'Atsauksmes | Dentamic zobārstniecība');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  const content = slices && slices.length > 0 ? (
    <SliceZone slices={slices} components={components} />
  ) : (
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
      <TestimonialsClient langCode={locale} customTestimonials={null} hideHeader={true} />
    </>
  );

  return (
    <>
      <SEOStructuredData
        id="testimonials"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      {content}
    </>
  );
}

