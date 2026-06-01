'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface CTABlockProps {
  badgeText: string;
  title: React.ReactNode;
  description: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  href?: string;
  targetBlank?: boolean;
  id?: string;
  className?: string;
  customButton?: React.ReactNode;
  style?: React.CSSProperties;
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
  targetBlank,
  id,
  className = '',
  customButton,
  style,
}: CTABlockProps) {
  const isTitleString = typeof title === 'string';
  const isDescString = typeof description === 'string';

  const buttonClass = "px-8 py-4 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] text-white rounded-full text-base font-bold shadow-lg shadow-[#511B29]/20 transition-all text-center cursor-pointer inline-flex items-center justify-center gap-2 group shrink-0";
  const hasCustomBg = style?.background || style?.backgroundColor;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      style={style}
      className={`${hasCustomBg ? 'border border-[#efedec]' : 'bg-[#fbf9f8] border border-[#efedec]'} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <div className="space-y-3 max-w-2xl text-center md:text-left w-full">
        {/* Badge text */}
        <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] block">
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
          <p className="text-base text-[#6a5b5e] leading-relaxed">
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
        <Link href={href} className={buttonClass} id={id} {...(targetBlank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {buttonText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClass} id={id}>
          {buttonText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </motion.div>
  );
}
