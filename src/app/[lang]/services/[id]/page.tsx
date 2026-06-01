import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../prismicio';
import ServiceClient from './ServiceClient';
import { getPrismicLocale } from '../../page';
import { getServices } from '../../../../data';
import { renderPageLayout } from '../../../layoutHelper';
import { components } from '../../../../slices';

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

  let service = null;
  // Try custom page first
  try {
    const pageDoc = await client.getByUID('page', id, { lang: locale });
    if (pageDoc && pageDoc.data && (pageDoc.data as any).meta_title) {
      return {
        title: (pageDoc.data as any).meta_title,
        description: (pageDoc.data as any).meta_description || '',
      };
    }
  } catch (e) {
    // Ignore
  }

  const fallbackService = getServices(locale).find((s) => s.id === id);
  if (fallbackService) {
    const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';
    return {
      title: `${fallbackService.title} | ${suffix}`,
      description: fallbackService.description,
    };
  }

  return {
    title: 'Pakalpojums nav atrasts | Dentamic',
  };
}

export default async function Page({ params }: PageProps) {
  const { id, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to find a custom 'page' document for this service (dynamic slice-based page)
  let slices = null;
  try {
    const doc = await client.getByUID('page', id, { lang: locale });
    slices = doc?.data?.slices || null;
  } catch (e) {
    // Ignore
  }

  if (slices && slices.length > 0) {
    return renderPageLayout(slices, components, {
      showBackButton: true,
      backButtonText: locale === 'en-us' ? 'Back to Services' : 'Atpakaļ uz pakalpojumiem',
      backButtonHref: locale === 'en-us' ? '/en/services' : '/pakalpojumi',
    });
  }

  const service = getServices(locale).find((s) => s.id === id) || null;

  if (!service) {
    notFound();
  }

  return <ServiceClient service={service} langCode={locale} />;
}
