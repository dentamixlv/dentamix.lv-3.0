'use client';

import React from 'react';
import { motion } from 'motion/react';


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
  // Latvian Keys
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
  'Zobu kapes': { lv: 'Zobu kapes', en: 'Dental Trays & Aligners' },

  // English Keys
  'Diagnostics & Examination': { lv: 'Zobu diagnostika un izmeklēšana', en: 'Diagnostics & Examination' },
  'Diagnostics & Exam': { lv: 'Zobu diagnostika un izmeklēšana', en: 'Diagnostics & Examination' },
  'Dental Treatment': { lv: 'Zobu ārstēšana', en: 'Dental Treatment' },
  'Treatment': { lv: 'Zobu ārstēšana', en: 'Dental Treatment' },
  'Root Canal Treatment': { lv: 'Zobu kanālu ārstēšana', en: 'Root Canal Treatment' },
  'Root Canals': { lv: 'Zobu kanālu ārstēšana', en: 'Root Canal Treatment' },
  'Oral Hygiene': { lv: 'Zobu higiēna', en: 'Oral Hygiene' },
  'Teeth Whitening': { lv: 'Zobu balināšana', en: 'Teeth Whitening' },
  'Pediatric Dentistry': { lv: 'Bērnu zobārstniecība', en: 'Pediatric Dentistry' },
  'Pediatric': { lv: 'Bērnu zobārstniecība', en: 'Pediatric Dentistry' },
  'Oral Surgery & Extraction': { lv: 'Zobu ķirurģija / ekstrakcija', en: 'Oral Surgery & Extraction' },
  'Oral Surgery': { lv: 'Zobu ķirurģija / ekstrakcija', en: 'Oral Surgery & Extraction' },
  'Dental Implants': { lv: 'Zobu implanti', en: 'Dental Implants' },
  'Implants': { lv: 'Zobu implanti', en: 'Dental Implants' },
  'Prosthodontics on Implants': { lv: 'Zobu protezēšana uz implantiem', en: 'Prosthodontics on Implants' },
  'Prosthodontics': { lv: 'Zobu protezēšana uz implantiem', en: 'Prosthodontics on Implants' },
  'Dental Prosthetics': { lv: 'Zobu protezēšana', en: 'Dental Prosthetics' },
  'Prosthetics': { lv: 'Zobu protezēšana', en: 'Dental Prosthetics' },
  'Dental Trays & Aligners': { lv: 'Zobu kapes', en: 'Dental Trays & Aligners' },
  'Dental Trays': { lv: 'Zobu kapes', en: 'Dental Trays & Aligners' }
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
  // Latvian Names
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
  'Zobu kapes': 'kapes',

  // English Names & Variations
  'Diagnostics & Examination': 'diagnostika',
  'Diagnostics & Exam': 'diagnostika',
  'Dental Treatment': 'arstesana',
  'Treatment': 'arstesana',
  'Root Canal Treatment': 'kanali',
  'Root Canals': 'kanali',
  'Oral Hygiene': 'higiena',
  'Teeth Whitening': 'balinasana',
  'Pediatric Dentistry': 'bernu',
  'Pediatric': 'bernu',
  'Oral Surgery & Extraction': 'kirurgija',
  'Oral Surgery': 'kirurgija',
  'Dental Implants': 'implanti',
  'Implants': 'implanti',
  'Prosthodontics on Implants': 'protezesana-implanti',
  'Prosthodontics': 'protezesana-implanti',
  'Dental Prosthetics': 'protezesana',
  'Prosthetics': 'protezesana',
  'Dental Trays & Aligners': 'kapes',
  'Dental Trays': 'kapes'
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

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ā/g, 'a')
      .replace(/ē/g, 'e')
      .replace(/ī/g, 'i')
      .replace(/ū/g, 'u')
      .replace(/ō/g, 'o')
      .replace(/č/g, 'c')
      .replace(/š/g, 's')
      .replace(/ž/g, 'z')
      .replace(/ļ/g, 'l')
      .replace(/ņ/g, 'n')
      .replace(/ķ/g, 'k')
      .replace(/ģ/g, 'g')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const groupedCategories: GroupedCategory[] = orderedCategoryNames.map(catName => {
    const id = categoryIds[catName] || slugify(catName) || 'category';
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
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'tween' as const, ease: 'easeOut', duration: 0.55 }
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
                      <div className="flex items-center self-end sm:self-auto sm:text-right shrink-0">
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
                    <div className="h-8 w-20 bg-slate-100 rounded-full self-end sm:self-auto shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

