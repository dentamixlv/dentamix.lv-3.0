'use client';

import React from 'react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
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
    <p className="text-base text-[#6a5b5e] leading-relaxed">
      {children}
    </p>
  ),
  preformatted: ({ children }) => (
    <p className="text-base text-[#6a5b5e] leading-relaxed">
      {children}
    </p>
  ),
};

/**
 * Animation variants matching Hero slice
 */
type CTABlockProps = SliceComponentProps<Content.CtaBlockSlice>;

export default function CTABlock({ slice, context }: CTABlockProps) {
  const { primary } = slice;
  const params = useParams();

  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');

  const badgeText = primary.badge_text || (isEn ? 'Share Your Experience' : 'Dalieties pieredzē');
  const buttonText = primary.button_text || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei');

  const customButton = isFilled.link(primary.button_link) ? (
    <PrismicNextLink
      field={primary.button_link}
      className="px-8 py-4 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#511B29]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group shrink-0"
      id="cta-block-btn"
    >
      {buttonText}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </PrismicNextLink>
  ) : (
    <Link
      href={isEn ? '/en/contacts' : '/kontakti'}
      className="px-8 py-4 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#511B29]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group shrink-0"
      id="cta-block-btn"
    >
      {buttonText}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );

  const style = isFilled.color(primary.background_color) ? {
    backgroundColor: primary.background_color,
  } : undefined;

  const isEmbedded = (context as any)?.isEmbedded === true;
  const isBottom = (context as any)?.isBottom === true;

  if (isEmbedded) {
    return (
      <div className="mt-8">
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

  const paddingClass = "py-16 md:py-24";

  return (
    <section className="w-full bg-white border-y border-[#efedec]">
      <div className={`max-w-7xl mx-auto px-6 ${paddingClass}`}>
        <ReusableCTABlock
          badgeText={badgeText}
          title={<PrismicRichText field={primary.title} components={richTextComponents} />}
          description={<PrismicRichText field={primary.description} components={richTextComponents} />}
          customButton={customButton}
          style={style}
        />
      </div>
    </section>
  );
}