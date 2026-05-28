'use client';

import React from 'react';
import { motion } from 'motion/react';
import { SliceComponentProps } from '@prismicio/react';
import { Content } from '@prismicio/client';
import { useParams } from 'next/navigation';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
  }
} as const;

type PageTitleProps = SliceComponentProps<Content.PageTitleSlice>;

export default function PageTitle({ slice }: PageTitleProps) {
  const { primary } = slice;
  const params = useParams();
  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';

  const badgeText = primary.badge_text || (isEn ? 'DENTAMIC ADVANTAGES' : 'DENTAMIC PRIEKŠROCĪBAS');
  const title = primary.title || (isEn ? 'Page Title' : 'Lapas virsraksts');
  const subtitle = primary.subtitle || '';

  return (
    <div className="pt-16 pb-4 md:pt-24 md:pb-6 max-w-7xl mx-auto px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {badgeText}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}
