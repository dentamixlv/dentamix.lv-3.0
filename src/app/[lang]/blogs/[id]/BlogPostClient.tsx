'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BlogDetailPage from '../../../../components/BlogDetailPage';
import { BlogPost } from '../../../../types';

interface BlogPostClientProps {
  post: BlogPost;
  langCode: string;
}

export default function BlogPostClient({ post, langCode }: BlogPostClientProps) {
  const router = useRouter();
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const handleBack = () => {
    router.push(`${langPrefix}/blogs`);
  };

  const handleBook = () => {
    router.push(`${langPrefix}/contacts`);
  };

  return (
    <BlogDetailPage 
      post={post} 
      onBack={handleBack} 
      onBook={handleBook} 
      langCode={langCode} 
    />
  );
}
