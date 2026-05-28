import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import ServicesClient from './ServicesClient';
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
      title: 'Our Services | Dentamic Dental Clinic',
      description: 'Explore our range of premium dental treatments: implants, veneers, hygienics, orthodontics, and therapy.',
    };
  }

  return {
    title: 'Mūsu pakalpojumi | Dentamic zobārstniecība',
    description: 'Pilns mūsdienīgu pakalpojumu spektrs – no estētikas un higiēnas līdz implantācijai un sarežģītai ķirurģijai.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to load dynamic page content from slices first
  let slices = null;
  try {
    const uid = locale === 'en-us' ? 'services' : 'pakalpojumi';
    let document;
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'pakalpojumi' ? 'services' : 'pakalpojumi';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'services' found, falling back to standalone services list.");
  }

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  // 2. Fallback to querying service cards dynamically
  let services = null;
  try {
    const documents = await client.getAllByType('service', { lang: locale });
    if (documents && documents.length > 0) {
      services = documents.map(d => ({
        id: d.uid!,
        title: d.data.title || '',
        description: d.data.description || '',
        detailedInfo: Array.isArray(d.data.detailedInfo) ? (d.data.detailedInfo[0] as any)?.text || '' : (d.data.detailedInfo as any) || '',
        priceRange: d.data.priceRange || '',
        duration: d.data.duration || '',
        iconName: d.data.iconName || 'Sparkles',
        image: d.data.image?.url || 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800',
      }));
    }
  } catch (error) {
    console.warn("No services in Prismic, using fallback data.");
  }

  return <ServicesClient langCode={locale} customServices={services} />;
}
