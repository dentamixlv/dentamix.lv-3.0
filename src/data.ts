import { Doctor, Service, Clinic, BlogPost, GroupedWidget } from './types';

import { DOCTORS_LV, DOCTORS_EN } from './data/doctors';
import { SERVICES_LV, SERVICES_EN } from './data/services';
import { CLINICS_LV, CLINICS_EN } from './data/clinics';
import { BLOG_POSTS_LV, BLOG_POSTS_EN } from './data/blogs';
import { TESTIMONIALS_LV, TESTIMONIALS_EN, getTestimonials } from './data/testimonials';

// Re-export specific locale arrays
export { DOCTORS_LV, DOCTORS_EN };
export { SERVICES_LV, SERVICES_EN };
export { CLINICS_LV, CLINICS_EN };
export { BLOG_POSTS_LV, BLOG_POSTS_EN };
export { TESTIMONIALS_LV, TESTIMONIALS_EN };

// Default exports for backward compatibility
export const DOCTORS = DOCTORS_LV;
export const SERVICES = SERVICES_LV;
export const CLINICS = CLINICS_LV;
export const BLOG_POSTS = BLOG_POSTS_LV;
export const TESTIMONIALS = TESTIMONIALS_LV;

// Locale helper functions
export function getDoctors(lang: string): Doctor[] {
  return lang === 'en-us' ? DOCTORS_EN : DOCTORS_LV;
}

export function getServices(lang: string): Service[] {
  return lang === 'en-us' ? SERVICES_EN : SERVICES_LV;
}

export function getClinics(lang: string): Clinic[] {
  return lang === 'en-us' ? CLINICS_EN : CLINICS_LV;
}

export function getBlogPosts(lang: string): BlogPost[] {
  return lang === 'en-us' ? BLOG_POSTS_EN : BLOG_POSTS_LV;
}

export { getTestimonials };

export function extractDoctorFromPage(pageDoc: any): Doctor | null {
  if (!pageDoc || !pageDoc.data || !Array.isArray(pageDoc.data.slices)) return null;
  
  const slice = pageDoc.data.slices.find(
    (s: any) => s.slice_type === 'widget_block'
  );
  if (!slice) return null;

  const doctorId = pageDoc.uid || '';
  const langCode = pageDoc.lang || 'lv';
  const fallbackDoc = getDoctors(langCode).find(d => d.id === doctorId);

  const formatUidToName = (uid: string) => {
    return uid
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const name = fallbackDoc?.name || formatUidToName(doctorId);
  const category = fallbackDoc?.category || '';
  const role = fallbackDoc?.role || '';
  const description = fallbackDoc?.description || '';
  
  const pageBlockSlice = pageDoc.data.slices.find(
    (s: any) => s.slice_type === 'page_block'
  );

  const fullBioText = pageBlockSlice && Array.isArray(pageBlockSlice.primary.excerpt) && pageBlockSlice.primary.excerpt.length > 0
    ? pageBlockSlice.primary.excerpt.map((block: any) => block.text).join('\n')
    : (typeof pageBlockSlice?.primary.excerpt === 'string' ? pageBlockSlice.primary.excerpt : fallbackDoc?.fullBio || '');

  const detailedBio = pageBlockSlice?.primary.content || fallbackDoc?.detailedBio || null;
  const image = slice.primary.image?.url || fallbackDoc?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
  const workplaceTitle = slice.primary.workplace_title || fallbackDoc?.workplaceTitle || undefined;

  const items = slice.items || [];
  const hasItems = items.length > 0 && items.some((item: any) => item.text && item.widget_title);

  // Group repeatable widgets dynamically
  const groupedWidgets: GroupedWidget[] = [];
  if (hasItems) {
    items.forEach((item: any) => {
      if (!item.text || !item.widget_title) return;
      const title = item.widget_title.trim();
      const icon = item.widget_icon?.trim() || 'Award';
      
      let group = groupedWidgets.find(g => g.title === title);
      if (!group) {
        group = { title, icon, items: [] };
        groupedWidgets.push(group);
      }
      group.items.push(item.text.trim());
    });
  } else if (fallbackDoc) {
    if (fallbackDoc.specializations && fallbackDoc.specializations.length > 0) {
      groupedWidgets.push({
        title: langCode === 'en-us' ? 'Specializations' : 'Specialitātes',
        icon: 'Award',
        items: fallbackDoc.specializations
      });
    }
    if (fallbackDoc.education && fallbackDoc.education.length > 0) {
      groupedWidgets.push({
        title: langCode === 'en-us' ? 'Education' : 'Izglītība',
        icon: 'GraduationCap',
        items: fallbackDoc.education
      });
    }
    if (fallbackDoc.qualifications && fallbackDoc.qualifications.length > 0) {
      groupedWidgets.push({
        title: langCode === 'en-us' ? 'Additional Qualifications' : 'Papildus kvalifikācija',
        icon: 'Award',
        items: fallbackDoc.qualifications
      });
    }
    const workplaces = fallbackDoc.workplaces || (fallbackDoc.workplace ? [fallbackDoc.workplace] : []);
    if (workplaces.length > 0) {
      groupedWidgets.push({
        title: fallbackDoc.workplaceTitle || (langCode === 'en-us' ? 'Workplace' : 'Darba vieta'),
        icon: 'MapPin',
        items: workplaces
      });
    }
    if (fallbackDoc.languages && fallbackDoc.languages.length > 0) {
      groupedWidgets.push({
        title: langCode === 'en-us' ? 'Languages' : 'Valodas',
        icon: 'Languages',
        items: fallbackDoc.languages
      });
    }
  }

  // Look for other slices on this page (like TestimonialBlock) to embed
  const embeddedSlices = pageDoc.data.slices.filter(
    (s: any) => s !== slice && s.slice_type !== 'page_title'
  );

  return {
    id: doctorId || 'doctor-detail',
    name,
    title: name,
    category,
    role,
    description,
    fullBio: fullBioText,
    detailedBio,
    image,
    specializations: fallbackDoc?.specializations || [],
    education: fallbackDoc?.education || [],
    languages: fallbackDoc?.languages || [],
    workplaceTitle,
    slices: embeddedSlices,
    widgets: groupedWidgets
  };
}

