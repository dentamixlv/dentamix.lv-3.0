'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { PrismicNextLink } from '@prismicio/next';

/**
 * Variants for motion animations (identical to App.tsx).
 */
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
} as const;

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

/**
 * Rich text serializer: maps heading1 → h1 with Hero styling,
 * paragraph → p with Hero styling.
 */
const richTextComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#400112] tracking-tight leading-tight max-w-3xl">
      {children}
    </h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#400112] tracking-tight leading-tight max-w-3xl">
      {children}
    </h2>
  ),
  paragraph: ({ children }) => (
    <p className="text-[#1b1c1b] text-base md:text-lg font-normal mt-6 max-w-2xl leading-relaxed">
      {children}
    </p>
  ),
};

type HeroProps = SliceComponentProps<Content.HeroSlice>;

export default function Hero({ slice }: HeroProps) {
  const { primary } = slice;
  const params = useParams();

  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';
  const langPrefix = isEn ? `/${langList[0]}` : '';

  const premiumTag = primary.premium_tag || (isEn ? 'Premium Care' : 'Premium Care');
  const ctaText = primary.cta_text || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei');
  const secondaryCtaText = primary.secondary_cta_text || (isEn ? 'Our Services' : 'Mūsu pakalpojumi');

  // Background image from CMS or fallback
  const bgImage =
    primary.background_image?.url ||
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1400';

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-tr from-[#fbf9f8] via-[#fbf9f8] to-[#f2dde1]/20 pb-16 pt-8 md:py-24">
      {/* Backdrop Wave Image Decoration */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700">
        <img
          src={bgImage}
          alt="Dentamic Background"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center"
      >
        {/* Premium Care tag */}
        <motion.div
          variants={fadeUpVariants}
          className="mb-4 inline-block"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100/90 border border-gray-200/80 text-[9px] font-extrabold uppercase tracking-widest text-gray-600">
            {premiumTag}
          </span>
        </motion.div>

        <motion.div variants={fadeUpVariants}>
          <PrismicRichText field={primary.title} components={richTextComponents} />
        </motion.div>

        <motion.div variants={fadeUpVariants}>
          <PrismicRichText field={primary.subtitle} components={richTextComponents} />
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto justify-center"
        >
          {isFilled.link(primary.cta_link) ? (
            <PrismicNextLink
              field={primary.cta_link}
              className="px-8 py-4 bg-[#400112] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#400112]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group"
              id="hero-primary-btn"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </PrismicNextLink>
          ) : (
            <Link
              href={isEn ? '/en/contacts' : '/contacts'}
              className="px-8 py-4 bg-[#400112] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#400112]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group"
              id="hero-primary-btn"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          <Link
            href={isEn ? '/en/services' : '/pakalpojumi'}
            className="px-8 py-4 bg-white border border-[#d9c1c2] hover:border-[#400112] text-[#400112] hover:bg-[#fbf9f8] rounded-full text-base font-semibold transition-all text-center cursor-pointer inline-block shadow-sm"
            id="hero-secondary-btn"
          >
            {secondaryCtaText}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}