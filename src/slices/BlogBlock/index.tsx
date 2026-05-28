'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from '@prismicio/next';

import { getBlogPosts } from '../../data';
import { BlogPost } from '../../types';
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

type BlogBlockProps = SliceComponentProps<Content.BlogBlockSlice>;

export default function BlogBlock({ slice }: BlogBlockProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';
  const isEn = langCode === 'en-us';

  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Check if items are provided inline
  const inlineItems = slice.items || [];
  const hasInlineItems = inlineItems.length > 0 && inlineItems.some(item => item.title || item.excerpt || isFilled.link(item.link_url));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const client = createClient();
        
        if (hasInlineItems) {
          // Collect document IDs to fetch referenced details (like images and publication dates)
          const ids = inlineItems
            .map(item => (isFilled.link(item.link_url) && (item.link_url as any).id) || '')
            .filter(Boolean);

          let fetchedDocs: any[] = [];
          if (ids.length > 0) {
            const response = await client.getByIDs(ids, { lang: langCode });
            fetchedDocs = response.results;
          }

          // Map inline items resolving missing fields from fetched documents
          const mapped = inlineItems.map((item, index) => {
            const linkedId = isFilled.link(item.link_url) ? (item.link_url as any).id : null;
            const linkedDoc = fetchedDocs.find(doc => doc.id === linkedId);

            const title = item.title || linkedDoc?.data?.title || '';
            const category = item.badge_text || linkedDoc?.data?.category || (isEn ? 'BLOG' : 'BLOGS');
            const description = item.excerpt || linkedDoc?.data?.description || '';
            const imageUrl = item.image?.url || linkedDoc?.data?.image?.url || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800';
            const date = linkedDoc?.data?.date || '';
            const author = linkedDoc?.data?.author || '';
            const readTime = linkedDoc?.data?.readTime || '4 MIN';
            const slug = linkedDoc?.uid || (isFilled.link(item.link_url) ? (item.link_url as any).uid : null) || `inline-${index}`;

            return {
              id: slug,
              title,
              category,
              description,
              image: imageUrl,
              date,
              author,
              readTime,
              detailedContent: []
            };
          });

          setPosts(mapped);
        } else {
          // Query latest 3 blog posts from Prismic as a fallback
          const response = await client.getAllByType('blog_post', { 
            lang: langCode, 
            limit: 3,
            orderings: {
              field: 'document.first_publication_date',
              direction: 'desc'
            }
          });
          
          if (response && response.length > 0) {
            setPosts(response.map(d => ({
              id: d.uid!,
              title: d.data.title || '',
              category: d.data.category || '',
              description: d.data.description || '',
              detailedContent: Array.isArray(d.data.detailedContent) 
                ? d.data.detailedContent.map((p: any) => p.text || '')
                : [],
              image: d.data.image?.url || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
              date: d.data.date || '',
              author: d.data.author || '',
              readTime: d.data.readTime || '4 MIN'
            })));
          } else {
            setPosts(getBlogPosts(langCode).slice(0, 3));
          }
        }
      } catch (e) {
        console.warn("Failed to load blog posts in BlogBlock, using local fallback data.", e);
        setPosts(getBlogPosts(langCode).slice(0, 3));
      }
    };
    fetchPosts();
  }, [hasInlineItems, inlineItems, langCode, isEn]);

  const readPostLabel = isEn ? 'Read Article' : 'Lasīt rakstu';

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined 
    ? slice.primary.hideHeader 
    : true;

  const t = {
    tag: isEn ? 'Knowledge & Advice' : 'Zināšanas un padomi',
    title: isEn ? 'Dentamic Blog' : 'Dentamic Blogs',
    sub: isEn 
      ? 'Specialist advice, latest technologies, and practical tips for successful oral care and a healthy smile.'
      : 'Speciālistu ieteikumi, jaunākās tehnoloģijas un praktiski padomi smaida aprūpei.'
  };

  return (
    <section className="bg-gradient-to-b from-[#fbf9f8] to-white pt-4 md:pt-6 pb-16 md:pb-24 border-t border-[#efedec]/60">
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
              {t.tag}
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
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
          {posts.map((post) => {
            const buttonText = inlineItems.find(item => isFilled.link(item.link_url) && (item.link_url as any).uid === post.id)?.link_text || readPostLabel;
            return (
              <motion.div 
                variants={fadeUpVariants}
                key={post.id} 
                className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
                id={`blog-card-${post.id}`}
              >
                {/* Upper Card image block */}
                <div className="relative aspect-[4/3] bg-[#fbf9f8] overflow-hidden border-b border-[#efedec]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>

                {/* Card metadata and content */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {post.category}
                    </span>
                    <div className="min-h-[3.5rem] flex flex-col justify-start">
                      <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Bottom actions */}
                  <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                    <Link
                      href={`${langPrefix}/blogs/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                      id={`learn-blog-btn-${post.id}`}
                    >
                      {buttonText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
