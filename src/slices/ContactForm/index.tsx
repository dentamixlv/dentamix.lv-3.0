'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { getClinics } from '../../data';

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

type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

export default function ContactForm({ slice }: ContactFormProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';

  const isEn = langCode === 'en-us';
  const clinics = getClinics(langCode);

  const labels = {
    tag: isEn ? 'Contacts' : 'Kontakti',
    defaultTitle: isEn ? 'Our Clinics & Contacts' : 'Mūsu klīnikas un kontakti',
    defaultSub: isEn ? 'We will be glad to see you and provide the best dental assistance.' : 'Būsim priecīgi Jūs redzēt un sniegt labāko palīdzību.',
    centralBranch: isEn ? 'Central Branch' : 'Centrālā filiāle',
    suburbBranch: isEn ? 'Suburb Branch' : 'Pierīgas filiāle',
    workingHours: isEn ? 'Working Hours' : 'Darba laiks',
    workingDays: isEn ? 'Weekdays:' : 'Darba dienās:',
    sat: isEn ? 'Saturday:' : 'Sestdien:',
    sun: isEn ? 'Sunday:' : 'Svētdien:',
    applyToClinic: isEn ? 'Book at this branch' : 'Pieteikties šajā klīnikā'
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {labels.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
          {(slice.primary.title as any)?.[0]?.text || labels.defaultTitle}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {slice.primary.subtitle || labels.defaultSub}
        </p>
      </motion.div>

      {/* Clinics addresses and embedded maps grids */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
      >
        {clinics.map((clinic) => (
          <motion.div 
            variants={fadeUpVariants}
            key={clinic.id} 
            className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden"
            id={`branch-block-${clinic.id}`}
          >
            <div>
              {/* Upper tag detail */}
              <span className="text-[10px] font-extrabold tracking-widest text-[#de7c8a] block mb-1.5 uppercase">
                {clinic.id === 'riga' ? labels.centralBranch : labels.suburbBranch}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#511B29] mb-4">
                {clinic.name}
              </h3>

              {/* Info details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs text-[#6a5b5e]">
                <div className="space-y-3">
                  <p className="flex items-start gap-2 text-[#1b1c1b] font-medium leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#de7c8a] shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono font-bold text-[#511B29] hover:text-[#5d1726]/80 transition-colors">
                    <Phone className="w-4 h-4 text-[#de7c8a] shrink-0" />
                    <span>{clinic.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-[#de7c8a] shrink-0" />
                    <span className="truncate">{clinic.email}</span>
                  </p>
                </div>

                <div className="bg-[#fbf9f8] p-4 rounded-xl border border-[#efedec] text-[11px]">
                  <p className="text-[#511B29] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#de7c8a]" />
                    {labels.workingHours}
                  </p>
                  <div className="space-y-1 font-semibold">
                    <p className="flex justify-between">
                      <span>{labels.workingDays}</span>
                      <span className="font-mono">{clinic.workHours.weekdays.split(': ')[1]}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>{labels.sat}</span>
                      {clinic.workHours.saturday.includes('Slēgts') || clinic.workHours.saturday.includes('Closed') ? (
                        <span className="text-red-500">{isEn ? 'Closed' : 'Slēgts'}</span>
                      ) : (
                        <span className="font-mono">{clinic.workHours.saturday.split(': ')[1]}</span>
                      )}
                    </p>
                    <p className="flex justify-between">
                      <span>{labels.sun}</span>
                      <span className="text-red-500">{isEn ? 'Closed' : 'Slēgts'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map iframe element if present */}
            {clinic.gmapsEmbed && (
              <div className="w-full h-60 rounded-2xl overflow-hidden border border-[#efedec] bg-slate-50 relative mt-4 shadow-sm">
                <iframe
                  src={clinic.gmapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title={clinic.name}
                  className="grayscale-[20%] opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            )}

          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
