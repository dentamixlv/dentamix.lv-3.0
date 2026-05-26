import React from 'react';
import CookiesClient from './CookiesClient';

interface PageProps {
  params: Promise<{
    lang?: string | string[];
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const langStr = Array.isArray(lang) ? lang[0] : lang;

  if (langStr === 'en') {
    return {
      title: 'Cookie Policy | Dentamic Dental Clinic',
      description: 'Cookie Policy of SIA "Dentamix" - learn about how we use cookies on dentamix.lv.',
    };
  }

  return {
    title: 'Sīkdatņu politika | Dentamic zobārstniecība',
    description: 'SIA "Dentamix" sīkdatņu politika - uzziniet, kā mēs izmantojam sīkdatnes dentamix.lv tīmekļvietnē.',
  };
}

export default async function Page({ params }: PageProps) {
  return <CookiesClient />;
}