import { MetadataRoute } from 'next';
import { getServices, getBlogPosts, getDoctors } from '../data';
import { createClient } from '../prismicio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dentamix.lv';

  const staticPaths = [
    { en: '', lv: '' },
    { en: '/about', lv: '/par-mums' },
    { en: '/services', lv: '/pakalpojumi' },
    { en: '/doctors', lv: '/zobarsti' },
    { en: '/prices', lv: '/cenas' },
    { en: '/blogs', lv: '/blogs' },
    { en: '/contacts', lv: '/kontakti' },
    { en: '/testimonials', lv: '/atsauksmes' },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Add static paths
  for (const path of staticPaths) {
    // Latvian static path
    entries.push({
      url: `${baseUrl}${path.lv}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path.lv === '' ? 1.0 : 0.8,
    });

    // English static path
    entries.push({
      url: `${baseUrl}/en${path.en}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path.en === '' ? 1.0 : 0.8,
    });
  }

  // Add dynamic service paths
  const services = getServices('lv');
  for (const service of services) {
    // Latvian service detail - public URL is /pakalpojumi/{id}
    entries.push({
      url: `${baseUrl}/pakalpojumi/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
    // English service detail - public URL is /en/services/{id}
    entries.push({
      url: `${baseUrl}/en/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Add dynamic doctor paths
  const doctors = getDoctors('lv');
  for (const doctor of doctors) {
    // Latvian doctor detail - public URL is /zobarsti/{id}
    entries.push({
      url: `${baseUrl}/zobarsti/${doctor.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
    // English doctor detail - public URL is /en/doctors/{id}
    entries.push({
      url: `${baseUrl}/en/doctors/${doctor.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Add dynamic blog paths
  const blogs = getBlogPosts('lv');
  for (const blog of blogs) {
    // Latvian blog detail - public URL is /blogs/{id}
    entries.push({
      url: `${baseUrl}/blogs/${blog.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
    // English blog detail - public URL is /en/blogs/{id}
    entries.push({
      url: `${baseUrl}/en/blogs/${blog.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // Add dynamic custom Prismic pages (filtering out static paths, services, doctors, and blogs)
  try {
    const client = createClient();
    const prismicPages = await client.getAllByType('page');
    
    for (const pageDoc of prismicPages) {
      const uid = pageDoc.uid;
      const lang = pageDoc.lang; // 'lv' or 'en-us'

      // Skip if the page matches one of our known core static routes or other dynamic content
      const isStaticOrKnown = staticPaths.some(p => p.en === `/${uid}` || p.lv === `/${uid}`) ||
        services.some(s => s.id === uid) ||
        doctors.some(d => d.id === uid) ||
        blogs.some(b => b.id === uid) ||
        // Fallback checks for common routing equivalents
        uid === 'home' || uid === 'sakums' ||
        uid === 'zobardti'; // fallback doctor list uid

      if (isStaticOrKnown) continue;

      const lastModifiedDate = pageDoc.last_publication_date
        ? new Date(pageDoc.last_publication_date)
        : new Date();

      if (lang === 'en-us') {
        entries.push({
          url: `${baseUrl}/en/${uid}`,
          lastModified: lastModifiedDate,
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      } else {
        entries.push({
          url: `${baseUrl}/${uid}`,
          lastModified: lastModifiedDate,
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      }
    }
  } catch (error) {
    console.warn("Failed to fetch Prismic custom pages for sitemap.", error);
  }

  return entries;
}
