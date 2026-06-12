'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ChatAssistantSkeleton from './ChatAssistantSkeleton';

const ChatAssistant = dynamic(() => import('./ChatAssistant'), {
  ssr: false,
  loading: () => <ChatAssistantSkeleton />,
});

export default function ClientChatAssistant() {
  return <ChatAssistant />;
}
