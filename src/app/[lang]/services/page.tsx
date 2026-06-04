import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import ServicesClient from './ServicesClient';
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

  const uid = locale === 'en-us' ? 'services' : 'pakalpojumi';
  let document = null;
  try {
    try {
      document = await client.getByUID('page', uid, { lang: locale });
    } catch (e) {
      const fallbackUid = uid === 'pakalpojumi' ? 'services' : 'pakalpojumi';
      document = await client.getByUID('page', fallbackUid, { lang: locale });
    }
  } catch (error) {
    // Ignore and fallback
  }

  const fallback = locale === 'en-us' ? {
    title: 'Our Services | Dentamic Dental Clinic',
    description: 'Explore our range of premium dental treatments: implants, veneers, hygienics, orthodontics, and therapy.',
  } : {
    title: 'Mūsu pakalpojumi | Dentamic zobārstniecība',
    description: 'Pilns mūsdienīgu pakalpojumu spektrs – no estētikas un higiēnas līdz implantācijai un sarežģītai ķirurģijai.',
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
    const uid = locale === 'en-us' ? 'services' : 'pakalpojumi';
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

  const title = document?.data?.meta_title || (locale === 'en-us' ? 'Our Services | Dentamic Dental Clinic' : 'Mūsu pakalpojumi | Dentamic zobārstniecība');
  const description = document?.data?.meta_description || '';
  const imageUrl = document?.data?.schema_image?.url || null;

  const content = slices && slices.length > 0 ? (
    (() => {
      const lastSlice = slices[slices.length - 1];
      if (lastSlice.slice_type === 'cta_block') {
        const mainSlices = slices.slice(0, -1);
        return (
          <>
            <SliceZone slices={mainSlices} components={components} />
            <SliceZone slices={[lastSlice]} components={components} context={{ isBottom: true }} />
          </>
        );
      }
      return <SliceZone slices={slices} components={components} />;
    })()
  ) : (
    <>
      <div className="pt-8 pb-4 md:pt-12 md:pb-6 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {locale === 'en-us' ? 'SERVICES' : 'PAKALPOJUMI'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {locale === 'en-us' ? 'Our Services' : 'Mūsu pakalpojumi'}
          </h1>
        </div>
      </div>
      <ServicesClient langCode={locale} customServices={null} hideHeader={true} />
    </>
  );

  return (
    <>
      <SEOStructuredData
        id="services"
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      {content}
    </>
  );
}

