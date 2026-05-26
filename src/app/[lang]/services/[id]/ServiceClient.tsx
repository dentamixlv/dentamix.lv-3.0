'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ServiceDetailPage from '../../../../components/ServiceDetailPage';
import { Service } from '../../../../types';

interface ServiceClientProps {
  service: Service;
  langCode: string;
}

export default function ServiceClient({ service, langCode }: ServiceClientProps) {
  const router = useRouter();
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const handleBack = () => {
    router.push(langCode === 'en-us' ? '/en/services' : '/pakalpojumi');
  };

  const handleBook = () => {
    router.push(`${langPrefix}/contacts`);
  };

  return (
    <ServiceDetailPage 
      service={service} 
      onBack={handleBack} 
      onBookService={handleBook} 
      langCode={langCode}
    />
  );
}
