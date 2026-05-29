'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Heart, ArrowRight } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from '@prismicio/next';
import Link from 'next/link';

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

type TestimonialBlockProps = SliceComponentProps<Content.TestimonialBlockSlice, { isEmbedded?: boolean }>;

export default function TestimonialBlock({ slice, context }: TestimonialBlockProps) {
  const isEmbedded = context?.isEmbedded === true;
  const { primary, items } = slice;
  const params = useParams();
  const pathname = usePathname();
  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';
  const langPrefix = isEn ? '/en' : '';

  const badgeText = primary.badge_text || (isEn ? 'TESTIMONIALS' : 'PACIENTU ATSAUKSMES');
  const title = primary.title || (isEn ? 'Patient Testimonials' : 'Pacientu atsauksmes');
  const subtitle = primary.subtitle || (isEn 
    ? 'Our patients appreciate the highest quality of care, painless procedures, and attentive treatment.'
    : 'Mūsu pacienti novērtē augstāko aprūpes kvalitāti, nesāpīgas procedūras un gādīgu attieksmi.');

  const linkText = primary.link_text || (isEn ? 'View All Patient Stories' : 'Skatīt visus pacientu stāstus');

  const defaultItems = [
    {
      tagline: isEn ? "Dental Implantology" : "Zobu implantācija",
      author: "Juris K.",
      testimonial_text: isEn 
        ? "Dr. Bērziņš is a true professional. The implant surgery was completely painless, and the result is outstanding."
        : "Dr. Bērziņš ir klīnikas Dentamic dibinātājs un medicīniskais direktors. Viņš ir viens no cienījamākajiem zobārstniecības ekspertiem Latvijā ar vairāk nekā 20 gadu pieredzi.",
      date: isEn ? "May 10, 2026" : "10. Maijs, 2026",
      rating: 5
    },
    {
      tagline: isEn ? "Aesthetic Dentistry" : "Estētiskā zobārstniecība",
      author: "Aiga L.",
      testimonial_text: isEn 
        ? "Excellent service, very friendly staff, and state-of-the-art technology. I finally have a confident smile!"
        : "Brīnišķīga attieksme un augstākās klases serviss. Paldies visai komandai par atgriezto pašapziņu un smaidu!",
      date: isEn ? "April 18, 2026" : "18. Aprīlis, 2026",
      rating: 5
    },
    {
      tagline: isEn ? "Hygiene & Prevention" : "Zobu higiēna",
      author: "Māris P.",
      testimonial_text: isEn 
        ? "The most thorough and painless hygiene appointment I've ever had. Highly recommend this clinic."
        : "Rūpīgākā un nesāpīgākā mutes higiēna, kādu esmu piedzīvojis. Ļoti profesionāla attieksme.",
      date: isEn ? "March 29, 2026" : "29. Marts, 2026",
      rating: 5
    }
  ];

  const activeItems = items && items.length > 0 ? items : defaultItems;

  const isHomepage = pathname === '/' || pathname === '/lv' || pathname === '/en' || pathname === '/en-us';

  const hideHeaderValue = isHomepage 
    ? false 
    : ((slice.primary as any).hideHeader !== null && (slice.primary as any).hideHeader !== undefined 
      ? (slice.primary as any).hideHeader 
      : false);

  const sectionButton = isFilled.link(primary.link_url) ? (
    <PrismicNextLink
      field={primary.link_url}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-view-all-reviews-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </PrismicNextLink>
  ) : (
    <Link
      href={`${langPrefix}/testimonials`}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-view-all-reviews-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );

  const sectionClass = hideHeaderValue
    ? 'bg-gradient-to-b from-white to-[#fbf9f8] pt-2 pb-16 md:pt-4 md:pb-24'
    : 'bg-gradient-to-b from-white to-[#fbf9f8] py-16 md:py-24 border-t border-[#efedec]/60';

  if (isEmbedded) {
    return (
      <div className="pt-8 space-y-6">
        {/* Header Block for Embedded View */}
        {!hideHeaderValue && (
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#511B29]">
              {title}
            </h4>
          </div>
        )}

        {/* Grid cards - 2 columns for embedded view */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {activeItems.map((item, idx) => {
            const taglineText = item.tagline || (isEn ? 'Premium Care' : 'Premium Aprūpe');
            const ratingValue = item.rating !== null && item.rating !== undefined ? Number(item.rating) : 5;
            const authorName = item.author || 'Pacients';
            const storyText = item.testimonial_text || '';
            const dateText = item.date || '';

            return (
              <motion.div
                variants={fadeUpVariants}
                key={idx}
                className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group h-full"
                id={`testimonial-card-${idx}`}
              >
                {/* Upper Card visual block with only stars */}
                <div className="relative bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 overflow-hidden border-b border-[#efedec] flex flex-col items-center justify-center py-6 px-6 text-center shrink-0">
                  <div className="absolute top-4 right-4 text-[#f2dde1]/30 group-hover:text-[#de7c8a]/15 transition-all duration-300">
                    <Quote className="w-8 h-8 transform scale-x-[-1]" />
                  </div>

                  {/* Stars Rating */}
                  <div className="z-10 flex gap-1 justify-center text-[#de7c8a]">
                    {Array.from({ length: Math.min(5, Math.max(1, ratingValue)) }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#de7c8a] stroke-[#de7c8a]" />
                    ))}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {taglineText}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors">
                      {authorName}
                    </h3>

                    <p className="text-sm text-[#6a5b5e] leading-relaxed mt-2.5 font-normal">
                      {storyText}
                    </p>
                  </div>

                  {/* Footer date block */}
                  <div className="mt-6 pt-4 border-t border-[#efedec]/60 flex items-center">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Heart className="w-3 h-3 text-[#de7c8a] fill-[#de7c8a]/20" />
                      <span className="text-[0.625rem] font-semibold text-slate-500">{dateText}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  return (
    <section className={sectionClass}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Block */}
        {!hideHeaderValue && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
              {badgeText}
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
              {title}
            </h3>
            <p className="text-sm md:text-base text-[#6a5b5e] mt-2 font-medium">
              {subtitle}
            </p>
          </motion.div>
        )}

        {/* Grid cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {activeItems.map((item, idx) => {
            const taglineText = item.tagline || (isEn ? 'Premium Care' : 'Premium Aprūpe');
            const ratingValue = item.rating !== null && item.rating !== undefined ? Number(item.rating) : 5;
            const authorName = item.author || 'Pacients';
            const storyText = item.testimonial_text || '';
            const dateText = item.date || '';

            return (
              <motion.div
                variants={fadeUpVariants}
                key={idx}
                className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group h-full"
                id={`testimonial-card-${idx}`}
              >
                {/* Upper Card visual block with only stars */}
                <div className="relative bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 overflow-hidden border-b border-[#efedec] flex flex-col items-center justify-center py-8 px-6 text-center shrink-0">
                  <div className="absolute top-4 right-4 text-[#f2dde1]/30 group-hover:text-[#de7c8a]/15 transition-all duration-300">
                    <Quote className="w-10 h-10 transform scale-x-[-1]" />
                  </div>

                  {/* Stars Rating */}
                  <div className="z-10 flex gap-1 justify-center text-[#de7c8a]">
                    {Array.from({ length: Math.min(5, Math.max(1, ratingValue)) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#de7c8a] stroke-[#de7c8a]" />
                    ))}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {taglineText}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors">
                      {authorName}
                    </h3>

                    <p className="text-base text-[#6a5b5e] leading-relaxed mt-3 font-normal">
                      {storyText}
                    </p>
                  </div>

                  {/* Footer date block */}
                  <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Heart className="w-3.5 h-3.5 text-[#de7c8a] fill-[#de7c8a]/20" />
                      <span className="text-[0.625rem] font-semibold text-slate-500">{dateText}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View all testimonials link */}
        <div className="text-center mt-12">
          {sectionButton}
        </div>

      </div>
    </section>
  );
}
