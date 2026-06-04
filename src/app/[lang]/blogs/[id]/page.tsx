import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '../../../../prismicio';
import BlogPostClient from './BlogPostClient';
import { getPrismicLocale } from '../../page';
import { getBlogPosts } from '../../../../data';
import { renderPageLayout } from '../../../layoutHelper';
import { components } from '../../../../slices';
import { constructMetadata, SEOStructuredData, getAlternativeLanguageRedirect } from '../../../seoHelper';

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

  const fallbackPost = getBlogPosts(locale).find(p => p.id === id);
  const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';

  const fallback = fallbackPost ? {
    title: `${fallbackPost.title} | ${suffix}`,
    description: fallbackPost.description || '',
  } : {
    title: locale === 'en-us' ? 'Article Not Found | Dentamic' : 'Raksts nav atrasts | Dentamic',
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

  if (!pageDoc) {
    const redirectUrl = await getAlternativeLanguageRedirect({
      client,
      id,
      currentLocale: locale,
      pageType: 'page',
      routeType: 'blogs',
    });
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  const post = getBlogPosts(locale).find(p => p.id === id) || null;

  const title = pageDoc?.data?.meta_title || (post ? `${post.title} | ${locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība'}` : 'Dentamic');
  const description = pageDoc?.data?.meta_description || post?.description || '';
  const imageUrl = pageDoc?.data?.schema_image?.url || null;

  if (slices && slices.length > 0) {
    return (
      <>
        <SEOStructuredData
          id={`blog-${id}`}
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
        {renderPageLayout(slices, components, {
          showBackButton: true,
          backButtonText: locale === 'en-us' ? 'Back to Blog' : 'Atpakaļ uz blogu',
          backButtonHref: locale === 'en-us' ? '/en/blogs' : '/blogs',
        })}
      </>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      <SEOStructuredData
        id={`blog-${id}`}
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      <BlogPostClient post={post} langCode={locale} />
    </>
  );
}
