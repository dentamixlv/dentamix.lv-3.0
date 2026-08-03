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
  const targetBlank = (primary as any).target_blank === true;

  const whatsappButtonText = primary.whatsapp_button_text || 'WhatsApp';
  const whatsappPhone = primary.whatsapp_phone;
  const hasWhatsapp = !!whatsappPhone;

  const btnClass = `px-8 py-4 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#511B29]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group shrink-0 ${
    hasWhatsapp ? 'w-full sm:w-auto' : ''
  }`;

  const customButton = isFilled.link(primary.button_link) ? (
    <PrismicNextLink
      field={primary.button_link}
      className={btnClass}
      id="cta-block-btn"
      {...(targetBlank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {buttonText}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </PrismicNextLink>
  ) : (
    <Link
      href={isEn ? '/en/contacts' : '/kontakti'}
      className={btnClass}
      id="cta-block-btn"
      {...(targetBlank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {buttonText}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );

  const whatsappButton = whatsappPhone ? (
    <a
      href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full sm:w-auto px-8 py-4 bg-[#25d366] hover:bg-[#20ba5a] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#25d366]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group shrink-0 relative z-10"
      id="cta-block-whatsapp-btn"
    >
      <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span>{whatsappButtonText}</span>
    </a>
  ) : null;

  const renderedButtons = whatsappButton ? (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end relative z-10">
      {customButton}
      {whatsappButton}
    </div>
  ) : (
    customButton
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
          customButton={renderedButtons}
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
          customButton={renderedButtons}
          style={style}
        />
      </div>
    </section>
  );
}