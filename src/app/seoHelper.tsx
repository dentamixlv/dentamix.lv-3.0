import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';

interface SeoData {
  meta_title?: string | null;
  meta_description?: string | null;
  schema_image?: {
    url?: string | null;
    alt?: string | null;
  } | null;
  og_image?: {
    url?: string | null;
    alt?: string | null;
  } | null;
}

interface StructuredDataProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  url?: string;
}

/**
 * Renders structured data (JSON-LD WebPage schema) using Next.js Script component.
 * It filters out empty or invalid properties like schema_image to avoid Google Rich Results validation issues.
 */
export function SEOStructuredData({
  id,
  title,
  description,
  imageUrl,
  url,
}: StructuredDataProps) {
  // Construct schema dynamically to prevent any null or empty keys
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
  };

  if (imageUrl && imageUrl.trim() !== '') {
    schema["image"] = imageUrl;
  }
  if (url && url.trim() !== '') {
    schema["url"] = url;
  }

  return (
    <Script
      id={`jsonld-seo-${id}`}
      strategy="afterInteractive"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Utility to generate Next.js Metadata for SEO/OpenGraph/Twitter
 */
export function constructMetadata(
  data: SeoData | undefined | null,
  locale: string,
  fallback: { title: string; description: string }
): Metadata {
  const title = data?.meta_title || fallback.title;
  const description = data?.meta_description || fallback.description;
  const ogImageUrl = data?.og_image?.url || '';
  const ogImageAlt = data?.og_image?.alt || title;

  const localeCode = locale === 'en-us' ? 'en_US' : 'lv_LV';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: localeCode,
      type: 'website',
      ...(ogImageUrl ? {
        images: [
          {
            url: ogImageUrl,
            alt: ogImageAlt,
          }
        ]
      } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl ? {
        images: [ogImageUrl],
      } : {}),
    },
  };
}

/**
 * Resolves the correct alternative language URL for a missing document.
 * Queries the document in the alternative locale, reads its alternate_languages reference,
 * and builds the correct path segment.
 */
export async function getAlternativeLanguageRedirect({
  client,
  id,
  currentLocale,
  pageType = 'page',
  routeType,
}: {
  client: any;
  id: string;
  currentLocale: string;
  pageType?: string;
  routeType: 'services' | 'page' | 'doctors' | 'blogs';
}): Promise<string | null> {
  try {
    const otherLocale = currentLocale === 'en-us' ? 'lv' : 'en-us';
    const otherDoc = await client.getByUID(pageType, id, { lang: otherLocale });
    if (otherDoc && Array.isArray(otherDoc.alternate_languages)) {
      const alt = otherDoc.alternate_languages.find((a: any) => a.lang === currentLocale);
      if (alt && alt.uid) {
        if (currentLocale === 'en-us') {
          if (routeType === 'page') return `/en/${alt.uid}`;
          return `/en/${routeType}/${alt.uid}`;
        } else {
          if (routeType === 'services') return `/pakalpojumi/${alt.uid}`;
          if (routeType === 'doctors') return `/zobarsti/${alt.uid}`;
          if (routeType === 'blogs') return `/blogs/${alt.uid}`;
          return `/${alt.uid}`;
        }
      }
    }
  } catch (e) {
    // Ignore and return null
  }
  return null;
}

