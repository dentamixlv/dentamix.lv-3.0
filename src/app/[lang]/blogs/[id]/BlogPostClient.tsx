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

  return (
    <BlogDetailPage 
      post={post} 
      onBack={handleBack} 
      langCode={langCode} 
    />
  );
}
