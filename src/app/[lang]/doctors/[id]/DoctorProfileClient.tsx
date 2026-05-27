'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DoctorProfilePage from '../../../../components/DoctorProfilePage';
import { Doctor } from '../../../../types';

interface DoctorProfileClientProps {
  doctor: Doctor;
  langCode: string;
}

export default function DoctorProfileClient({ doctor, langCode }: DoctorProfileClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(langCode === 'en-us' ? '/en/doctors' : '/zobarsti');
  };

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <DoctorProfilePage 
      doctor={doctor} 
      onBack={handleBack} 
      onBook={handleBook} 
      langCode={langCode} 
    />
  );
}
