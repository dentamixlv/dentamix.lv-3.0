'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

export interface CTABlockProps {
  badgeText: string;
  title: React.ReactNode;
  description: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  href?: string;
  id?: string;
  className?: string;
  customButton?: React.ReactNode;
}

const fadeUpVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45,
    },
  },
} as const;

export default function CTABlock({
  badgeText,
  title,
  description,
  buttonText,
  onClick,
  href,
  id,
  className = '',
  customButton,
}: CTABlockProps) {
  const isTitleString = typeof title === 'string';
  const isDescString = typeof description === 'string';

  const buttonClass = "btn inline-flex items-center gap-2 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#511B29]/15 shrink-0";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className={`bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 border border-[#efedec] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 ${className}`}
    >
      <div className="space-y-3 max-w-2xl text-left w-full">
        {/* Badge text */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] block">
          {badgeText}
        </span>

        {/* Title */}
        {isTitleString ? (
          <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {title}
          </h4>
        ) : (
          title
        )}

        {/* Description */}
        {isDescString ? (
          <p className="text-xs text-[#6a5b5e] leading-relaxed">
            {description}
          </p>
        ) : (
          description
        )}
      </div>

      {/* Button Action */}
      {customButton ? (
        customButton
      ) : href ? (
        <Link href={href} className={buttonClass} id={id}>
          <CalendarDays className="w-4 h-4" />
          {buttonText}
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClass} id={id}>
          <CalendarDays className="w-4 h-4" />
          {buttonText}
        </button>
      )}
    </motion.div>
  );
}
