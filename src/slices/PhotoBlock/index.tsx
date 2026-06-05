'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Image from 'next/image';

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
} as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 6 },
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

type PhotoBlockProps = SliceComponentProps<Content.PhotoBlockSlice, { isEmbedded?: boolean }>;

export default function PhotoBlock({ slice, context }: PhotoBlockProps) {
  const isEmbedded = context?.isEmbedded === true;
  const { primary, items } = slice;

  const defaultItems = [
    {
      image: {
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
        alt: "Dentamic Clinic Interior"
      }
    },
    {
      image: {
        url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800",
        alt: "Modern Dental Equipment"
      }
    }
  ];

  const activeItems = items && items.length > 0 ? items : defaultItems;

  const content = (
    <div className={isEmbedded ? "pt-8 space-y-6" : "max-w-7xl mx-auto px-6"}>
      {/* Title block with vertical pink border */}
      {isFilled.keyText(primary.title) && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="text-left mb-8"
        >
          <h3 className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">
            {primary.title}
          </h3>
        </motion.div>
      )}

      {/* Grid of images in 2 columns */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        {activeItems.map((item, idx) => {
          const imageUrl = item.image?.url;
          if (!imageUrl) return null;

          return (
            <motion.div
              variants={fadeUpVariants}
              key={idx}
              className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group relative aspect-[3/2] w-full"
              id={`photo-card-${idx}`}
            >
              <Image
                src={imageUrl}
                alt={item.image?.alt || `Photo ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover select-none"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#fbf9f8] py-16 md:py-24 border-t border-[#efedec]/60">
      {content}
    </section>
  );
}
