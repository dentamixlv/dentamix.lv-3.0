'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from '@prismicio/next';

import { getDoctors } from '../../data';
import { Doctor } from '../../types';
import { createClient } from '../../prismicio';
import DoctorProfilePage from '../../components/DoctorProfilePage';

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
} as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

type DoctorBlockProps = SliceComponentProps<Content.DoctorBlockSlice>;

export default function DoctorBlock({ slice }: DoctorBlockProps) {
  const params = useParams();
  const router = useRouter();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';
  const isEn = langCode === 'en-us';

  // If this is the detail variation, render DoctorProfilePage directly
  if (slice.variation === 'detail') {
    const doctorId = typeof params?.id === 'string' ? params.id : '';
    const fallbackDoc = getDoctors(langCode).find(d => d.id === doctorId);

    const name = slice.primary.name || fallbackDoc?.name || '';
    const category = slice.primary.category || fallbackDoc?.category || '';
    const role = slice.primary.role || fallbackDoc?.role || '';
    const description = slice.primary.description || fallbackDoc?.description || '';
    
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
      slices: embeddedSlices
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

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Primary content with fallbacks
  const badgeText = slice.primary.badge_text || (isEn ? 'Dentists' : 'Zobārsti');
  const subtitle = slice.primary.subtitle || '';
  const linkText = slice.primary.link_text || (isEn ? 'View All Specialists' : 'Skatīt visus speciālistus');

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
          // Query first 3 doctors
          const response = await client.getAllByType('doctor', { lang: langCode, limit: 3 });
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
          setDoctors(getDoctors(langCode).slice(0, 3));
        }
      } catch (e) {
        console.warn("Failed to fetch doctors in DoctorBlock, using fallbacks.", e);
        setDoctors(getDoctors(langCode).slice(0, 3));
      }
    };
    fetchDoctors();
  }, [hasLinkedDoctors, linkedItems, langCode]);

  const viewProfileLabel = isEn ? 'View Profile' : 'Skatīt profilu';
  const applyLabel = isEn ? 'Book' : 'Pieteikties';

  const sectionButton = isFilled.link(slice.primary.link_url) ? (
    <PrismicNextLink
      field={slice.primary.link_url}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-view-all-doctors-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </PrismicNextLink>
  ) : (
    <Link
      href={`${langPrefix}/doctors`}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-view-all-doctors-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );

  return (
    <section className="bg-gradient-to-b from-[#fbf9f8] to-white py-16 md:py-24 border-t border-[#efedec]/60">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {badgeText}
          </span>
          {isFilled.richText(slice.primary.title) ? (
            <div className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
              <PrismicRichText field={slice.primary.title} />
            </div>
          ) : (
            <h2 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
              {isEn ? 'Our Team' : 'Mūsu komanda'}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm md:text-base text-[#6a5b5e] mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Doctor cards list grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
        >
          {doctors.filter(d => d.id !== 'dr-janis-berzins').map((doc) => (
            <motion.div 
              variants={fadeUpVariants}
              key={doc.id} 
              className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
              id={`doctor-card-${doc.id}`}
            >
              {/* Upper Card image block */}
              <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
                <Image
                  src={doc.image}
                  alt={doc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                  className="object-cover hover-scale-103"
                />
              </div>

              {/* Card metadata and content */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                    {doc.category === 'SPECIĀLISTE' || doc.category === 'SPECIALIST' ? doc.role : doc.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                    {doc.name}
                  </h3>
                  <p className="text-base text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center justify-between">
                  <Link
                    href={`${langPrefix}/doctors/${doc.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                    id={`learn-profile-btn-${doc.id}`}
                  >
                    {viewProfileLabel}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={`${langPrefix}/contacts`}
                    className="px-4 py-2 text-sm font-bold text-[#511B29] bg-[#f2dde1]/50 hover:bg-[#f2dde1] rounded-full transition-colors cursor-pointer"
                  >
                    {applyLabel}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all doctors link */}
        <div className="text-center mt-12">
          {sectionButton}
        </div>

      </div>
    </section>
  );
}
