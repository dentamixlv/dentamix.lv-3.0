'use client';

import React from 'react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { BlogPost } from '../types';

interface BlogDetailPageProps {
  post: BlogPost;
  onBack: () => void;
  langCode?: string;
}

export default function BlogDetailPage({ post, onBack, langCode = 'lv' }: BlogDetailPageProps) {
  const isEn = langCode === 'en-us';

  const fadeUpVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  } as const;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="pt-8 pb-16 md:pt-12 md:pb-24 max-w-7xl mx-auto px-6"
      id={`blog-detail-page-${post.id}`}
    >
      {/* Header Metadata block - Centered and full-width */}
      <motion.div variants={fadeUpVariants} className="text-center w-full mb-12 animate-fade-in">
        <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block text-center">
          {post.category}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight leading-tight text-center w-full">
          {post.title}
        </h2>
        <p className="text-base text-[#6a5b5e] mt-2 font-medium text-center max-w-2xl mx-auto">
          {post.description}
        </p>
        
      </motion.div>

      {/* Article Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
        {/* Main Content */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          <div className="space-y-6">
            {post.detailedContent.map((paragraph, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? "text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4"
                    : "text-base md:text-lg font-normal text-slate-800 leading-relaxed"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="p-6 bg-[#fbf9f8] rounded-2xl border border-[#efedec] mt-8">
            <h4 className="text-[0.625rem] font-bold uppercase tracking-wider text-[#511B29] mb-2">
              {isEn ? 'All procedures at Dentamic Clinic' : 'Visas procedūras klīnikā Dentamic'}
            </h4>
            <p className="text-sm md:text-base text-[#6a5b5e] leading-relaxed">
              {isEn 
                ? 'Our specialists are fully certified and passionate about their work. Apply for a consultation to address any questions about aesthetics or surgery.'
                : 'Mūsu speciālisti ir pilnībā sertificēti un kaislīgi savā darbā. Piesakieties uz konsultāciju, lai risinātu jebkurus jautājumus par viena zoba vai visa sakodiena estētiku vai ķirurģiju.'}
            </p>
          </div>
        </motion.div>

        {/* Info Sidebar */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Blog Post Image in Sidebar */}
          <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#efedec] bg-[#fbf9f8] shadow-sm">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover select-none"
            />
          </div>

          <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-sm md:text-base font-serif font-bold text-[#511B29] tracking-tight mb-4 flex items-center gap-2 border-b border-[#efedec] pb-3">
              <Bookmark className="w-4 h-4 text-[#de7c8a]" />
              {isEn ? 'Key Takeaways' : 'Svarīgas atziņas'}
            </h3>
            <ul className="space-y-4 text-sm text-[#6a5b5e]">
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn 
                    ? 'Regular checkups prevent up to 90% of caries development.'
                    : 'Regulāras pārbaudes novērš līdz pat 90% kariesa attīstību.'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn 
                    ? 'A beautiful smile enhances self-confidence and social relationships.'
                    : 'Skaists smails uzlabo pašapziņu un sociālās attiecības.'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn
                    ? 'Advanced technologies make treatment as comfortable as possible.'
                    : 'Progresīvas tehnoloģijas padara ārstēšanu maksimāli ērtu.'}
                </span>
              </li>
            </ul>
          </div>

        </motion.div>
      </div>

      {/* Back Button underneath the blog post info */}
      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
          {isEn ? 'Back to Blog' : 'Atpakaļ uz blogu'}
        </button>
      </div>
    </motion.div>
  );
}
