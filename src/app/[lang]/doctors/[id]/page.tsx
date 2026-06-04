import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../../slices';
import { createClient } from '../../../../prismicio';
import DoctorProfileClient from './DoctorProfileClient';
import { getPrismicLocale } from '../../page';
import { getDoctors, extractDoctorFromPage } from '../../../../data';
import { renderPageLayout } from '../../../layoutHelper';
import { constructMetadata, SEOStructuredData, getAlternativeLanguageRedirect } from '../../../seoHelper';
import { LanguageUpdater } from '../../../../components/LanguageContext';

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

  let pageDoc = null;
  let doctor = null;

  // Try custom page first
  try {
    pageDoc = await client.getByUID('page', id, { lang: locale });
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

  const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';
  const fallback = doctor ? {
    title: `${doctor.name} | ${suffix}`,
    description: doctor.description || '',
  } : {
    title: locale === 'en-us' ? 'Dentist Not Found | Dentamic' : 'Zobārsts nav atrasts | Dentamic',
    description: '',
  };

  return constructMetadata(pageDoc?.data, locale, fallback);
}

export default async function Page({ params }: PageProps) {
  const { id, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let slices = null;
  let pageDoc = null;
  try {
    pageDoc = await client.getByUID('page', id, { lang: locale });
    slices = pageDoc?.data?.slices || null;
  } catch (e) {
    // Ignore and fall back to structured doctor profile
  }

  if (!pageDoc) {
    const redirectUrl = await getAlternativeLanguageRedirect({
      client,
      id,
      currentLocale: locale,
      pageType: 'page',
      routeType: 'doctors',
    });
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  let alternateLanguageUrl = null;
  if (pageDoc && Array.isArray(pageDoc.alternate_languages)) {
    const alt = pageDoc.alternate_languages.find((a: any) => a.lang === (locale === 'en-us' ? 'lv' : 'en-us'));
    if (alt && alt.uid) {
      if (locale === 'en-us') {
        alternateLanguageUrl = `/zobarsti/${alt.uid}`;
      } else {
        alternateLanguageUrl = `/en/doctors/${alt.uid}`;
      }
    }
  }

  const doctor = getDoctors(locale).find(d => d.id === id) || null;

  const defaultTitle = doctor ? `${doctor.name} | ${locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība'}` : 'Dentamic';
  const title = pageDoc?.data?.meta_title || defaultTitle;
  const description = pageDoc?.data?.meta_description || doctor?.description || '';
  const imageUrl = pageDoc?.data?.schema_image?.url || null;

  if (slices && slices.length > 0) {
    return (
      <>
        <LanguageUpdater url={alternateLanguageUrl} />
        <SEOStructuredData
          id={`doctor-${id}`}
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
        {renderPageLayout(slices, components, {
          showBackButton: true,
          backButtonText: locale === 'en-us' ? 'Back to Dentists' : 'Atpakaļ pie zobārstiem',
          backButtonHref: locale === 'en-us' ? '/en/doctors' : '/zobarsti',
        })}
      </>
    );
  }

  if (!doctor) {
    notFound();
  }

  return (
    <>
      <LanguageUpdater url={alternateLanguageUrl} />
      <SEOStructuredData
        id={`doctor-${id}`}
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
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
