'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Sparkles, Droplet, Scissors, Activity } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck': return <ShieldCheck className="w-8 h-8 text-[#400112]" />;
    case 'Sparkles': return <Sparkles className="w-8 h-8 text-[#400112]" />;
    case 'Droplet': return <Droplet className="w-8 h-8 text-[#400112]" />;
    case 'Scissors': return <Scissors className="w-8 h-8 text-[#400112]" />;
    case 'Activity': return <Activity className="w-8 h-8 text-[#400112]" />;
    default: return <Sparkles className="w-8 h-8 text-[#400112]" />;
  }
};

type ServicesListProps = SliceComponentProps<Content.ServicesListSlice>;

export default function ServicesList({ slice }: ServicesListProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const [services, setServices] = useState<Service[]>([]);
  const isEn = langCode === 'en-us';

  const defaultTitle = isEn ? 'World-Class Dentistry' : 'Augstākās klases zobārstniecība';
  const defaultSub = isEn 
    ? 'A complete spectrum of modern dental services – from aesthetics to implants and complex surgery.'
    : 'Pilns mūsdienīgu pakalpojumu spektrs – no estētikas līdz implantācijai un sarežģītai ķirurģijai.';

  const premiumLabel = isEn ? 'PREMIUM SERVICE' : 'PREMIUM PAKALPOJUMS';
  const viewDescLabel = isEn ? 'View Description' : 'Skatīt aprakstu';
  const applyLabel = isEn ? 'Inquire Now' : 'Pieteikties';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const client = createClient();
        const docs = await client.getAllByType('service', { lang: langCode });
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
          setServices(getServices(langCode));
        }
      } catch (e) {
        setServices(getServices(langCode));
      }
    };
    fetchServices();
  }, [langCode]);

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {isEn ? 'Services' : 'Pakalpojumi'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
          {(slice.primary.title as any)?.[0]?.text || defaultTitle}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {slice.primary.subtitle || defaultSub}
        </p>
      </motion.div>

      {/* Services cards list grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
      >
        {services.map((serv) => (
          <motion.div 
            variants={fadeUpVariants}
            key={serv.id} 
            className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            id={`service-card-${serv.id}`}
          >
            {/* Upper Card image block */}
            <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
              <img
                src={serv.image}
                alt={serv.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card metadata and content */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                  {premiumLabel}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#400112] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-1">
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#400112] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
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
    </div>
  );
}
