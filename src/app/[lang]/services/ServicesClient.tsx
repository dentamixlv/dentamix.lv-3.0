'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { getServices } from '../../../data';

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
      type: 'tween',
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const translations = {
  lv: {
    tag: 'Pakalpojumi',
    title: 'Augstākās klases zobārstniecība',
    sub: 'Pilns mūsdienīgu pakalpojumu spektrs – no estētikas līdz implantācijai un sarežģītai ķirurģijai.',
    premium: 'PREMIUM PAKALPOJUMS',
    viewDesc: 'Skatīt aprakstu',
    apply: 'Pieteikties'
  },
  en: {
    tag: 'Services',
    title: 'World-Class Dentistry',
    sub: 'A complete spectrum of modern dental services – from aesthetics to implants and complex surgery.',
    premium: 'PREMIUM SERVICE',
    viewDesc: 'View Description',
    apply: 'Inquire Now'
  }
};

interface ServicesClientProps {
  langCode: string;
}

export default function ServicesClient({ langCode }: ServicesClientProps) {
  const t = langCode === 'en-us' ? translations.en : translations.lv;
  const isEn = langCode === 'en-us';
  const langPrefix = isEn ? '/en' : '';
  const services = getServices(langCode);

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {t.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
          {t.title}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {t.sub}
        </p>
      </motion.div>

      {/* Services cards list grid matching dentists style */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
      >
        {services.map((serv) => (
          <motion.div 
            variants={fadeUpVariants}
            key={serv.id} 
            className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            id={`service-card-${serv.id}`}
          >
            {/* Upper Card image block */}
            <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
              <Image
                src={serv.image}
                alt={serv.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>

            {/* Card metadata and content */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                  {t.premium}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                  {serv.title}
                </h3>
                <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                  {serv.description}
                </p>
              </div>

              {/* Bottom actions */}
              <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                <Link
                  href={`${langPrefix}/services/${serv.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                  id={`learn-service-btn-${serv.id}`}
                >
                  {t.viewDesc}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
