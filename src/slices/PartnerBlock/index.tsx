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

export default function PartnerBlock({ slice }: PartnerBlockProps) {
  const { primary, items } = slice;
  const params = useParams();
  
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');

  const badgeText = primary.badge_text || (isEn ? 'Patient Safety and Technology' : 'Pacientu drošība un tehnoloģijas');
  const title = primary.title || (isEn ? 'Our Partners' : 'Mūsu partneri');
  const subtitle = primary.subtitle || (isEn 
    ? 'We partner with the world\'s leading Swiss, German, and Finnish medical brands to guarantee excellence in every smile.' 
    : 'Sadarbojamies ar pasaulē vadošajiem Šveices, Vācijas un Somijas medicīnas zīmoliem, lai garantētu izcilību katrā smaidā.');

  const validItems = items?.filter((item) => isFilled.image(item.logo)) || [];

  if (validItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FCFAF9] py-16 md:py-24 border-t border-[#efedec]/65">
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center"
        >
          {validItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUpVariants}
              className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-3 rounded-2xl aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group"
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.logo.url!}
                  alt={item.logo.alt || "Partner Logo"}
                  fill
                  className="object-contain transition-all duration-300"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
