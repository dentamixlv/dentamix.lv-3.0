import React from 'react';
import PrivacyClient from './PrivacyClient';

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
      title: 'Privacy Policy | Dentamic Dental Clinic',
      description: 'Privacy Policy of SIA "Dentamix" - learn about how we process and protect your personal data.',
    };
  }

  return {
    title: 'Privātuma politika | Dentamic zobārstniecība',
    description: 'SIA "Dentamix" klientu personas datu privātuma politika - uzziniet, kā mēs apstrādājam un aizsargājam Jūsu personas datus.',
  };
}

export default async function Page({ params }: PageProps) {
  return <PrivacyClient />;
}