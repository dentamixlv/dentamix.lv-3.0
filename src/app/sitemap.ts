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

  // Helper to clean and format URLs properly (no double slashes, trailing slashes)
  const getCleanUrl = (path: string) => {
    let fullUrl = `${baseUrl}${path}`;
    fullUrl = fullUrl.replace(/([^:]\/)\/+/g, "$1");
    if (fullUrl.endsWith('/') && fullUrl !== 'https://dentamix.lv/') {
      fullUrl = fullUrl.slice(0, -1);
    }
    return fullUrl;
  };

  // Helper to check for 404 UIDs or paths
  const is404Page = (uid: string) => {
    const check = uid.toLowerCase();
    return check.includes('404') || check.includes('404-lv') || check.includes('404-en');
  };

  // 1. Add static paths
  try {
    for (const path of staticPaths) {
      const lvUrl = getCleanUrl(path.lv);
      const enUrl = getCleanUrl(`/en${path.en}`);
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

  // Define sets of static IDs to categorize Prismic page documents
  const serviceIds = new Set([
    ...getServices('lv').map(s => s.id.toLowerCase()),
    ...getServices('en-us').map(s => s.id.toLowerCase())
  ]);

  const doctorIds = new Set([
    ...getDoctors('lv').map(d => d.id.toLowerCase()),
    ...getDoctors('en-us').map(d => d.id.toLowerCase())
  ]);

  const blogIds = new Set([
    ...getBlogPosts('lv').map(b => b.id.toLowerCase()),
    ...getBlogPosts('en-us').map(b => b.id.toLowerCase())
  ]);

  // Sets to keep track of added items to prevent fallback duplication
  const addedServiceIds = new Set<string>();
  const addedDoctorIds = new Set<string>();

  // 2. Fetch and process dynamic Prismic pages
  try {
    const client = createClient();
    const prismicPages = await client.getAllByType('page', {
      lang: '*',
      pageSize: 100
    });

    for (const pageDoc of prismicPages) {
      const uid = pageDoc.uid;
      const lang = pageDoc.lang; // 'lv' or 'en-us'

      // Skip 404/error pages
      if (is404Page(uid)) {
        continue;
      }

      // Check if it is static path (e.g. about, contacts) or home page
      const isHome = uid === 'home' || uid === 'sakums';
      const isStatic = staticPaths.some(p => p.en === `/${uid}` || p.lv === `/${uid}`);
      if (isHome || isStatic) {
        continue;
      }

      // Skip pages that are actually blogs (handled separately in blog paths)
      const isBlog = blogIds.has(uid.toLowerCase()) ||
        pageDoc.alternate_languages?.some((alt: any) => alt.uid && blogIds.has(alt.uid.toLowerCase()));
      if (isBlog) {
        continue;
      }

      // Determine category: service, doctor, or custom/general page
      const isService = serviceIds.has(uid.toLowerCase()) ||
        pageDoc.alternate_languages?.some((alt: any) => alt.uid && serviceIds.has(alt.uid.toLowerCase()));

      const isDoctor = doctorIds.has(uid.toLowerCase()) || uid.toLowerCase().startsWith('dr-') ||
        pageDoc.alternate_languages?.some((alt: any) => alt.uid && (doctorIds.has(alt.uid.toLowerCase()) || alt.uid.toLowerCase().startsWith('dr-')));

      const isEn = lang === 'en-us';
      
      // Determine the alternate UID
      let altUid = '';
      if (Array.isArray(pageDoc.alternate_languages) && pageDoc.alternate_languages.length > 0) {
        altUid = pageDoc.alternate_languages[0].uid;
      }
      if (!altUid) {
        altUid = uid; // Fallback if no translation is linked
      }

      let currentPath = '';
      let alternatePath = '';
      let priority = 0.5;
      let changeFrequency: 'weekly' | 'monthly' = 'weekly';

      if (isService) {
        addedServiceIds.add(uid.toLowerCase());
        addedServiceIds.add(altUid.toLowerCase());
        
        currentPath = isEn ? `/en/services/${uid}` : `/pakalpojumi/${uid}`;
        alternatePath = isEn ? `/pakalpojumi/${altUid}` : `/en/services/${altUid}`;
        priority = 0.7;
        changeFrequency = 'monthly';
      } else if (isDoctor) {
        addedDoctorIds.add(uid.toLowerCase());
        addedDoctorIds.add(altUid.toLowerCase());
        
        currentPath = isEn ? `/en/doctors/${uid}` : `/zobarsti/${uid}`;
        alternatePath = isEn ? `/zobarsti/${altUid}` : `/en/doctors/${altUid}`;
        priority = 0.7;
        changeFrequency = 'monthly';
      } else {
        // Custom/general page
        currentPath = isEn ? `/en/${uid}` : `/${uid}`;
        alternatePath = isEn ? `/${altUid}` : `/en/${altUid}`;
        priority = 0.5;
        changeFrequency = 'weekly';
      }

      const lvUrl = getCleanUrl(isEn ? alternatePath : currentPath);
      const enUrl = getCleanUrl(isEn ? currentPath : alternatePath);

      // Skip adding if URLs themselves contain 404
      if (lvUrl.toLowerCase().includes('404') || enUrl.toLowerCase().includes('404')) {
        continue;
      }

      // Add to entries
      entries.push({
        url: isEn ? enUrl : lvUrl,
        lastModified: pageDoc.last_publication_date ? new Date(pageDoc.last_publication_date) : new Date(),
        changeFrequency,
        priority,
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
    console.warn("Failed to fetch Prismic pages for sitemap.", error);
  }

  // 3. Add dynamic service fallbacks (for services in static DB but not created in Prismic)
  try {
    const services = getServices('lv');
    for (const service of services) {
      const lowerId = service.id.toLowerCase();
      if (addedServiceIds.has(lowerId)) {
        continue;
      }

      const lvUrl = getCleanUrl(`/pakalpojumi/${service.id}`);
      const enUrl = getCleanUrl(`/en/services/${service.id}`);
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: langAlternates,
        },
      });

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
    console.error("Error processing dynamic service fallbacks for sitemap:", error);
  }

  // 4. Add dynamic doctor fallbacks (for doctors in static DB but not created in Prismic)
  try {
    const doctors = getDoctors('lv');
    for (const doctor of doctors) {
      const lowerId = doctor.id.toLowerCase();
      if (addedDoctorIds.has(lowerId)) {
        continue;
      }

      const lvUrl = getCleanUrl(`/zobarsti/${doctor.id}`);
      const enUrl = getCleanUrl(`/en/doctors/${doctor.id}`);
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: langAlternates,
        },
      });

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
    console.error("Error processing dynamic doctor fallbacks for sitemap:", error);
  }

  // 5. Add dynamic blog paths
  try {
    const blogs = getBlogPosts('lv');
    for (const blog of blogs) {
      const lvUrl = getCleanUrl(`/blogs/${blog.id}`);
      const enUrl = getCleanUrl(`/en/blogs/${blog.id}`);
      const langAlternates = {
        'lv-LV': lvUrl,
        'en-US': enUrl,
        'x-default': lvUrl,
      };

      // Latvian blog detail
      entries.push({
        url: lvUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: langAlternates,
        },
      });

      // English blog detail
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

  return entries;
}
