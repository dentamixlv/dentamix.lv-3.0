'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import DoctorsClient from '../../app/[lang]/doctors/DoctorsClient';
import { getDoctors } from '../../data';
import { Doctor } from '../../types';
import { createClient } from '../../prismicio';

type DoctorPageProps = SliceComponentProps<Content.DoctorPageSlice>;

export default function DoctorPage({ slice }: DoctorPageProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';

  const [doctors, setDoctors] = useState<Doctor[] | null>(null);

  // Check if items are provided (linked doctor documents)
  const linkedItems = slice.items || [];
  const hasLinkedDoctors = linkedItems.length > 0 && linkedItems.some(item => isFilled.link(item.doctor));

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const client = createClient();
        let docs = [];

        if (hasLinkedDoctors) {
          // Fetch specific linked doctors
          const ids = linkedItems
            .map(item => (isFilled.link(item.doctor) && (item.doctor as any).id) || '')
            .filter(Boolean);
          if (ids.length > 0) {
            const response = await client.getByIDs(ids, { lang: langCode });
            docs = response.results;
          }
        } else {
          // Query all doctors from Prismic
          const response = await client.getAllByType('doctor', { lang: langCode });
          docs = response;
        }

        if (docs && docs.length > 0) {
          setDoctors(docs.map(d => ({
            id: d.uid!,
            name: d.data.name || '',
            title: d.data.name || '',
            category: d.data.category || '',
            role: d.data.role || '',
            description: d.data.description || '',
            fullBio: Array.isArray(d.data.fullBio) ? (d.data.fullBio[0] as any)?.text || '' : (d.data.fullBio as any) || '',
            image: d.data.image?.url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
            specializations: Array.isArray(d.data.specializations) ? d.data.specializations.map((s: any) => s.item || '') : [],
            education: Array.isArray(d.data.education) ? d.data.education.map((e: any) => e.item || '') : [],
            languages: Array.isArray(d.data.languages) ? d.data.languages.map((l: any) => l.item || '') : [],
          })));
        } else {
          setDoctors(getDoctors(langCode));
        }
      } catch (e) {
        console.warn("Failed to fetch doctors in DoctorPage, using fallbacks.", e);
        setDoctors(getDoctors(langCode));
      }
    };
    fetchDoctors();
  }, [hasLinkedDoctors, linkedItems, langCode]);

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined 
    ? slice.primary.hideHeader 
    : true;

  return (
    <DoctorsClient 
      langCode={langCode} 
      customDoctors={doctors} 
      hideHeader={hideHeaderValue} 
    />
  );
}
