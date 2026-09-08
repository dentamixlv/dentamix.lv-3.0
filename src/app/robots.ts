import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
          'Meta-ExternalAgent',
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: '/api/',
      },
    ],
    sitemap: 'https://dentamix.lv/sitemap.xml',
  };
}
