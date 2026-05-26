import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../prismicio';
import BlogPostClient from './BlogPostClient';
import { getPrismicLocale } from '../../page';
import { getBlogPosts } from '../../../../data';

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
  try {
    const doc = await client.getByUID('blog_post', id, { lang: locale });
    if (doc) {
      post = {
        title: doc.data.title || '',
        description: doc.data.description || '',
      };
    }
  } catch (e) {
    // Fallback
    const fallbackPost = getBlogPosts(locale).find(p => p.id === id);
    if (fallbackPost) {
      post = {
        title: fallbackPost.title,
        description: fallbackPost.description
      };
    }
  }

  if (!post) {
    return {
      title: 'Raksts nav atrasts | Dentamic',
    };
  }

  const suffix = locale === 'en-us' ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecība';
  return {
    title: `${post.title} | ${suffix}`,
    description: post.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { id, lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let post = null;
  try {
    const doc = await client.getByUID('blog_post', id, { lang: locale });
    if (doc) {
      post = {
        id: doc.uid!,
        title: doc.data.title || '',
        category: doc.data.category || '',
        description: doc.data.description || '',
        detailedContent: Array.isArray(doc.data.detailedContent) 
          ? doc.data.detailedContent.map((p: any) => p.text || '')
          : [],
        image: doc.data.image?.url || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
        date: doc.data.date || '',
        author: doc.data.author || '',
        readTime: doc.data.readTime || '4 MIN'
      };
    }
  } catch (error) {
    console.warn(`Blog post UID "${id}" not found in Prismic, using fallback data.`);
  }

  if (!post) {
    post = getBlogPosts(locale).find(p => p.id === id) || null;
  }

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} langCode={locale} />;
}
