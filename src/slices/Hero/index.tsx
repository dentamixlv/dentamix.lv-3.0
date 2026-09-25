'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';
import { PrismicNextLink } from '@prismicio/next';
import Badge from '../../components/Badge';

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
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#511B29] tracking-tight leading-tight max-w-3xl">
      {children}
    </h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#511B29] tracking-tight leading-tight max-w-3xl">
      {children}
    </h2>
  ),
  paragraph: ({ children }) => (
    <p className="text-[#6A5B5E] text-base font-normal mt-6 max-w-2xl leading-relaxed">
      {children}
    </p>
  ),
};

type HeroProps = SliceComponentProps<Content.HeroSlice>;

export default function Hero({ slice }: HeroProps) {
  const { primary } = slice;
  const params = useParams();

  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langPrefix = isEn ? '/en' : '';

  const premiumTag = primary.premium_tag || (isEn ? 'Premium Care' : 'Premium Care');
  const ctaText = primary.cta_text || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei');
  const secondaryCtaText = primary.secondary_cta_text || (isEn ? 'Our Services' : 'Mūsu pakalpojumi');

  // Rating number and stars text from Prismic or defaults
  const rawRating = primary.rating_number ?? (primary as any).rating;
  const ratingNumber = (rawRating !== undefined && rawRating !== null && rawRating !== '')
    ? (typeof rawRating === 'number' && Number.isInteger(rawRating) ? rawRating.toFixed(1) : String(rawRating))
    : '5.0';
  const ratingText = primary.rating_text || (primary as any).reviews_text || (isEn ? 'Google reviews' : 'Google atsauksmes');

  // Background image from CMS or fallback
  const bgImage =
    primary.background_image?.url ||
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1400';

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-tr from-[#fbf9f8] via-[#fbf9f8] to-[#f2dde1]/20 pb-16 pt-8 md:py-24">
      {/* Backdrop Wave Image Decoration */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700">
        <Image
          src={bgImage}
          alt={primary.background_image?.alt || "Dentamix Background"}
          fill
          sizes="100vw"
          className="object-cover object-center scale-105"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-white/65" />
      </div>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center"
      >
        {/* Premium Care badge */}
        <Badge
          text={premiumTag}
          variant="default"
          animated
          variants={fadeUpVariants}
          className="mb-3 block"
          textSize="text-[0.625rem]"
          fontWeight="font-extrabold"
          plain={true}
        />

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
              className="px-8 py-4 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#511B29]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group"
              id="hero-primary-btn"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </PrismicNextLink>
          ) : (
            <Link
              href={isEn ? '/en/contacts' : '/kontakti'}
              className="px-8 py-4 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#511B29]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group"
              id="hero-primary-btn"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {isFilled.link(primary.secondary_cta_link) ? (
            <PrismicNextLink
              field={primary.secondary_cta_link}
              className="px-8 py-4 bg-transparent border border-[#511B29]/30 text-[#511B29] hover:bg-[#511B29]/5 hover:border-[#511B29]/60 rounded-full text-base font-semibold transition-all text-center cursor-pointer inline-block"
              id="hero-secondary-btn"
            >
              {secondaryCtaText}
            </PrismicNextLink>
          ) : (
            <Link
              href={isEn ? '/en/services' : '/pakalpojumi'}
              className="px-8 py-4 bg-transparent border border-[#511B29]/30 text-[#511B29] hover:bg-[#511B29]/5 hover:border-[#511B29]/60 rounded-full text-base font-semibold transition-all text-center cursor-pointer inline-block"
              id="hero-secondary-btn"
            >
              {secondaryCtaText}
            </Link>
          )}
        </motion.div>

        {/* Google Reviews rating number and stars text line */}
        {(ratingNumber || ratingText) && (
          <motion.div
            variants={fadeUpVariants}
            className="mt-10 inline-flex items-center gap-2.5 sm:gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#efedec] shadow-xs text-left"
            id="hero-google-reviews"
          >
            {/* Google "G" icon */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-xs shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 text-[#FBBC04]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC04] stroke-[#FBBC04]" />
              ))}
            </div>

            {/* Rating number & stars text line */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              {ratingNumber && (
                <span className="font-bold text-[#511B29] tracking-tight">{ratingNumber}</span>
              )}
              {ratingText && (
                <span className="text-[#6A5B5E] font-medium">{ratingText}</span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}