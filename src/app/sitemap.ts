import { MetadataRoute } from 'next';
import { getServices, getBlogPosts } from '../data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dentamix.lv';

  const locales = ['', '/en'];
  const staticPaths = [
    '',
    '/about',
    '/services',
    '/doctors',
    '/prices',
    '/blogs',
    '/contacts',
    '/testimonials',
    '/privacy',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Add static paths
  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${baseUrl}${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // Add dynamic service paths
  const services = getServices('lv');
  for (const service of services) {
    // Latvian service detail
    entries.push({
      url: `${baseUrl}/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
    // English service detail
    entries.push({
      url: `${baseUrl}/en/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Add dynamic blog paths
  const blogs = getBlogPosts('lv');
  for (const blog of blogs) {
    // Latvian blog detail
    entries.push({
      url: `${baseUrl}/blogs/${blog.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
    // English blog detail
    entries.push({
      url: `${baseUrl}/en/blogs/${blog.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
