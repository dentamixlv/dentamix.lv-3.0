'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface ServiceGridItem {
  badge_text?: string | null;
  title?: string | null;
  excerpt?: string | null;
  link_text?: string | null;
  link_url?: string | null;
  image?: { url?: string; alt?: string } | null;
}

interface ServiceGridSlice {
  primary: {
    hideHeader?: boolean | null;
  };
  items: ServiceGridItem[];
}

interface ServiceGridProps {
  slice: ServiceGridSlice;
}

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

export default function ServiceGrid({ slice }: ServiceGridProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0
    ? (langList[0] === 'en' ? 'en-us' : 'lv')
    : 'lv';
  const isEn = langCode === 'en-us';
  const langPrefix = isEn ? '/en' : '';

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined
    ? slice.primary.hideHeader
    : true;

  const sectionClass = hideHeaderValue
    ? 'bg-gradient-to-b from-[#fbf9f8] to-white pt-2 pb-16 md:pt-4 md:pb-24'
    : 'bg-gradient-to-b from-[#fbf9f8] to-white py-16 md:py-24';

  const defaultViewDesc = isEn ? 'Learn More' : 'Lasīt vairāk';

  return (
    <section className={sectionClass}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
        >
          {slice.items.map((item, idx) => {
            const badgeText  = item.badge_text || (isEn ? 'SERVICE' : 'PAKALPOJUMS');
            const titleText  = item.title || '';
            const excerptText = item.excerpt || '';
            const linkText   = item.link_text || defaultViewDesc;
            const linkUrl    = item.link_url || `${langPrefix}/services`;
            const imageSrc   = item.image?.url || 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800';
            const imageAlt   = item.image?.alt || titleText;

            return (
              <motion.div
                variants={fadeUpVariants}
                key={idx}
                className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
                id={`service-grid-card-${idx}`}
              >
                {/* Photo */}
                <Link href={linkUrl} className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec] block">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </Link>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {badgeText}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                      <Link href={linkUrl}>
                        {titleText}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                      {excerptText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center justify-between">
                    <Link
                      href={linkUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                      id={`service-grid-link-btn-${idx}`}
                    >
                      {linkText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
