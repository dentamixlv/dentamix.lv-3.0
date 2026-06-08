import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import { getClinics } from '../data';

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

export interface RouteInfo {
  type: 'home' | 'about' | 'services' | 'service-detail' | 'doctors' | 'doctor-detail' | 'blogs' | 'blog-detail' | 'prices' | 'contacts' | 'testimonials' | 'custom-page';
  id?: string;
  alternateUid?: string;
}

interface DentistStructuredDataProps {
  locale: string;
  prismicClinics?: any[] | null;
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
 * Renders structured data (JSON-LD Dentist schema) using Next.js Script component.
 * Supports dynamic clinics fetched from Prismic (the footer doc) with a static fallback.
 */
export function SEODentistStructuredData({ locale, prismicClinics }: DentistStructuredDataProps) {
  const isEn = locale === 'en-us';
  
  let rawClinics: any[] = [];
  if (prismicClinics && prismicClinics.length > 0) {
    rawClinics = prismicClinics;
  } else {
    rawClinics = getClinics(locale);
  }

  const schemas = rawClinics.map((clinic, index) => {
    // Clinic coordinates based on fallback/known values
    // Riga coordinates: lat: 56.9585641, lng: 24.1313913
    // Adazi coordinates: lat: 57.0725451, lng: 24.3257538
    let latitude = 56.9585641;
    let longitude = 24.1313913;
    
    const isAdazi = clinic.id === 'adazi' || (clinic.name && (clinic.name.toLowerCase().includes('ādaži') || clinic.name.toLowerCase().includes('adazi')));
    if (isAdazi) {
      latitude = 57.0725451;
      longitude = 24.3257538;
    }

    // Try to extract street address, city, postal code
    let streetAddress = clinic.address || '';
    let addressLocality = isAdazi ? (isEn ? 'Adazi' : 'Ādaži') : (isEn ? 'Riga' : 'Rīga');
    let postalCode = isAdazi ? 'LV-2164' : 'LV-1001';
    
    if (clinic.address) {
      const parts = clinic.address.split(',');
      if (parts.length >= 3) {
        streetAddress = parts[0].trim();
        addressLocality = parts[1].trim();
        postalCode = parts[2].trim();
      }
    }

    // Build OpeningHoursSpecification dynamically
    const openingHours: any[] = [];
    
    const wd = clinic.workHoursWeekdays || clinic.workHours?.weekdays || '';
    if (wd) {
      const match = wd.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
      if (match) {
        openingHours.push({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": match[1],
          "closes": match[2]
        });
      }
    } else {
      openingHours.push({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": isAdazi ? "18:00" : "19:00"
      });
    }

    const sat = clinic.workHoursSaturday || clinic.workHours?.saturday || '';
    if (sat && !sat.toLowerCase().includes('slēgts') && !sat.toLowerCase().includes('closed')) {
      const match = sat.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
      if (match) {
        openingHours.push({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": match[1],
          "closes": match[2]
        });
      }
    } else if (!isAdazi && !sat) {
      openingHours.push({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "10:00",
        "closes": "15:00"
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "Dentist",
      "name": clinic.name || (isAdazi ? "Dentamic Ādaži" : "Dentamic Rīga"),
      "telephone": clinic.phone || (isAdazi ? "+371 29 111 222" : "+371 29 459 999"),
      "email": clinic.email || (isAdazi ? "adazi@dentamic.lv" : "riga@dentamic.lv"),
      "url": isEn ? "https://dentamix.lv/en" : "https://dentamix.lv",
      "logo": "https://dentamix.lv/favicon.ico",
      "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": streetAddress,
        "addressLocality": addressLocality,
        "postalCode": postalCode,
        "addressCountry": "LV"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": latitude,
        "longitude": longitude
      },
      "openingHoursSpecification": openingHours
    };
  });

  return (
    <Script
      id="jsonld-dentist-seo"
      strategy="afterInteractive"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}

/**
 * Resolves standard routes paths for canonical/hreflang tags
 */
function getRoutePaths(locale: string, routeInfo?: RouteInfo): { currentPath: string; alternatePath: string } | null {
  if (!routeInfo) return null;
  
  const isEn = locale === 'en-us';
  const id = routeInfo.id || '';
  const altUid = routeInfo.alternateUid || '';
  
  let currentPath = '';
  let alternatePath = '';
  
  switch (routeInfo.type) {
    case 'home':
      currentPath = isEn ? '/en' : '/';
      alternatePath = isEn ? '/' : '/en';
      break;
    case 'about':
      currentPath = isEn ? '/en/about' : '/par-mums';
      alternatePath = isEn ? '/par-mums' : '/en/about';
      break;
    case 'services':
      currentPath = isEn ? '/en/services' : '/pakalpojumi';
      alternatePath = isEn ? '/pakalpojumi' : '/en/services';
      break;
    case 'service-detail':
      currentPath = isEn ? `/en/services/${id}` : `/pakalpojumi/${id}`;
      alternatePath = isEn ? `/pakalpojumi/${id}` : `/en/services/${id}`;
      break;
    case 'doctors':
      currentPath = isEn ? '/en/doctors' : '/zobarsti';
      alternatePath = isEn ? '/zobarsti' : '/en/doctors';
      break;
    case 'doctor-detail':
      currentPath = isEn ? `/en/doctors/${id}` : `/zobarsti/${id}`;
      alternatePath = isEn ? `/zobarsti/${id}` : `/en/doctors/${id}`;
      break;
    case 'blogs':
      currentPath = isEn ? '/en/blogs' : '/blogs';
      alternatePath = isEn ? '/blogs' : '/en/blogs';
      break;
    case 'blog-detail':
      currentPath = isEn ? `/en/blogs/${id}` : `/blogs/${id}`;
      alternatePath = isEn ? `/blogs/${id}` : `/en/blogs/${id}`;
      break;
    case 'prices':
      currentPath = isEn ? '/en/prices' : '/cenas';
      alternatePath = isEn ? '/cenas' : '/en/prices';
      break;
    case 'contacts':
      currentPath = isEn ? '/en/contacts' : '/kontakti';
      alternatePath = isEn ? '/kontakti' : '/en/contacts';
      break;
    case 'testimonials':
      currentPath = isEn ? '/en/testimonials' : '/atsauksmes';
      alternatePath = isEn ? '/atsauksmes' : '/en/testimonials';
      break;
    case 'custom-page':
      if (isEn) {
        currentPath = `/en/${id}`;
        alternatePath = altUid ? `/${altUid}` : `/${id}`;
      } else {
        currentPath = `/${id}`;
        alternatePath = altUid ? `/en/${altUid}` : `/en/${id}`;
      }
      break;
    default:
      return null;
  }
  
  return { currentPath, alternatePath };
}

/**
 * Utility to generate Next.js Metadata for SEO/OpenGraph/Twitter
 */
export function constructMetadata(
  data: SeoData | undefined | null,
  locale: string,
  fallback: { title: string; description: string },
  routeInfo?: RouteInfo
): Metadata {
  const title = data?.meta_title || fallback.title;
  const description = data?.meta_description || fallback.description;
  const ogImageUrl = data?.og_image?.url || '';
  const ogImageAlt = data?.og_image?.alt || title;

  const localeCode = locale === 'en-us' ? 'en_US' : 'lv_LV';
  const baseUrl = 'https://dentamix.lv';
  
  const routePaths = getRoutePaths(locale, routeInfo);
  const alternates: Metadata['alternates'] = {};
  
  if (routePaths) {
    alternates.canonical = `${baseUrl}${routePaths.currentPath}`;
    alternates.languages = {
      'lv-LV': `${baseUrl}${locale === 'en-us' ? routePaths.alternatePath : routePaths.currentPath}`,
      'en-US': `${baseUrl}${locale === 'en-us' ? routePaths.currentPath : routePaths.alternatePath}`,
    };
  }

  return {
    metadataBase: new URL(baseUrl),
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
    ...(routePaths ? { alternates } : {}),
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

