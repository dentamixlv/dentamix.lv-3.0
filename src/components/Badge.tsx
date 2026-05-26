'use client';

import React from 'react';
import { motion, type Variants } from 'motion/react';

/**
 * Badge variants for color styling.
 */
export type BadgeVariant = 'default' | 'primary' | 'accent';

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
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-gray-100/90 border border-gray-200/80 text-gray-600',
  primary:
    'bg-[#400112]/10 border border-[#400112]/20 text-[#400112]',
  accent:
    'bg-emerald-50 border border-emerald-200 text-emerald-700',
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
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest';

  const allClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

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