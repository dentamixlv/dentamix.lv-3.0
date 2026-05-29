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

type TestimonialGridProps = SliceComponentProps<Content.TestimonialGridSlice, { isEmbedded?: boolean }>;

export default function TestimonialGrid({ slice, context }: TestimonialGridProps) {
  const router = useRouter();
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';

  const [testimonials, setTestimonials] = useState<Testimonial[] | undefined>(undefined);

  // Check if items are provided inline
  const hasInlineItems = slice.items && slice.items.length > 0 && slice.items.some(item => item.author || item.story);

  useEffect(() => {
    if (hasInlineItems) {
      // Map inline items directly
      const inlineTestimonials = slice.items.map((item, index) => ({
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
      setTestimonials(inlineTestimonials);
    } else {
      // Query testimonials from Prismic
      const fetchTestimonials = async () => {
        try {
          const client = createClient();
          const docs = await client.getAllByType('testimonial', { lang: langCode });
          if (docs && docs.length > 0) {
            setTestimonials(docs.map(d => ({
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
    }
  }, [hasInlineItems, slice.items, langCode]);

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
