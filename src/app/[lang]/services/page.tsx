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

  let slices = null;
  try {
    const document = await client.getByUID('page', 'services', { lang: locale });
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'services' found, falling back to standalone services list.");
  }

  if (slices && slices.length > 0) {
    return <SliceZone slices={slices} components={components} />;
  }

  return <ServicesClient langCode={locale} />;
}
