'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import TestimonialsPage from '../../components/TestimonialsPage';
import { createClient } from '../../prismicio';

interface Testimonial {
  id: string;
  author: string;
  initials: string;
  bgColor: string;
  treatment: string;
  doctor: string;
  rating: number;
  date: string;
  advTag: string;
  quote: string;
  story: string;
}

type TestimonialGridProps = SliceComponentProps<
  Content.TestimonialGridSlice,
  { isEmbedded?: boolean; prismicTestimonials?: any[] }
>;

export default function TestimonialGrid({ slice, context }: TestimonialGridProps) {
  const router = useRouter();
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';

  const [clientTestimonials, setClientTestimonials] = useState<Testimonial[] | undefined>(undefined);

  // Check if items are provided inline
  const hasInlineItems = slice.items && slice.items.length > 0 && slice.items.some(item => item.author || item.story);

  // Synchronously compute testimonials if inline or pre-fetched via context on the server/first render
  const testimonials = React.useMemo(() => {
    if (hasInlineItems) {
      return slice.items.map((item, index) => ({
        id: `inline-${index}-${item.author || ''}`,
        author: item.author || '',
        initials: item.author ? item.author.charAt(0).toUpperCase() : 'PT',
        bgColor: 'bg-[#511B29] text-white',
        treatment: item.treatment || '',
        doctor: '',
        rating: item.rating !== null && item.rating !== undefined ? Number(item.rating) : 5,
        date: item.date || '',
        advTag: '',
        quote: '',
        story: item.story || ''
      }));
    }

    if (context?.prismicTestimonials && context.prismicTestimonials.length > 0) {
      return context.prismicTestimonials.map((d: any) => ({
        id: d.uid!,
        author: d.data.author || '',
        initials: d.data.initials || 'PT',
        bgColor: d.data.bgColor || 'bg-[#511B29] text-white',
        treatment: d.data.treatment || '',
        doctor: d.data.doctor || '',
        rating: Number(d.data.rating) || 5,
        date: d.data.date || '',
        advTag: d.data.advTag || '',
        quote: d.data.quote || '',
        story: d.data.story || ''
      }));
    }

    return clientTestimonials;
  }, [hasInlineItems, slice.items, context?.prismicTestimonials, clientTestimonials]);

  useEffect(() => {
    // Skip client-side fetch if inline items or context testimonials are already provided
    if (hasInlineItems || (context?.prismicTestimonials && context.prismicTestimonials.length > 0)) {
      return;
    }

    // Query testimonials from Prismic
    const fetchTestimonials = async () => {
      try {
        const client = createClient();
        const docs = await client.getAllByType('testimonial', { lang: langCode });
        if (docs && docs.length > 0) {
          setClientTestimonials(docs.map(d => ({
            id: d.uid!,
            author: d.data.author || '',
            initials: d.data.initials || 'PT',
            bgColor: d.data.bgColor || 'bg-[#511B29] text-white',
            treatment: d.data.treatment || '',
            doctor: d.data.doctor || '',
            rating: Number(d.data.rating) || 5,
            date: d.data.date || '',
            advTag: d.data.advTag || '',
            quote: d.data.quote || '',
            story: d.data.story || ''
          })));
        }
      } catch (e) {
        console.warn("Failed to fetch testimonials from Prismic, using fallbacks.", e);
      }
    };
    fetchTestimonials();
  }, [hasInlineItems, slice.items, langCode, context?.prismicTestimonials]);

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined 
    ? slice.primary.hideHeader 
    : true;

  const isEmbedded = context?.isEmbedded === true;

  return (
    <TestimonialsPage 
      onBook={handleBook} 
      langCode={langCode} 
      customTestimonials={testimonials} 
      hideHeader={hideHeaderValue}
      isEmbedded={isEmbedded}
    />
  );
}
