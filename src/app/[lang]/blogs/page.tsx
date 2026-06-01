import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import BlogsClient from './BlogsClient';
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
      title: 'Dentamic Blog | Knowledge & Dental Advice',
      description: 'Specialist advice, latest technologies, and practical tips for successful oral care and a healthy smile.',
    };
  }

  return {
    title: 'Blogs un padomi | Dentamic zobārstniecība',
    description: 'Speciālistu ieteikumi, jaunākās tehnoloģijas un praktiski padomi smaida aprūpei.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to load dynamic page content from slices first
  let slices = null;
  try {
    const document = await client.getByUID('page', 'blogs', { lang: locale });
    slices = document?.data?.slices || null;
  } catch (error) {
    console.warn("No Prismic page document for 'blogs' found, falling back to standalone blog posts list.");
  }

  if (slices && slices.length > 0) {
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
  }

  return (
    <>
      <div className="pt-8 pb-4 md:pt-12 md:pb-6 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {locale === 'en-us' ? 'KNOWLEDGE & ADVICE' : 'ZINĀŠANAS UN PADOMI'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {locale === 'en-us' ? 'Dentamic Blog' : 'Dentamic Blogs'}
          </h1>
        </div>
      </div>
      <BlogsClient langCode={locale} customBlogPosts={null} hideHeader={true} />
    </>
  );
}

