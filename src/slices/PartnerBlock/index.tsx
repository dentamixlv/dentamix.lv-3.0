'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { useParams } from 'next/navigation';
import Image from 'next/image';

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

type PartnerBlockProps = SliceComponentProps<Content.PartnerBlockSlice>;

function getSvgFallback(idx: number) {
  switch (idx) {
    case 0:
      return (
        <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
          <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 14v12M14 20h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <text x="40" y="26" fontSize="16" fontWeight="900" letterSpacing="0.03em" className="font-sans">straumann</text>
        </svg>
      );
    case 1:
      return (
        <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
          <path d="M10 26 L18 14 L23 22 L28 16 L34 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="14" r="2" />
          <circle cx="28" cy="16" r="2" />
          <text x="44" y="26" fontSize="16" fontWeight="800" letterSpacing="0.08em" className="font-serif">PLANMECA</text>
        </svg>
      );
    case 2:
      return (
        <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
          <circle cx="15" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <circle cx="24" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 1.5" />
          <text x="42" y="26" fontSize="18" fontWeight="700" letterSpacing="0.01em" className="font-sans">ivoclar</text>
        </svg>
      );
    case 3:
      return (
        <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
          <path d="M10 20 l4 -7 h8 l4 7 l-4 7 h-8 z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 13 l4 7 l-4 7" fill="none" stroke="currentColor" strokeWidth="1" />
          <text x="36" y="26" fontSize="17" fontWeight="700" letterSpacing="-0.01em" className="font-serif italic font-bold">Geistlich</text>
        </svg>
      );
    case 4:
      return (
        <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
          <circle cx="15" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="20" r="4.5" fill="currentColor" opacity="0.4" />
          <circle cx="15" cy="14" r="1.5" fill="currentColor" />
          <circle cx="15" cy="26" r="1.5" fill="currentColor" />
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
          <circle cx="21" cy="20" r="1.5" fill="currentColor" />
          <text x="34" y="25" fontSize="15" fontWeight="900" letterSpacing="0.12em" className="font-sans">CURAPROX</text>
        </svg>
      );
    case 5:
      return (
        <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
          <rect x="6" y="10" width="22" height="18" rx="2" fill="currentColor" opacity="0.15" />
          <text x="10" y="23" fontSize="11" fontWeight="900" className="font-sans">3M</text>
          <text x="35" y="26" fontSize="16" fontWeight="800" letterSpacing="0.08em" className="font-serif">ESPE</text>
        </svg>
      );
    default:
      return null;
  }
}

export default function PartnerBlock({ slice }: PartnerBlockProps) {
  const { primary, items } = slice;
  const params = useParams();
  
  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';

  const badgeText = primary.badge_text || (isEn ? 'Patient Safety and Technology' : 'Pacientu drošība un tehnoloģijas');
  const title = primary.title || (isEn ? 'Our Partners' : 'Mūsu partneri');
  const subtitle = primary.subtitle || (isEn 
    ? 'We partner with the world\'s leading Swiss, German, and Finnish medical brands to guarantee excellence in every smile.' 
    : 'Sadarbojamies ar pasaulē vadošajiem Šveices, Vācijas un Somijas medicīnas zīmoliem, lai garantētu izcilību katrā smaidā.');

  return (
    <section className="bg-white py-16 border-t border-[#efedec]/65">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {badgeText}
          </span>
          <h3 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
            {title}
          </h3>
          <p className="text-sm md:text-base text-[#6a5b5e] mt-2 font-medium">
            {subtitle}
          </p>
        </motion.div>

        {items && items.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center"
          >
            {items.map((item, idx) => {
              const hasLogo = isFilled.image(item.logo);
              const fallbackSvg = getSvgFallback(idx);
              return (
                <motion.div
                  key={idx}
                  variants={fadeUpVariants}
                  className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group"
                >
                  {hasLogo ? (
                    <div className="relative w-[70%] aspect-square mx-auto">
                      <Image
                        src={item.logo.url!}
                        alt={item.logo.alt || "Partner Logo"}
                        fill
                        className="object-contain transition-all duration-300"
                        sizes="(max-width: 768px) 50vw, 15vw"
                      />
                    </div>
                  ) : fallbackSvg ? (
                    fallbackSvg
                  ) : (
                    <span className="h-8 flex items-center justify-center text-[#511B29] font-bold text-sm tracking-wide">
                      Partner {idx + 1}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
