import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../prismicio';
import ServiceClient from './ServiceClient';
import { getPrismicLocale } from '../../page';
import { getServices } from '../../../../data';
import { renderPageLayout } from '../../../layoutHelper';
import { components } from '../../../../slices';
import { constructMetadata, SEOStructuredData } from '../../../seoHelper';

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
  try {
    pageDoc = await client.getByUID('page', id, { lang: locale });
  } catch (e) {
    // Ignore
  }

  const fallbackService = getServices(locale).find((s) => s.id === id);
  const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';

  const fallback = fallbackService ? {
    title: `${fallbackService.title} | ${suffix}`,
    description: fallbackService.description || '',
  } : {
    title: locale === 'en-us' ? 'Service Not Found | Dentamic' : 'Pakalpojums nav atrasts | Dentamic',
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
    // Ignore
  }

  const service = getServices(locale).find((s) => s.id === id) || null;

  const defaultTitle = service ? `${service.title} | ${locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība'}` : 'Dentamic';
  const title = pageDoc?.data?.meta_title || defaultTitle;
  const description = pageDoc?.data?.meta_description || service?.description || '';
  const imageUrl = pageDoc?.data?.schema_image?.url || null;

  if (slices && slices.length > 0) {
    return (
      <>
        <SEOStructuredData
          id={`service-${id}`}
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
        {renderPageLayout(slices, components, {
          showBackButton: true,
          backButtonText: locale === 'en-us' ? 'Back to Services' : 'Atpakaļ uz pakalpojumiem',
          backButtonHref: locale === 'en-us' ? '/en/services' : '/pakalpojumi',
        })}
      </>
    );
  }

  if (!service) {
    notFound();
  }

  return (
    <>
      <SEOStructuredData
        id={`service-${id}`}
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      <ServiceClient service={service} langCode={locale} />
    </>
  );
}
