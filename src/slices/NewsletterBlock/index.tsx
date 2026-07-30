'use client';

import React from 'react';
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from '@prismicio/react';
import { useParams } from 'next/navigation';
import NewsletterForm from '../../components/NewsletterForm';

const richTextComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h4>
  ),
  heading2: ({ children }) => (
    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h4>
  ),
  heading3: ({ children }) => (
    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h4>
  ),
  heading4: ({ children }) => (
    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
      {children}
    </h4>
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

export interface NewsletterBlockSliceDefault {
  slice_type: "newsletter_block";
  variation: "default";
  primary: {
    badge_text?: string | null;
    title?: any;
    description?: any;
  };
}

export interface NewsletterBlockSliceSidebar {
  slice_type: "newsletter_block";
  variation: "sidebar";
  primary: {
    title?: string | null;
    description?: string | null;
  };
}

export type NewsletterBlockSlice = NewsletterBlockSliceDefault | NewsletterBlockSliceSidebar;

type NewsletterBlockProps = {
  slice: NewsletterBlockSlice;
  context?: any;
};

export default function NewsletterBlock({ slice, context }: NewsletterBlockProps) {
  const { primary, variation } = slice;
  const isEmbedded = context?.isEmbedded === true;

  // Determine if it should render as a sidebar widget
  if (variation === 'sidebar' || isEmbedded) {
    let customTitle: string | undefined = undefined;
    let customDesc: string | undefined = undefined;

    if (variation === 'sidebar') {
      const sidebarPrimary = primary as NewsletterBlockSliceSidebar['primary'];
      customTitle = sidebarPrimary.title || undefined;
      customDesc = sidebarPrimary.description || undefined;
    } else {
      // If default variation is forced embedded, try to extract plain text
      const defaultPrimary = primary as NewsletterBlockSliceDefault['primary'];
      if (Array.isArray(defaultPrimary.title) && defaultPrimary.title.length > 0) {
        customTitle = defaultPrimary.title[0].text;
      }
      if (Array.isArray(defaultPrimary.description) && defaultPrimary.description.length > 0) {
        customDesc = defaultPrimary.description[0].text;
      }
    }

    return (
      <NewsletterForm
        variant="widget"
        title={customTitle}
        description={customDesc}
      />
    );
  }

  // Render as a full-width page block
  const defaultPrimary = primary as NewsletterBlockSliceDefault['primary'];
  
  const customBadge = defaultPrimary.badge_text || undefined;
  
  const customTitle = defaultPrimary.title && defaultPrimary.title.length > 0 ? (
    <PrismicRichText field={defaultPrimary.title} components={richTextComponents} />
  ) : undefined;
  
  const customDesc = defaultPrimary.description && defaultPrimary.description.length > 0 ? (
    <PrismicRichText field={defaultPrimary.description} components={richTextComponents} />
  ) : undefined;

  return (
    <section className="w-full bg-white border-y border-[#efedec] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <NewsletterForm
          variant="page"
          badge={customBadge}
          title={customTitle}
          description={customDesc}
        />
      </div>
    </section>
  );
}
