'use client';

import React from 'react';
import { ArrowLeft, Clock, Calendar, User, Bookmark, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { BlogPost } from '../types';

interface BlogDetailPageProps {
  post: BlogPost;
  onBack: () => void;
  onBook: () => void;
  langCode?: string;
}

export default function BlogDetailPage({ post, onBack, onBook, langCode = 'lv' }: BlogDetailPageProps) {
  const isEn = langCode === 'en-us';

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  } as const;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="py-16 md:py-24 max-w-7xl mx-auto px-6"
      id={`blog-detail-page-${post.id}`}
    >
      {/* Header Metadata block - Centered and full-width */}
      <motion.div variants={fadeUpVariants} className="text-center w-full mb-12 animate-fade-in">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block text-center">
          {post.category}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight leading-tight mb-6 text-center w-full">
          {post.title}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium text-center max-w-2xl mx-auto">
          {post.description}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs text-[#6a5b5e] border-y border-[#efedec] py-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#de7c8a]" />
            <span className="font-bold text-slate-800">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#de7c8a]" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#de7c8a]" />
            <span>{post.readTime} {isEn ? 'READ' : 'LASĪŠANAI'}</span>
          </div>
        </div>
      </motion.div>

      {/* Article Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
        {/* Main Content */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          <div className="text-base sm:text-lg leading-relaxed text-slate-800 space-y-6 font-normal">
            {post.detailedContent.map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? "text-[#400112] font-serif text-lg leading-relaxed border-l-2 border-[#de7c8a] pl-4 font-medium" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="p-6 bg-[#fbf9f8] rounded-2xl border border-[#efedec] mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#400112] mb-2">
              {isEn ? 'All procedures at Dentamic Clinic' : 'Visas procedūras klīnikā Dentamic'}
            </h4>
            <p className="text-xs text-[#6a5b5e] leading-relaxed">
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
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-serif font-bold text-[#400112] tracking-tight mb-4 flex items-center gap-2 border-b border-[#efedec] pb-3">
              <Bookmark className="w-4 h-4 text-[#de7c8a]" />
              {isEn ? 'Key Takeaways' : 'Svarīgas atziņas'}
            </h3>
            <ul className="space-y-4 text-xs text-[#6a5b5e]">
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

          <div className="bg-[#f2dde1]/15 border border-[#d9c1c2]/40 rounded-3xl p-6 md:p-8 text-center space-y-4">
            <Heart className="w-8 h-8 text-[#de7c8a] mx-auto animate-pulse" />
            <h4 className="text-sm font-serif font-bold text-[#400112]">
              {isEn ? 'A Beautiful Smile Starts Here' : 'Skaists smaids sākas šeit'}
            </h4>
            <p className="text-xs text-[#6a5b5e]">
              {isEn 
                ? 'Would you like to discuss your wishes with the author or one of our team dentists?'
                : 'Vēlaties apspriest savas vēlmes ar raksta autoru vai kādu no mūsu komandas zobārstiem?'}
            </p>
            <button
              onClick={onBook}
              className="w-full py-3 bg-[#400112] hover:bg-[#5d1726] text-white font-bold text-[11px] rounded-full uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isEn ? 'Book a Visit' : 'Rezervēt vizīti'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Back Button underneath the blog post info */}
      <motion.div variants={fadeUpVariants} className="mt-16 pt-8 border-t border-[#efedec] flex justify-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#fbf9f8] border border-[#efedec] text-xs font-bold uppercase tracking-widest text-[#400112] rounded-full transition-all cursor-pointer shadow-xs hover:border-[#de7c8a]/40 hover:scale-[1.02] active:scale-[0.98]"
          id="blog-detail-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
          {isEn ? 'Back to Blog' : 'Atpakaļ uz blogu'}
        </button>
      </motion.div>
    </motion.div>
  );
}
