'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from '@prismicio/next';

import { getServices } from '../../data';
import { Service } from '../../types';
import { createClient } from '../../prismicio';

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

type ServiceBlockProps = SliceComponentProps<Content.ServiceBlockSlice>;

export default function ServiceBlock({ slice }: ServiceBlockProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';
  const isEn = langCode === 'en-us';

  const [services, setServices] = useState<Service[]>([]);

  // Primary fields with fallbacks
  const badgeText = slice.primary.badge_text || (isEn ? 'Services' : 'Pakalpojumi');
  const subtitle = slice.primary.subtitle || '';
  const linkText = slice.primary.link_text || (isEn ? 'View All Services' : 'Skatīt visus pakalpojumus');

  // Check if items are provided (linked service documents)
  const linkedItems = slice.items || [];
  const hasLinkedServices = linkedItems.length > 0 && linkedItems.some(item => isFilled.link(item.service));

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const client = createClient();
        let docs = [];

        if (hasLinkedServices) {
          const ids = linkedItems
            .map(item => (isFilled.link(item.service) && (item.service as any).id) || '')
            .filter(Boolean);
          if (ids.length > 0) {
            const response = await client.getByIDs(ids, { lang: langCode });
            docs = response.results;
          }
        } else {
          // Query first 3 services
          const response = await client.getAllByType('service', { lang: langCode, limit: 3 });
          docs = response;
        }

        if (docs && docs.length > 0) {
          setServices(docs.map(d => ({
            id: d.uid!,
            title: d.data.title || '',
            description: d.data.description || '',
            detailedInfo: Array.isArray(d.data.detailedInfo) ? (d.data.detailedInfo[0] as any)?.text || '' : (d.data.detailedInfo as any) || '',
            priceRange: d.data.priceRange || '',
            duration: d.data.duration || '',
            iconName: d.data.iconName || 'Sparkles',
            image: d.data.image?.url || 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800',
          })));
        } else {
          setServices(getServices(langCode).slice(0, 3));
        }
      } catch (e) {
        console.warn("Failed to fetch services in ServiceBlock, using fallbacks.", e);
        setServices(getServices(langCode).slice(0, 3));
      }
    };
    fetchServices();
  }, [hasLinkedServices, linkedItems, langCode]);

  const viewDescLabel = isEn ? 'View Description' : 'Skatīt aprakstu';
  const premiumLabel = isEn ? 'PREMIUM SERVICE' : 'PREMIUM PAKALPOJUMS';

  const hideHeaderValue = (slice.primary as any).hideHeader !== null && (slice.primary as any).hideHeader !== undefined
    ? (slice.primary as any).hideHeader
    : false;

  const sectionClass = hideHeaderValue
    ? 'bg-gradient-to-b from-white to-[#fbf9f8] pt-2 pb-0 md:pt-4 md:pb-0'
    : 'bg-gradient-to-b from-white to-[#fbf9f8] py-16 md:py-24 border-t border-[#efedec]/60';

  const sectionButton = isFilled.link(slice.primary.link_url) ? (
    <PrismicNextLink
      field={slice.primary.link_url}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-view-all-services-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </PrismicNextLink>
  ) : (
    <Link
      href={`${langPrefix}/services`}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-view-all-services-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );

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
            className="text-center max-w-xl mx-auto mb-16"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
              {badgeText}
            </span>
            {isFilled.richText(slice.primary.title) ? (
              <div className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
                <PrismicRichText field={slice.primary.title} />
              </div>
            ) : (
              <h2 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
                {isEn ? 'World-Class Dentistry' : 'Augstākās klases zobārstniecība'}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Services cards list grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
        >
          {services.map((serv) => (
            <motion.div 
              variants={fadeUpVariants}
              key={serv.id} 
              className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
              id={`service-card-${serv.id}`}
            >
              {/* Upper Card image block */}
              <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
                <Image
                  src={serv.image}
                  alt={serv.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>

              {/* Card metadata and content */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                    {premiumLabel}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                    {serv.description}
                  </p>
                </div>

                {/* Bottom actions */}
                <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                  <Link
                    href={`${langPrefix}/services/${serv.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                    id={`learn-service-btn-${serv.id}`}
                  >
                    {viewDescLabel}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all services link */}
        <div className="text-center mt-12">
          {sectionButton}
        </div>

      </div>
    </section>
  );
}
