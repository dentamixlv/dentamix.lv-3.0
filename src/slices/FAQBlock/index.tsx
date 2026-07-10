'use client';

import React, { useState } from 'react';
import { PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FAQBlockSliceItem {
  question?: string | null;
  answer?: any;
}

export interface FAQBlockSlice {
  slice_type: "faq_block";
  primary: {
    title?: any;
  };
  items: FAQBlockSliceItem[];
}

type FAQBlockProps = {
  slice: FAQBlockSlice;
};

const titleSerializer: JSXMapSerializer = {
  heading1: ({ children }) => <h3 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h3>,
  heading2: ({ children }) => <h3 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h3>,
  heading3: ({ children }) => <h3 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h3>,
  heading4: ({ children }) => <h4 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h4>,
  heading5: ({ children }) => <h5 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h5>,
  heading6: ({ children }) => <h6 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h6>,
  paragraph: ({ children }) => <h3 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">{children}</h3>,
};

const answerSerializer: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="text-sm md:text-base text-[#6a5b5e] leading-relaxed whitespace-pre-line mb-3 last:mb-0">
      {children}
    </p>
  ),
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
} as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

export default function FAQBlock({ slice }: FAQBlockProps) {
  const { primary, items } = slice;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full mt-12 pt-8 border-t border-[#efedec]/80" id="faq-slice-view">
      {primary.title && (
        <PrismicRichText field={primary.title} components={titleSerializer} />
      )}

      {items && items.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="space-y-3.5 mt-6"
        >
          {items.map((item, index) => {
            const question = item.question || "";
            const hasAnswer = Array.isArray(item.answer) && item.answer.length > 0 && item.answer.some((b: any) => b.text);
            const isOpen = openIndex === index;

            if (!question && !hasAnswer) return null;

            return (
              <motion.div 
                key={index}
                variants={fadeUpVariants}
                className="bg-white border border-[#efedec] rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="text-base font-serif font-normal text-[#511B29] leading-relaxed group-hover:text-[#de7c8a] transition-colors pr-4">
                    {question}
                  </span>
                  <span className={`w-7 h-7 rounded-full bg-[#fbf9f8] border border-[#efedec] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#f2dde1]/30 border-[#d9c1c2]/30 text-[#de7c8a]' : 'text-slate-400'}`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && hasAnswer && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0, y: -6 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -6 }}
                      transition={{ type: 'tween', ease: 'easeOut', duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-[#efedec]/40 bg-[#fbf9f8]/10">
                        <PrismicRichText field={item.answer} components={answerSerializer} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
