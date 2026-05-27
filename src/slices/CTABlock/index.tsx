'use client';

import React from 'react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { useParams } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { PrismicNextLink } from '@prismicio/next';
import Link from 'next/link';
import ReusableCTABlock from '../../components/CTABlock';

/**
 * Rich text serializer for title and description
 */
const richTextComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h3>
  ),
  heading2: ({ children }) => (
    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h3>
  ),
  heading3: ({ children }) => (
    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h4>
  ),
  heading5: ({ children }) => (
    <h5 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h5>
  ),
  heading6: ({ children }) => (
    <h6 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
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
type CTABlockProps = SliceComponentProps<Content.CtaBlockSlice>;

export default function CTABlock({ slice }: CTABlockProps) {
  const { primary } = slice;
  const params = useParams();

  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';

  const badgeText = primary.badge_text || (isEn ? 'Share Your Experience' : 'Dalieties pieredzē');
  const buttonText = primary.button_text || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei');

  const customButton = isFilled.link(primary.button_link) ? (
    <PrismicNextLink
      field={primary.button_link}
      className="btn inline-flex items-center gap-2 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#511B29]/15 shrink-0"
      id="cta-block-btn"
    >
      <CalendarDays className="w-4 h-4" />
      {buttonText}
    </PrismicNextLink>
  ) : (
    <Link
      href={isEn ? '/en/contacts' : '/kontakti'}
      className="btn inline-flex items-center gap-2 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#511B29]/15 shrink-0"
      id="cta-block-btn"
    >
      <CalendarDays className="w-4 h-4" />
      {buttonText}
    </Link>
  );

  const style = isFilled.color(primary.background_color) ? {
    backgroundColor: primary.background_color,
  } : undefined;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <ReusableCTABlock
        badgeText={badgeText}
        title={<PrismicRichText field={primary.title} components={richTextComponents} />}
        description={<PrismicRichText field={primary.description} components={richTextComponents} />}
        customButton={customButton}
        style={style}
      />
    </div>
  );
}