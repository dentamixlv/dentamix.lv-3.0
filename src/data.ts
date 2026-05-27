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
