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

  // 1. Add static paths
  try {
    for (const path of staticPaths) {
      const lvUrl = `${baseUrl}${path.lv}`;
      const enUrl = `${baseUrl}/en${path.en}`;
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      // Latvian static path
      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path.lv === '' ? 1.0 : 0.8,
        alternates: {
          languages: langAlternates,
        },
      });

      // English static path
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path.en === '' ? 1.0 : 0.8,
        alternates: {
          languages: langAlternates,
        },
      });
    }
  } catch (error) {
    console.error("Error processing static paths for sitemap:", error);
  }

  // 2. Add dynamic service paths
  try {
    const services = getServices('lv');
    for (const service of services) {
      const lvUrl = `${baseUrl}/pakalpojumi/${service.id}`;
      const enUrl = `${baseUrl}/en/services/${service.id}`;
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      // Latvian service detail - public URL is /pakalpojumi/{id}
      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: langAlternates,
        },
      });

      // English service detail - public URL is /en/services/{id}
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: langAlternates,
        },
      });
    }
  } catch (error) {
    console.error("Error processing dynamic service paths for sitemap:", error);
  }

  // 3. Add dynamic doctor paths
  try {
    const doctors = getDoctors('lv');
    for (const doctor of doctors) {
      const lvUrl = `${baseUrl}/zobarsti/${doctor.id}`;
      const enUrl = `${baseUrl}/en/doctors/${doctor.id}`;
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      // Latvian doctor detail - public URL is /zobarsti/{id}
      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: langAlternates,
        },
      });

      // English doctor detail - public URL is /en/doctors/{id}
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: langAlternates,
        },
      });
    }
  } catch (error) {
    console.error("Error processing dynamic doctor paths for sitemap:", error);
  }

  // 4. Add dynamic blog paths
  try {
    const blogs = getBlogPosts('lv');
    for (const blog of blogs) {
      const lvUrl = `${baseUrl}/blogs/${blog.id}`;
      const enUrl = `${baseUrl}/en/blogs/${blog.id}`;
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      // Latvian blog detail - public URL is /blogs/{id}
      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: langAlternates,
        },
      });

      // English blog detail - public URL is /en/blogs/{id}
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: langAlternates,
        },
      });
    }
  } catch (error) {
    console.error("Error processing dynamic blog paths for sitemap:", error);
  }

  // 5. Add dynamic custom Prismic pages (filtering out static paths, services, doctors, and blogs)
  try {
    const client = createClient();
    const prismicPages = await client.getAllByType('page', {
      lang: '*',
      pageSize: 100
    });
    
    // Build maps/lists to help filter known core paths quickly
    const knownServices = getServices('lv');
    const knownDoctors = getDoctors('lv');
    const knownBlogs = getBlogPosts('lv');

    for (const pageDoc of prismicPages) {
      const uid = pageDoc.uid;
      const lang = pageDoc.lang; // 'lv' or 'en-us'

      // Skip if the page matches one of our known core static routes or other dynamic content
      const isStaticOrKnown = staticPaths.some(p => p.en === `/${uid}` || p.lv === `/${uid}`) ||
        knownServices.some(s => s.id === uid) ||
        knownDoctors.some(d => d.id === uid) ||
        knownBlogs.some(b => b.id === uid) ||
        // Fallback checks for common routing equivalents
        uid === 'home' || uid === 'sakums' ||
        uid === 'zobardti'; // fallback doctor list uid

      if (isStaticOrKnown) continue;

      const lastModifiedDate = pageDoc.last_publication_date
        ? new Date(pageDoc.last_publication_date)
        : new Date();

      const isEn = lang === 'en-us';
      const currentPathSegment = isEn ? `/en/${uid}` : `/${uid}`;
      
      let alternatePathSegment = '';
      if (Array.isArray(pageDoc.alternate_languages) && pageDoc.alternate_languages.length > 0) {
        const alt = pageDoc.alternate_languages[0];
        if (alt && alt.uid) {
          alternatePathSegment = alt.lang === 'en-us' ? `/en/${alt.uid}` : `/${alt.uid}`;
        }
      }

      if (!alternatePathSegment) {
        // Fallback if no explicit translation is linked
        alternatePathSegment = isEn ? `/${uid}` : `/en/${uid}`;
      }

      const lvUrl = isEn ? `${baseUrl}${alternatePathSegment}` : `${baseUrl}${currentPathSegment}`;
      const enUrl = isEn ? `${baseUrl}${currentPathSegment}` : `${baseUrl}${alternatePathSegment}`;

      entries.push({
        url: isEn ? enUrl : lvUrl,
        lastModified: lastModifiedDate,
        changeFrequency: 'weekly',
        priority: 0.5,
        alternates: {
          languages: {
            'lv-LV': lvUrl,
            'en-US': enUrl,
            'x-default': lvUrl,
          }
        }
      });
    }
  } catch (error) {
    console.warn("Failed to fetch Prismic custom pages for sitemap.", error);
  }

  return entries;
}
