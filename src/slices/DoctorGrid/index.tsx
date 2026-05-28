'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

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

type DoctorGridProps = SliceComponentProps<Content.DoctorGridSlice>;

export default function DoctorGrid({ slice }: DoctorGridProps) {
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

  const defaultViewProfile = isEn ? 'View Profile' : 'Skatīt profilu';
  const defaultBook = isEn ? 'Book' : 'Pieteikties';
  const defaultContacts = isEn ? `${langPrefix}/contacts` : '/kontakti';

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
            const badgeText  = item.badge_text || (isEn ? 'SPECIALIST' : 'SPECIĀLISTE');
            const nameText   = item.title || '';
            const excerptText = item.excerpt || '';
            const profileText = item.link_text || defaultViewProfile;
            const profileUrl  = item.link_url || `${langPrefix}/doctors`;
            const bookText    = item.book_text || defaultBook;
            const bookUrl     = item.book_url || defaultContacts;
            const imageSrc    = (item.image as any)?.url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
            const imageAlt    = (item.image as any)?.alt || nameText;

            return (
              <motion.div
                variants={fadeUpVariants}
                key={idx}
                className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
                id={`doctor-grid-card-${idx}`}
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {badgeText}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                      {nameText}
                    </h3>
                    <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                      {excerptText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center justify-between">
                    <Link
                      href={profileUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                      id={`doctor-grid-profile-btn-${idx}`}
                    >
                      {profileText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href={bookUrl}
                      className="px-4 py-2 text-xs font-bold text-[#511B29] bg-[#f2dde1]/50 hover:bg-[#f2dde1] rounded-full transition-colors cursor-pointer"
                      id={`doctor-grid-book-btn-${idx}`}
                    >
                      {bookText}
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
