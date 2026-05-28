'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import BlogsClient from '../../app/[lang]/blogs/BlogsClient';
import { getBlogPosts } from '../../data';
import { BlogPost } from '../../types';
import { createClient } from '../../prismicio';

type BlogPageProps = SliceComponentProps<Content.BlogPageSlice>;

export default function BlogPage({ slice }: BlogPageProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const isEn = langCode === 'en-us';

  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  // Check if items are provided inline
  const inlineItems = slice.items || [];
  const hasInlineItems = inlineItems.length > 0 && inlineItems.some(item => item.title || item.excerpt || isFilled.link(item.link_url));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const client = createClient();
        
        if (hasInlineItems) {
          // Collect document IDs to fetch referenced details
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
          // Query all blog posts from Prismic
          const response = await client.getAllByType('blog_post', { lang: langCode });
          
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
            setPosts(getBlogPosts(langCode));
          }
        }
      } catch (e) {
        console.warn("Failed to load blog posts in BlogPage, using local fallback data.", e);
        setPosts(getBlogPosts(langCode));
      }
    };
    fetchPosts();
  }, [hasInlineItems, inlineItems, langCode, isEn]);

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined 
    ? slice.primary.hideHeader 
    : true;

  return (
    <BlogsClient 
      langCode={langCode} 
      customBlogPosts={posts} 
      hideHeader={hideHeaderValue} 
    />
  );
}
