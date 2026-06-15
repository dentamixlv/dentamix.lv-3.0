import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { components } from '../../../slices';
import { createClient } from '../../../prismicio';
import { getPrismicLocale } from '../page';
import { renderPageLayout } from '../../layoutHelper';
import { constructMetadata, SEOStructuredData, getAlternativeLanguageRedirect } from '../../seoHelper';
import { LanguageUpdater } from '../../../components/LanguageContext';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
    uid: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { uid, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let document = null;
  try {
    document = await client.getByUID('page', uid, { lang: locale });
  } catch (error) {
    // Ignore and fallback
  }

  let alternateUid = undefined;
  if (document && Array.isArray(document.alternate_languages)) {
    const alt = document.alternate_languages.find((a: any) => a.lang === (locale === 'en-us' ? 'lv' : 'en-us'));
    if (alt && alt.uid) {
      alternateUid = alt.uid;
    }
  }

  return constructMetadata(document?.data, locale, {
    title: 'Dentamic',
    description: '',
  }, {
    type: 'custom-page',
    id: uid,
    alternateUid,
  });
}

export default async function Page({ params }: PageProps) {
  const { uid, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let document = null;
  try {
    document = await client.getByUID('page', uid, { lang: locale });
  } catch (error) {
    console.warn(`Prismic document of type page with UID "${uid}" not found.`, error);
  }

  if (!document) {
    const redirectUrl = await getAlternativeLanguageRedirect({
      client,
      id: uid,
      currentLocale: locale,
      pageType: 'page',
      routeType: 'page',
    });
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  // Pre-fetch data for slices on the server to prevent client-side hydration waterfalls
  let prismicServices = null;
  let prismicBlogPosts = null;
  let prismicTestimonials = null;
  try {
    const [servicesRes, blogsRes, testimonialsRes] = await Promise.all([
      client.getAllByType('service', { lang: locale }).catch(() => []),
      client.getAllByType('blog_post', { lang: locale }).catch(() => []),
      client.getAllByType('testimonial', { lang: locale }).catch(() => []),
    ]);
    prismicServices = servicesRes;
    prismicBlogPosts = blogsRes;
    prismicTestimonials = testimonialsRes;
  } catch (err) {
    console.warn("Failed to pre-fetch static slice data on server", err);
  }

  let alternateLanguageUrl = null;
  if (document && Array.isArray(document.alternate_languages)) {
    const alt = document.alternate_languages.find((a: any) => a.lang === (locale === 'en-us' ? 'lv' : 'en-us'));
    if (alt && alt.uid) {
      if (locale === 'en-us') {
        alternateLanguageUrl = `/${alt.uid}`;
      } else {
        alternateLanguageUrl = `/en/${alt.uid}`;
      }
    }
  }

  if (document && document.data?.slices && document.data.slices.length > 0) {
    const title = document.data.meta_title || 'Dentamic';
    const description = document.data.meta_description || '';
    const imageUrl = document.data.schema_image?.url || null;

    return (
      <>
        <LanguageUpdater url={alternateLanguageUrl} />
        <SEOStructuredData
          id={`page-${uid}`}
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
        {renderPageLayout(document.data.slices, components, {}, { prismicServices, prismicBlogPosts, prismicTestimonials })}
      </>
    );
  }

  notFound();
}
