'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CalendarDays, ShieldCheck, Sparkles, Activity, Scissors, Droplet, Heart, HelpCircle } from 'lucide-react';

export interface PriceItem {
  category: string;
  title: string;
  price: string;
  description: string;
  anchor: string;
}

interface CenasPageProps {
  onBook: () => void;
  langCode?: string;
  priceItems?: PriceItem[];
  hideHeader?: boolean;
}

const categoryTranslations: Record<string, { lv: string; en: string }> = {
  'Zobu diagnostika un izmeklēšana': { lv: 'Zobu diagnostika un izmeklēšana', en: 'Diagnostics & Examination' },
  'Zobu ārstēšana': { lv: 'Zobu ārstēšana', en: 'Dental Treatment' },
  'Zobu kanālu ārstēšana': { lv: 'Zobu kanālu ārstēšana', en: 'Root Canal Treatment' },
  'Zobu higiēna': { lv: 'Zobu higiēna', en: 'Oral Hygiene' },
  'Zobu balināšana': { lv: 'Zobu balināšana', en: 'Teeth Whitening' },
  'Bērnu zobārstniecība': { lv: 'Bērnu zobārstniecība', en: 'Pediatric Dentistry' },
  'Zobu ķirurģija / ekstrakcija': { lv: 'Zobu ķirurģija / ekstrakcija', en: 'Oral Surgery & Extraction' },
  'Zobu implanti': { lv: 'Zobu implanti', en: 'Dental Implants' },
  'Zobu protezēšana uz implantiem': { lv: 'Zobu protezēšana uz implantiem', en: 'Prosthodontics on Implants' },
  'Zobu protezēšana': { lv: 'Zobu protezēšana', en: 'Dental Prosthetics' },
  'Zobu kapes': { lv: 'Zobu kapes', en: 'Dental Trays & Aligners' }
};

interface GroupedCategory {
  id: string;
  title: string;
  items: {
    name: string;
    price: string;
    note?: string;
  }[];
}

const categoryIds: Record<string, string> = {
  'Zobu diagnostika un izmeklēšana': 'diagnostika',
  'Zobu ārstēšana': 'arstesana',
  'Zobu kanālu ārstēšana': 'kanali',
  'Zobu higiēna': 'higiena',
  'Zobu balināšana': 'balinasana',
  'Bērnu zobārstniecība': 'bernu',
  'Zobu ķirurģija / ekstrakcija': 'kirurgija',
  'Zobu implanti': 'implanti',
  'Zobu protezēšana uz implantiem': 'protezesana-implanti',
  'Zobu protezēšana': 'protezesana',
  'Zobu kapes': 'kapes'
};

export default function CenasPage({ onBook, langCode = 'lv', priceItems = [], hideHeader = false }: CenasPageProps) {
  const isEn = langCode === 'en-us';

  // Group price items by category, preserving their order from the source list
  const categoriesMap: Record<string, PriceItem[]> = {};
  const orderedCategoryNames: string[] = [];

  priceItems.forEach(item => {
    const cat = item.category || 'Zobu diagnostika un izmeklēšana';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
      orderedCategoryNames.push(cat);
    }
    categoriesMap[cat].push(item);
  });

  const groupedCategories: GroupedCategory[] = orderedCategoryNames.map(catName => {
    const id = categoryIds[catName] || 'diagnostika';
    return {
      id,
      title: isEn ? (categoryTranslations[catName]?.en || catName) : (categoryTranslations[catName]?.lv || catName),
      items: categoriesMap[catName].map(item => ({
        name: item.title,
        price: item.price,
        note: item.description || undefined
      }))
    };
  });

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'tween' as const, ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  } as const;

  return (
    <div className={`${hideHeader ? 'pt-2 pb-16 md:pt-4 md:pb-24' : 'pt-8 pb-16 md:pt-12 md:pb-24'} max-w-7xl mx-auto px-6`} id="prices-page-view">
      {/* 1. Header with Badge */}
      {!hideHeader && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {isEn ? 'Pricelist' : 'Cenrādis'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {isEn ? 'Transparent Pricing & Quality' : 'Caurspīdīgas cenas un kvalitāte'}
          </h2>
          <p className="text-base text-[#6a5b5e] mt-2 font-medium">
            {isEn ? 'Clear and simple pricing with zero hidden fees and full cost transparency.' : 'Skaidrs un saprotams cenrādis bez slēptiem maksājumiem ar pilnīgu izmaksu pārredzamību.'}
          </p>
        </motion.div>
      )}

      {/* 3. List of Categories and Rows */}
      {priceItems.length > 0 ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          {groupedCategories.map((cat) => (
            <motion.div 
              variants={fadeUpVariants}
              key={cat.id}
              className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Category Header */}
              <div className="bg-[#fbf9f8] px-6 py-5 md:px-8 border-b border-[#efedec] flex items-center gap-3">
                <h3 className="text-lg font-serif font-bold text-[#511B29] tracking-tight">
                  {cat.title}
                </h3>
              </div>

              {/* Rows List */}
              <div className="divide-y divide-[#efedec]/65">
                {cat.items.map((item, index) => (
                  <div 
                    key={index}
                    className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-[#fbf9f8]/40 transition-colors gap-4"
                  >
                    <div className="max-w-2xl">
                      <h4 className="text-sm font-bold text-[#511B29] tracking-tight">
                        {item.name}
                      </h4>
                      {item.note && (
                        <p className="text-sm text-[#6a5b5e] mt-1 font-normal leading-relaxed">
                          {item.note}
                        </p>
                      )}
                    </div>
                    {/* Price Tag styled aligned nicely */}
                    {item.price && (
                      <div className="flex items-center sm:text-right shrink-0">
                        <span className="text-sm font-mono font-extrabold text-[#511B29] bg-[#f2dde1]/35 px-4 py-2 rounded-full border border-[#d9c1c2]/20">
                          {item.price}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Loading Skeleton */
        <div className="space-y-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm animate-pulse">
              <div className="bg-[#fbf9f8] px-6 py-5 md:px-8 border-b border-[#efedec] flex items-center gap-3">
                <div className="h-5 w-48 bg-slate-100 rounded-full" />
              </div>
              <div className="p-6 md:p-8 space-y-6">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2 max-w-2xl w-full">
                      <div className="h-4 w-1/3 bg-slate-100 rounded-full" />
                      <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                    </div>
                    <div className="h-8 w-20 bg-slate-100 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Bottom Quality Standard Guarantee Box */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mt-16 bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/20 border border-[#efedec] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a]">
              {isEn ? 'Guaranteed Quality' : 'Garantēta Kvalitāte'}
            </span>
          </div>
          <h4 className="text-xl font-serif font-bold text-[#511B29] tracking-tight">
            {isEn ? 'Would you like to receive a full, detailed estimate?' : 'Vai vēlaties saņemt pilnu, detalizētu tāmi?'}
          </h4>
          <p className="text-sm md:text-base text-[#6a5b5e] leading-relaxed">
            {isEn
              ? 'An individual treatment plan detailing all steps and costs is prepared for each patient after the initial examination and 3D X-ray. There are no hidden fees, and the estimate is valid for 3 months.'
              : 'Ikvienam pacientam pēc pirmreizējās apskates un 3D rentgenuzņēmuma izveides tiek sagatavots individuāls ārstēšanas plāns, kurā detalizēti atrunāti visi soļi un izmaksas. Nav slēptu izmaksu, un tāme ir derīga 3 mēnešus no izveides brīža.'}
          </p>
        </div>
        <button
          onClick={onBook}
          className="btn inline-flex items-center gap-2 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-sm font-bold cursor-pointer shadow-lg shadow-[#511B29]/15 shrink-0"
          id="prices-cta-booking-btn"
        >
          <CalendarDays className="w-4 h-4" />
          {isEn ? 'Book a Consultation' : 'Pierakstīties konsultācijai'}
        </button>
      </motion.div>
    </div>
  );
}

