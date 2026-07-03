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
  book_text?: string | null;
  book_url?: string | null;
  book_url_blank?: boolean | null;
  show_book_button?: boolean | null;
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
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';
  const langPrefix = isEn ? '/en' : '';

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined
    ? slice.primary.hideHeader
    : true;

  const sectionClass = hideHeaderValue
    ? 'bg-[#fbf9f8] pt-2 pb-16 md:pt-4 md:pb-24'
    : 'bg-[#fbf9f8] py-16 md:py-24';

  const defaultViewDesc = isEn ? 'Learn More' : 'Lasīt vairāk';
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
            const badgeText  = item.badge_text || (isEn ? 'SERVICE' : 'PAKALPOJUMS');
            const titleText  = item.title || '';
            const excerptText = item.excerpt || '';
            const linkText   = item.link_text || defaultViewDesc;
            const linkUrl    = item.link_url || `${langPrefix}/services`;
            const bookText    = item.book_text || defaultBook;
            const bookUrl     = item.book_url || defaultContacts;
            const bookUrlBlank = item.book_url_blank === true;
            const isExternalBookUrl = bookUrl.startsWith('http://') || bookUrl.startsWith('https://') || bookUrl.startsWith('//');
            const openBookBlank = bookUrlBlank || isExternalBookUrl;
            const showBookButton = item.show_book_button !== false;
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
                    className="object-cover hover-scale-103"
                  />
                </Link>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {badgeText}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                      <Link href={linkUrl}>
                        {titleText}
                      </Link>
                    </h3>
                    <p className="text-base text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                      {excerptText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center justify-between">
                    <Link
                      href={linkUrl}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                      id={`service-grid-link-btn-${idx}`}
                    >
                      {linkText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {showBookButton ? (
                      <Link
                        href={bookUrl}
                        target={openBookBlank ? "_blank" : undefined}
                        rel={openBookBlank ? "noopener noreferrer" : undefined}
                        className="px-4 py-2 text-sm font-bold text-[#511B29] bg-[#f2dde1]/50 hover:bg-[#f2dde1] rounded-full transition-colors cursor-pointer"
                        id={`service-grid-book-btn-${idx}`}
                      >
                        {bookText}
                      </Link>
                    ) : (
                      <span
                        className="px-4 py-2 text-sm font-bold text-[#8e8385] bg-[#efedec] rounded-full cursor-not-allowed select-none"
                        id={`service-grid-book-btn-inactive-${idx}`}
                      >
                        {bookText}
                      </span>
                    )}
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
