'use client';

import React from 'react';
import { PrismicRichText } from "@prismicio/react";

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
        <div className="text-base text-[#6a5b5e] leading-relaxed space-y-6 mt-6">
          <PrismicRichText field={primary.content} />
        </div>
      )}
    </div>
  );
}
