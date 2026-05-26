'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { useParams } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { PrismicNextLink } from '@prismicio/next';
import Link from 'next/link';

/**
 * Rich text serializer for title and description
 */
const richTextComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
      {children}
    </h3>
  ),
  heading2: ({ children }) => (
    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
      {children}
    </h3>
  ),
  heading3: ({ children }) => (
    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
      {children}
    </h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
      {children}
    </h4>
  ),
  heading5: ({ children }) => (
    <h5 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
      {children}
    </h5>
  ),
  heading6: ({ children }) => (
    <h6 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
      {children}
    </h6>
  ),
  paragraph: ({ children }) => (
    <p className="text-xs text-[#6a5b5e] leading-relaxed">
      {children}
    </p>
  ),
  preformatted: ({ children }) => (
    <p className="text-xs text-[#6a5b5e] leading-relaxed">
      {children}
    </p>
  ),
};

/**
 * Animation variants matching Hero slice
 */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45,
    },
  },
} as const;

type CTABlockProps = SliceComponentProps<Content.CtaBlockSlice>;

export default function CTABlock({ slice }: CTABlockProps) {
  const { primary } = slice;
  const params = useParams();

  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';
  const langPrefix = isEn ? `/${langList[0]}` : '';

  const badgeText = primary.badge_text || (isEn ? 'Share Your Experience' : 'Dalieties pieredzē');
  const buttonText = primary.button_text || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className="max-w-7xl mx-auto px-6 py-16 md:py-24"
    >
      <div className="bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 border border-[#efedec] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          {/* Badge text */}
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] block">
            {badgeText}
          </span>

          {/* Title */}
          <PrismicRichText field={primary.title} components={richTextComponents} />

          {/* Description */}
          <PrismicRichText field={primary.description} components={richTextComponents} />
        </div>

        {/* Button */}
        {isFilled.link(primary.button_link) ? (
          <PrismicNextLink
            field={primary.button_link}
            className="btn inline-flex items-center gap-2 bg-[#400112] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#400112]/15 shrink-0"
            id="cta-block-btn"
          >
            <CalendarDays className="w-4 h-4" />
            {buttonText}
          </PrismicNextLink>
        ) : (
          <Link
            href={isEn ? '/en/contacts' : '/kontakti'}
            className="btn inline-flex items-center gap-2 bg-[#400112] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#400112]/15 shrink-0"
            id="cta-block-btn"
          >
            <CalendarDays className="w-4 h-4" />
            {buttonText}
          </Link>
        )}
      </div>
    </motion.div>
  );
}