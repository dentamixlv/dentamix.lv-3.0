'use client';

import React from 'react';
import { motion, type Variants } from 'motion/react';

/**
 * Badge variants for color styling.
 */
export type BadgeVariant = 'default' | 'primary' | 'accent' | 'gray';

/**
 * Badge component props.
 */
export interface BadgeProps {
  /** The text displayed inside the badge. */
  text: string;
  /** Color variant. Defaults to 'default'. */
  variant?: BadgeVariant;
  /** Optional CSS classes to merge. */
  className?: string;
  /** Whether to wrap in motion.div for animation. Defaults to false. */
  animated?: boolean;
  /** Custom motion variants (required if animated is true). */
  variants?: Variants;
  /** Optional custom text size class. */
  textSize?: string;
  /** Optional custom font weight class. */
  fontWeight?: string;
  /** Whether to render as plain text without background/border/padding. Defaults to false. */
  plain?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[#de7c8a]/8 border border-[#de7c8a]/20 text-[#de7c8a]',
  primary:
    'bg-[#511B29]/10 border border-[#511B29]/20 text-[#511B29]',
  accent:
    'bg-emerald-50 border border-emerald-200 text-emerald-700',
  gray:
    'bg-[#6A5B5E]/8 border border-[#6A5B5E]/20 text-[#6A5B5E]',
};

const textColorClasses: Record<BadgeVariant, string> = {
  default: 'text-[#de7c8a]',
  primary: 'text-[#511B29]',
  accent: 'text-emerald-700',
  gray: 'text-[#6A5B5E]',
};

/**
 * Reusable pill-shaped badge component.
 *
 * Usage:
 * ```tsx
 * <Badge text="Premium Care" />
 * <Badge text="New" variant="primary" />
 * <Badge text="Popular" variant="accent" animated variants={fadeUpVariants} />
 * ```
 */
export default function Badge({
  text,
  variant = 'default',
  className = '',
  animated = false,
  variants,
  textSize = 'text-[0.625rem]',
  fontWeight = 'font-extrabold',
  plain = false,
}: BadgeProps) {
  const baseClasses = plain
    ? `inline-flex items-center ${textSize} ${fontWeight} uppercase tracking-widest`
    : `inline-flex items-center px-3 py-1 rounded-full ${textSize} ${fontWeight} uppercase tracking-widest`;

  const variantStyle = plain ? textColorClasses[variant] : variantClasses[variant];
  const allClasses = `${baseClasses} ${variantStyle} ${className}`.trim();

  if (animated && variants) {
    return (
      <motion.div variants={variants} className="inline-block">
        <span className={allClasses}>{text}</span>
      </motion.div>
    );
  }

  return (
    <div className="inline-block">
      <span className={allClasses}>{text}</span>
    </div>
  );
}