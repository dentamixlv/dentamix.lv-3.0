'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TestimonialsPage from '../../../components/TestimonialsPage';

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

interface TestimonialsClientProps {
  langCode: string;
  customTestimonials?: Testimonial[] | null;
  hideHeader?: boolean;
}

export default function TestimonialsClient({ langCode, customTestimonials, hideHeader = false }: TestimonialsClientProps) {
  const router = useRouter();
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <TestimonialsPage 
      onBook={handleBook} 
      langCode={langCode} 
      customTestimonials={customTestimonials || undefined}
      hideHeader={hideHeader}
    />
  );
}
