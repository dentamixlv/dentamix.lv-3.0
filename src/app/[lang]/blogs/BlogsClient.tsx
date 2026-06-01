'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../../../types';
import { getBlogPosts } from '../../../data';

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

interface BlogsClientProps {
  langCode: string;
  customBlogPosts?: BlogPost[] | null;
  hideHeader?: boolean;
}

export default function BlogsClient({ langCode, customBlogPosts, hideHeader = false }: BlogsClientProps) {
  const isEn = langCode === 'en-us';
  const langPrefix = isEn ? '/en' : '';
  const posts = customBlogPosts || getBlogPosts(langCode);

  const t = {
    tag: isEn ? 'Knowledge & Advice' : 'Zināšanas un padomi',
    title: isEn ? 'Dentamic Blog' : 'Dentamic Blogs',
    sub: isEn 
      ? 'Specialist advice, latest technologies, and practical tips for successful oral care and a healthy smile.'
      : 'Speciālistu ieteikumi, jaunākās tehnoloģijas un praktiski padomi veiksmīgai mutes dobuma un smaida aprūpei.',
    readPost: isEn ? 'Read Article' : 'Lasīt rakstu'
  };

  return (
    <div className={`${hideHeader ? 'pt-2 pb-16 md:pt-4 md:pb-24' : 'py-16 md:py-24'} max-w-7xl mx-auto px-6`}>
      {/* Title and subtitle header */}
      {!hideHeader && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-[#6a5b5e] mt-2 font-medium">
            {t.sub}
          </p>
        </motion.div>
      )}

      {/* Blogs cards list grid */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
      >
        {posts.map((post) => (
          <motion.div 
            variants={fadeUpVariants}
            key={post.id} 
            className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
            id={`blog-card-${post.id}`}
          >
            {/* Upper Card image block */}
            <Link href={`${langPrefix}/blogs/${post.id}`} className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec] block">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                className="object-cover hover-scale-103"
              />
            </Link>

            {/* Card metadata and content */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                  {post.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-2">
                  <Link href={`${langPrefix}/blogs/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-base text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                  {post.description}
                </p>
              </div>

              {/* Bottom actions */}
              <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                <Link
                  href={`${langPrefix}/blogs/${post.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                  id={`learn-blog-btn-${post.id}`}
                >
                  {t.readPost}
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
