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
    return <SliceZone slices={slices} components={components} />;
  }

  // 2. Fallback to querying blog post cards dynamically
  let blogPosts = null;
  try {
    const documents = await client.getAllByType('blog_post', { lang: locale });
    if (documents && documents.length > 0) {
      blogPosts = documents.map(d => ({
        id: d.uid!,
        title: d.data.title || '',
        category: d.data.category || '',
        description: d.data.description || '',
        detailedContent: Array.isArray(d.data.detailedContent) 
          ? d.data.detailedContent.map((p: any) => p.text || '')
          : [],
        image: d.data.image?.url || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
        date: d.data.date || '',
        author: d.data.author || '',
        readTime: d.data.readTime || '4 MIN'
      }));
    }
  } catch (error) {
    console.warn("No blog posts in Prismic, using fallback data.");
  }

  return <BlogsClient langCode={locale} customBlogPosts={blogPosts} />;
}
