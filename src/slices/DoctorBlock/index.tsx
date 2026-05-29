'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";

import { getDoctors } from '../../data';
import { Doctor } from '../../types';
import DoctorProfilePage from '../../components/DoctorProfilePage';

type DoctorBlockProps = SliceComponentProps<Content.DoctorBlockSlice>;

export default function DoctorBlock({ slice }: DoctorBlockProps) {
  const params = useParams();
  const router = useRouter();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';

  const doctorId = typeof params?.id === 'string' ? params.id : '';
  const fallbackDoc = getDoctors(langCode).find(d => d.id === doctorId);
  const formatUidToName = (uid: string) => {
    return uid
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const name = fallbackDoc?.name || formatUidToName(doctorId);
  const category = fallbackDoc?.category || '';
  const role = fallbackDoc?.role || '';
  const description = fallbackDoc?.description || '';
  
  const fullBioText = Array.isArray(slice.primary.fullBio) && slice.primary.fullBio.length > 0
    ? slice.primary.fullBio.map((block: any) => block.text).join('\n')
    : (typeof slice.primary.fullBio === 'string' ? slice.primary.fullBio : fallbackDoc?.fullBio || '');

  const detailedBio = slice.primary.detailedBio || fallbackDoc?.detailedBio || null;
  const image = slice.primary.image?.url || fallbackDoc?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
  const workplaceTitle = slice.primary.workplace_title || fallbackDoc?.workplaceTitle || undefined;

  const items = slice.items || [];
  const hasItems = items.length > 0 && items.some(item => item.text);

  const specializations = hasItems
    ? items.filter(item => item.item_type === 'Specialization' && item.text).map(item => item.text as string)
    : (fallbackDoc?.specializations || []);

  const education = hasItems
    ? items.filter(item => item.item_type === 'Education' && item.text).map(item => item.text as string)
    : (fallbackDoc?.education || []);

  const qualifications = hasItems
    ? items.filter(item => item.item_type === 'Qualification' && item.text).map(item => item.text as string)
    : (fallbackDoc?.qualifications || []);

  const workplaces = hasItems
    ? items.filter(item => item.item_type === 'Workplace' && item.text).map(item => item.text as string)
    : (fallbackDoc?.workplaces || (fallbackDoc?.workplace ? [fallbackDoc.workplace] : []));

  const languages = hasItems
    ? items.filter(item => item.item_type === 'Language' && item.text).map(item => item.text as string)
    : (fallbackDoc?.languages || []);

  const embeddedSlices = (slice.primary as any).embeddedSlices || [];

  // CTA fields from Prismic (fallback to undefined = DoctorProfilePage uses hardcoded defaults)
  const ctaBadgeText = (slice.primary as any).cta_badge_text || undefined;
  const ctaTitle = (slice.primary as any).cta_title || undefined;
  const ctaDescription = (slice.primary as any).cta_description || undefined;
  const ctaButtonText = (slice.primary as any).cta_button_text || undefined;
  const ctaLinkRaw = (slice.primary as any).cta_link;
  const ctaLink = ctaLinkRaw?.url || undefined;
  const ctaLinkBlank = (slice.primary as any).cta_link_blank ?? undefined;

  const doctorObj: Doctor = {
    id: doctorId || 'doctor-detail',
    name,
    title: name,
    category,
    role,
    description,
    fullBio: fullBioText,
    detailedBio,
    image,
    specializations,
    education,
    qualifications,
    workplaces,
    languages,
    workplaceTitle,
    slices: embeddedSlices,
    ctaBadgeText,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaLink,
    ctaLinkBlank,
  };

  const handleBack = () => {
    router.push(langCode === 'en-us' ? '/en/doctors' : '/zobarsti');
  };

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <DoctorProfilePage
      doctor={doctorObj}
      onBack={handleBack}
      onBook={handleBook}
      langCode={langCode}
    />
  );
}
