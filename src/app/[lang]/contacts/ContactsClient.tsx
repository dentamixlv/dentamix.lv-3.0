'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, ArrowRight, AlertCircle, Map, Navigation } from 'lucide-react';
import { getClinics } from '../../../data';

interface ContactsClientProps {
  langCode: string;
}

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

export default function ContactsClient({ langCode }: ContactsClientProps) {
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
  };

  return (
    <div className="pt-8 pb-0 md:pt-12 md:pb-0 max-w-7xl mx-auto px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {labels.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
          {labels.defaultTitle}
        </h2>
        <p className="text-base text-[#6a5b5e] mt-2 font-medium">
          {labels.defaultSub}
        </p>
      </motion.div>

      {/* Clinics addresses and embedded maps grids */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {clinics.map((clinic) => (
          <motion.div 
            variants={fadeUpVariants}
            key={clinic.id} 
            className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
            id={`branch-block-${clinic.id}`}
          >
            {/* Upper Card Map visual block */}
            {clinic.gmapsEmbed ? (
              <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-[#efedec]">
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
            ) : (
              // Fallback placeholder block if no embed map is provided
              <div className="relative aspect-[4/3] w-full bg-[#fbf9f8] overflow-hidden border-b border-[#efedec] flex items-center justify-center">
                <MapPin className="w-10 h-10 text-[#de7c8a]/40" />
              </div>
            )}

            {/* Card content */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                {/* Upper tag detail */}
                <span className="text-[0.625rem] font-extrabold tracking-widest text-[#de7c8a] block mb-1.5 uppercase">
                  {clinic.id === 'riga' ? labels.centralBranch : labels.suburbBranch}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors mb-4">
                  {clinic.gmapsLink ? (
                    <a href={clinic.gmapsLink} target="_blank" rel="noopener noreferrer">
                      {clinic.name}
                    </a>
                  ) : (
                    clinic.name
                  )}
                </h3>

                {/* Info details in a single continuous vertical list */}
                <div className="space-y-4 my-6 text-sm text-[#6A5B5E]">
                  {/* Phone */}
                  {clinic.phone && (
                    <a 
                      href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 font-bold text-[#511B29] hover:text-[#5d1726]/80 transition-colors w-fit"
                    >
                      <Phone className="w-4 h-4 text-[#de7c8a] shrink-0" />
                      <span>{clinic.phone}</span>
                    </a>
                  )}

                  {/* Address */}
                  {clinic.address && (
                    <p className="flex items-start gap-2 text-[#6A5B5E] font-medium leading-relaxed">
                      <MapPin className="w-4 h-4 text-[#de7c8a] shrink-0 mt-0.5" />
                      {clinic.gmapsLink ? (
                        <a 
                          href={clinic.gmapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-[#5d1726] hover:underline transition-colors"
                        >
                          {clinic.address}
                        </a>
                      ) : (
                        <span>{clinic.address}</span>
                      )}
                    </p>
                  )}
                  
                  {/* Email */}
                  {clinic.email && (
                    <p className="flex items-center gap-2 font-medium">
                      <Mail className="w-4 h-4 text-[#de7c8a] shrink-0" />
                      <span className="truncate">{clinic.email}</span>
                    </p>
                  )}

                  {/* Karte */}
                  {clinic.gmapsLink && (
                    <p className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-[#de7c8a] shrink-0" />
                      <a 
                        href={clinic.gmapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#5d1726] hover:underline transition-colors font-medium"
                      >
                        {isEn ? 'Google Maps' : 'Karte'}
                      </a>
                    </p>
                  )}

                  {/* Waze */}
                  {clinic.waze && (
                    <p className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#de7c8a] shrink-0" />
                      <a 
                        href={clinic.waze} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#5d1726] hover:underline transition-colors font-medium"
                      >
                        Waze
                      </a>
                    </p>
                  )}

                  {/* Working hours as sub-list within the vertical list */}
                  {labels.workingHours && (
                    <div className="pt-4 border-t border-[#efedec]/60">
                      <p className="text-[#6A5B5E] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <Clock className="w-3.5 h-3.5 text-[#de7c8a]" />
                        {labels.workingHours}
                      </p>
                      <div className="space-y-2 pl-5 font-medium text-sm">
                        <p className="flex justify-between w-full">
                          <span>{labels.workingDays}</span>
                          <span className="text-right">{clinic.workHours.weekdays.split(': ')[1]}</span>
                        </p>
                        <p className="flex justify-between w-full">
                          <span>{labels.sat}</span>
                          {clinic.workHours.saturday.includes('Slēgts') || clinic.workHours.saturday.includes('Closed') ? (
                            <span className="text-red-500 text-right">{isEn ? 'Closed' : 'Slēgts'}</span>
                          ) : (
                            <span className="text-right">{clinic.workHours.saturday.split(': ')[1]}</span>
                          )}
                        </p>
                        <p className="flex justify-between w-full">
                          <span>{labels.sun}</span>
                          <span className="text-red-500 text-right">{isEn ? 'Closed' : 'Slēgts'}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Accessibility */}
                  {clinic.accessibilityAlert && (
                    <p className="flex items-start gap-2 pt-4 border-t border-[#efedec]/60 text-[#6A5B5E] font-medium leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{clinic.accessibilityAlert}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Google Maps Link Button */}
              {clinic.gmapsLink && (
                <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                  <a
                    href={clinic.gmapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                  >
                    <span>{isEn ? 'Open in Google Maps' : 'Skatīt Google Maps'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
