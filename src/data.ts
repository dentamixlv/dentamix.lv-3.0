import { Doctor, Service, Clinic, BlogPost } from './types';

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
    (s: any) => s.slice_type === 'doctor_block'
  );
  if (!slice) return null;

  const name = slice.primary.name || '';
  const category = slice.primary.category || '';
  const role = slice.primary.role || '';
  const description = slice.primary.description || '';
  
  const fullBioText = Array.isArray(slice.primary.fullBio) && slice.primary.fullBio.length > 0
    ? slice.primary.fullBio.map((block: any) => block.text).join('\n')
    : (typeof slice.primary.fullBio === 'string' ? slice.primary.fullBio : '');

  const detailedBio = slice.primary.detailedBio || null;
  const image = slice.primary.image?.url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
  const workplaceTitle = slice.primary.workplace_title || undefined;

  const items = slice.items || [];
  const hasItems = items.length > 0 && items.some((item: any) => item.text);

  const specializations = hasItems
    ? items.filter((item: any) => item.item_type === 'Specialization' && item.text).map((item: any) => item.text as string)
    : [];

  const education = hasItems
    ? items.filter((item: any) => item.item_type === 'Education' && item.text).map((item: any) => item.text as string)
    : [];

  const qualifications = hasItems
    ? items.filter((item: any) => item.item_type === 'Qualification' && item.text).map((item: any) => item.text as string)
    : [];

  const workplaces = hasItems
    ? items.filter((item: any) => item.item_type === 'Workplace' && item.text).map((item: any) => item.text as string)
    : [];

  const languages = hasItems
    ? items.filter((item: any) => item.item_type === 'Language' && item.text).map((item: any) => item.text as string)
    : [];

  // Look for other slices on this page (like TestimonialBlock) to embed
  const embeddedSlices = pageDoc.data.slices.filter(
    (s: any) => s !== slice && s.slice_type !== 'page_title'
  );

  return {
    id: pageDoc.uid || 'doctor-detail',
    name,
    title: name,
    category,
    role,
    description,
    fullBio: fullBioText,
    detailedBio,
    image,
    specializations,
    education,
    qualifications,
    workplaces,
    languages,
    workplaceTitle,
    slices: embeddedSlices
  };
}

