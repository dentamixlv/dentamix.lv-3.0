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

type TestimonialsListProps = SliceComponentProps<Content.TestimonialsListSlice>;

export default function TestimonialsList({ slice }: TestimonialsListProps) {
  const router = useRouter();
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const [testimonials, setTestimonials] = useState<Testimonial[] | undefined>(undefined);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const client = createClient();
        const docs = await client.getAllByType('testimonial', { lang: langCode });
        if (docs && docs.length > 0) {
          setTestimonials(docs.map(d => ({
            id: d.uid!,
            author: d.data.author || '',
            initials: d.data.initials || 'PT',
            bgColor: d.data.bgColor || 'bg-[#400112] text-white',
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
  }, [langCode]);

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <TestimonialsPage 
      onBook={handleBook} 
      langCode={langCode} 
      customTestimonials={testimonials} 
    />
  );
}
