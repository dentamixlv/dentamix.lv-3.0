import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../prismicio';
import BlogPostClient from './BlogPostClient';
import { getPrismicLocale } from '../../page';
import { getBlogPosts } from '../../../../data';
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

  let post = null;
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

  const fallbackPost = getBlogPosts(locale).find(p => p.id === id);
  if (fallbackPost) {
    const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';
    return {
      title: `${fallbackPost.title} | ${suffix}`,
      description: fallbackPost.description,
    };
  }

  return {
    title: 'Raksts nav atrasts | Dentamic',
  };
}

export default async function Page({ params }: PageProps) {
  const { id, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  // 1. Try to find a custom 'page' document for this blog post (dynamic slice-based page)
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
      backButtonText: locale === 'en-us' ? 'Back to Blog' : 'Atpakaļ uz blogu',
      backButtonHref: locale === 'en-us' ? '/en/blogs' : '/blogs',
    });
  }

  const post = getBlogPosts(locale).find(p => p.id === id) || null;

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} langCode={locale} />;
}
