'use client';

import React from 'react';
import { PrismicRichText, JSXMapSerializer } from "@prismicio/react";

export interface PageBlockSlice {
  slice_type: "page_block";
  primary: {
    excerpt?: any;
    content?: any;
  };
}

type PageBlockProps = {
  slice: PageBlockSlice;
};

const contentSerializer: JSXMapSerializer = {
  paragraph: ({ node, children }: any) => {
    const text = node?.text || '';
    const trimmed = text.trim();
    if (
      trimmed.startsWith('-') || 
      trimmed.startsWith('•') || 
      trimmed.startsWith('*') || 
      /^\d+[\.\)]/.test(trimmed)
    ) {
      return <p className="mb-1.5 last:mb-0">{children}</p>;
    }
    return <p className="mb-4 last:mb-0">{children}</p>;
  },
  list: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>,
  oList: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>,
  listItem: ({ children }) => <li className="leading-relaxed">{children}</li>,
  heading1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-[#511B29] mt-8 mb-4">{children}</h1>,
  heading2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-[#511B29] mt-6 mb-3">{children}</h2>,
  heading3: ({ children }) => <h3 className="text-xl font-serif font-bold text-[#511B29] mt-5 mb-2">{children}</h3>,
  heading4: ({ children }) => <h4 className="text-lg font-serif font-bold text-[#511B29] mt-4 mb-2">{children}</h4>,
  heading5: ({ children }) => <h5 className="text-base font-serif font-bold text-[#511B29] mt-4 mb-2">{children}</h5>,
  heading6: ({ children }) => <h6 className="text-sm font-serif font-bold text-[#511B29] mt-4 mb-2">{children}</h6>,
};

export default function PageBlock({ slice }: PageBlockProps) {
  const { primary } = slice;
  
  // Safely check if rich text fields are populated
  const hasExcerpt = Array.isArray(primary.excerpt) && primary.excerpt.length > 0 && primary.excerpt.some((b: any) => b.text);
  const hasContent = Array.isArray(primary.content) && primary.content.length > 0 && primary.content.some((b: any) => b.text);

  return (
    <div className="space-y-6">
      {hasExcerpt && (
        <div className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">
          <PrismicRichText field={primary.excerpt} />
        </div>
      )}
      {hasContent && (
        <div className="text-base text-[#6a5b5e] leading-relaxed mt-6">
          <PrismicRichText field={primary.content} components={contentSerializer} />
        </div>
      )}
    </div>
  );
}
