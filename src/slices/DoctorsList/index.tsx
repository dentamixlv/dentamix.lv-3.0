'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { getDoctors } from '../../data';
import { Doctor } from '../../types';
import { createClient } from '../../prismicio';
import DoctorDetailModal from '../../components/DoctorDetailModal';

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
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

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

type DoctorsListProps = SliceComponentProps<Content.DoctorsListSlice>;

export default function DoctorsList({ slice }: DoctorsListProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [detailDoc, setDetailDoc] = useState<Doctor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isEn = langCode === 'en-us';

  const defaultTitle = isEn ? 'Our Team' : 'Mūsu komanda';
  const defaultSub = isEn 
    ? 'Professional specialists combining clinical precision with personalized, compassionate care.'
    : 'Profesionāli speciālisti, kas apvieno klīnisko precizitāti un personalizētu, iejūtīgu aprūpi.';

  const viewProfileLabel = isEn ? 'View Profile' : 'Skatīt profilu';
  const applyLabel = isEn ? 'Book' : 'Pieteikties';
  const wantBookTitleLabel = isEn ? 'Would you like to book a visit?' : 'Vēlaties pieteikties vizītei?';
  const wantBookSubLabel = isEn 
    ? 'Our specialists are ready to take care of your smile. Contact us to schedule a consultation.'
    : 'Mūsu speciālisti ir gatavi parūpēties par Jūsu smaidu. Sazinieties ar mums, lai ieplānotu konsultāciju.';
  const bookVisitLabel = isEn ? 'Request Appointment' : 'Pieteikties vizītei';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const client = createClient();
        const docs = await client.getAllByType('doctor', { lang: langCode });
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
        setDoctors(getDoctors(langCode));
      }
    };
    fetchDoctors();
  }, [langCode]);

  const handleOpenDoctorDetail = (doc: Doctor) => {
    setDetailDoc(doc);
    setIsDetailOpen(true);
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      {/* Title and subtitle header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {isEn ? 'Dentists' : 'Zobārsti'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
          {(slice.primary.title as any)?.[0]?.text || defaultTitle}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {slice.primary.subtitle || defaultSub}
        </p>
      </motion.div>

      {/* Doctor cards list grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
      >
        {doctors.filter(d => d.id !== 'dr-janis-berzins').map((doc) => (
          <motion.div 
            variants={fadeUpVariants}
            key={doc.id} 
            className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            id={`doctor-card-${doc.id}`}
          >
            {/* Upper Card image block */}
            <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card metadata and content */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                  {doc.category === 'SPECIĀLISTE' || doc.category === 'SPECIALIST' ? doc.role : doc.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#400112] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                  {doc.name}
                </h3>
                <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                  {doc.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center justify-between">
                <button
                  onClick={() => handleOpenDoctorDetail(doc)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#400112] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                  id={`learn-profile-btn-${doc.id}`}
                >
                  {viewProfileLabel}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  href={`${langPrefix}/contacts`}
                  className="px-4 py-2 text-xs font-bold text-[#400112] bg-[#f2dde1]/50 hover:bg-[#f2dde1] rounded-full transition-colors cursor-pointer"
                >
                  {applyLabel}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Consultation Invite Banner bottom */}
      <section className="mt-20 md:mt-28 bg-white border-y border-[#efedec] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleInVariants}
            className="bg-[#f2dde1]/15 border border-[#d9c1c2]/50 p-8 md:p-14 rounded-3xl space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#400112]">
              {wantBookTitleLabel}
            </h3>
            <p className="text-sm text-[#6a5b5e] max-w-xl mx-auto font-medium leading-relaxed">
              {wantBookSubLabel}
            </p>
            <Link
              href={`${langPrefix}/contacts`}
              className="inline-block px-10 py-4 bg-[#400112] hover:bg-[#5d1726] text-white font-bold rounded-full text-sm tracking-uppercase active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#400112]/20 uppercase"
              id="team-bottom-cta-btn"
            >
              {bookVisitLabel}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Doctor Bio modal */}
      <DoctorDetailModal 
        doctor={detailDoc} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onBookWithDoctor={() => {}}
      />
    </div>
  );
}
