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

  try {
    const doc = await client.getByUID('service', id, { lang: locale });
    if (doc) {
      service = {
        title: doc.data.title || '',
        description: doc.data.description || '',
      };
    }
  } catch (e) {
    const fallbackService = getServices(locale).find((s) => s.id === id);
    if (fallbackService) {
      service = {
        title: fallbackService.title,
        description: fallbackService.description,
      };
    }
  }

  if (!service) {
    return {
      title: 'Pakalpojums nav atrasts | Dentamic',
    };
  }

  const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';
  return {
    title: `${service.title} | ${suffix}`,
    description: service.description,
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

  let service = null;
  try {
    const doc = await client.getByUID('service', id, { lang: locale });
    if (doc) {
      service = {
        id: doc.uid!,
        title: doc.data.title || '',
        description: doc.data.description || '',
        detailedInfo: Array.isArray(doc.data.detailedInfo) ? (doc.data.detailedInfo[0] as any)?.text || '' : (doc.data.detailedInfo as any) || '',
        priceRange: doc.data.priceRange || '',
        duration: doc.data.duration || '',
        iconName: doc.data.iconName || 'Sparkles',
        image: doc.data.image?.url || 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800',
      };
    }
  } catch (error) {
    console.warn(`Prismic service UID "${id}" not found, using fallback data.`);
  }

  if (!service) {
    service = getServices(locale).find((s) => s.id === id) || null;
  }

  if (!service) {
    notFound();
  }

  return <ServiceClient service={service} langCode={locale} />;
}
