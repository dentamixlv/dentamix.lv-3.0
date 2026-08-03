'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getDoctors } from '../../../data';

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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.55
    }
  }
} as const;

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const translations = {
  lv: {
    tag: 'Zobārsti',
    title: 'Mūsu komanda',
    sub: 'Profesionāli speciālisti, kas apvieno klīnisko precizitāti un personalizētu, iejūtīgu aprūpi.',
    viewProfile: 'Skatīt profilu',
    apply: 'Pieteikties',
    wantBookTitle: 'Vēlaties pieteikties vizītei?',
    wantBookSub: 'Mūsu speciālisti ir gatavi parūpēties par Jūsu smaidu. Sazinieties ar mums, lai ieplānotu konsultāciju.',
    bookVisit: 'Pieteikties vizītei'
  },
  en: {
    tag: 'Dentists',
    title: 'Our Team',
    sub: 'Professional specialists combining clinical precision with personalized, compassionate care.',
    viewProfile: 'View Profile',
    apply: 'Book',
    wantBookTitle: 'Would you like to book a visit?',
    wantBookSub: 'Our specialists are ready to take care of your smile. Contact us to schedule a consultation.',
    bookVisit: 'Request Appointment'
  }
};

import { Doctor } from '../../../types';

interface DoctorsClientProps {
  langCode: string;
  customDoctors?: Doctor[] | null;
  hideHeader?: boolean;
}

export default function DoctorsClient({ langCode, customDoctors, hideHeader = false }: DoctorsClientProps) {
  const t = langCode === 'en-us' ? translations.en : translations.lv;
  const isEn = langCode === 'en-us';
  const langPrefix = langCode === 'en-us' ? '/en' : '';
  const doctors = customDoctors || getDoctors(langCode);


  return (
    <div className={`${hideHeader ? 'pt-2 pb-0 md:pt-4 md:pb-0' : 'py-16 md:py-24'} max-w-7xl mx-auto px-6`}>
      {/* Title and subtitle header */}
      {!hideHeader && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-[#6a5b5e] mt-2 font-medium">
            {t.sub}
          </p>
        </motion.div>
      )}

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
            <Link href={`${langPrefix}/doctors/${doc.id}`} className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec] block">
              <Image
                src={doc.image}
                alt={doc.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                className="object-cover hover-scale-103"
              />
            </Link>

            {/* Card metadata and content */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                  {doc.category === 'SPECIĀLISTE' ? doc.role : doc.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                  <Link href={`${langPrefix}/doctors/${doc.id}`}>
                    {doc.name}
                  </Link>
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
                  {t.viewProfile}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`${langPrefix}/contacts`}
                  className="px-4 py-2 text-sm font-bold text-[#511B29] bg-[#f2dde1]/50 hover:bg-[#f2dde1] rounded-full transition-colors cursor-pointer"
                >
                  {t.apply}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Consultation Invite Banner bottom */}
      {!hideHeader && (
        <section className="mt-20 md:mt-28 bg-white border-y border-[#efedec] py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleInVariants}
              className="bg-[#f2dde1]/15 border border-[#d9c1c2]/50 p-8 md:p-14 rounded-3xl space-y-6"
            >
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#511B29]">
                {t.wantBookTitle}
              </h3>
              <p className="text-sm text-[#6a5b5e] max-w-xl mx-auto font-medium leading-relaxed">
                {t.wantBookSub}
              </p>
              <Link
                href={`${langPrefix}/contacts`}
                className="inline-block px-10 py-4 bg-[#511B29] hover:bg-[#5d1726] text-white font-bold rounded-full text-sm tracking-uppercase active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#511B29]/20 uppercase"
                id="team-bottom-cta-btn"
              >
                {t.bookVisit}
              </Link>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
}
