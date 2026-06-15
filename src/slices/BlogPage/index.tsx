'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import BlogsClient from '../../app/[lang]/blogs/BlogsClient';
import { getBlogPosts } from '../../data';
import { BlogPost } from '../../types';
import { createClient } from '../../prismicio';

type BlogPageProps = SliceComponentProps<Content.BlogPageSlice, { prismicBlogPosts?: any[] }>;

export default function BlogPage({ slice, context }: BlogPageProps) {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';

  const [clientPosts, setClientPosts] = useState<BlogPost[] | null>(null);

  // Check if items are provided inline
  const hasInlineItems = slice.items && slice.items.length > 0 && slice.items.some(item => item.title || item.excerpt || isFilled.link(item.link_url));

  // Synchronously compute posts if pre-fetched via context on the server/first render
  const posts = React.useMemo(() => {
    if (context?.prismicBlogPosts && context.prismicBlogPosts.length > 0) {
      const inlineItems = slice.items || [];
      if (hasInlineItems) {
        // Collect linked IDs
        const ids = inlineItems
          .map(item => (isFilled.link(item.link_url) && (item.link_url as any).id) || '')
          .filter(Boolean);

        const fetchedDocs = context.prismicBlogPosts.filter((d: any) => ids.includes(d.id));

        return inlineItems.map((item, index) => {
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
      } else {
        return context.prismicBlogPosts.map((d: any) => ({
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
        }));
      }
    }

    return clientPosts || getBlogPosts(langCode);
  }, [hasInlineItems, slice.items, context?.prismicBlogPosts, clientPosts, langCode, isEn]);

  useEffect(() => {
    // Skip client-side fetch if we already have blog posts pre-fetched via context
    if (context?.prismicBlogPosts && context.prismicBlogPosts.length > 0) {
      return;
    }

    const fetchPosts = async () => {
      const inlineItems = slice.items || [];
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

          setClientPosts(mapped);
        } else {
          // Query all blog posts from Prismic
          const response = await client.getAllByType('blog_post', { lang: langCode });
          
          if (response && response.length > 0) {
            setClientPosts(response.map(d => ({
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
            setClientPosts(getBlogPosts(langCode));
          }
        }
      } catch (e) {
        console.warn("Failed to load blog posts in BlogPage, using local fallback data.", e);
        setClientPosts(getBlogPosts(langCode));
      }
    };
    fetchPosts();
  }, [hasInlineItems, slice.items, langCode, isEn, context?.prismicBlogPosts]);

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
