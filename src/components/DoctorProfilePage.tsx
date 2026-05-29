'use client';

import { ArrowLeft, Award, GraduationCap, Languages, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { SliceZone } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import { components } from '../slices';
import { Doctor } from '../types';
import { getTestimonials } from '../data';
import TestimonialCard from './TestimonialCard';
import CTABlock from './CTABlock';

interface DoctorProfilePageProps {
  doctor: Doctor;
  onBack: () => void;
  onBook: () => void;
  langCode?: string;
}

export default function DoctorProfilePage({ doctor, onBack, onBook, langCode = 'lv' }: DoctorProfilePageProps) {
  const isEn = langCode === 'en-us';

  const allTestimonials = getTestimonials(langCode);
  const doctorTestimonials = allTestimonials.filter((item) => {
    const itemDoc = item.doctor.toLowerCase().replace(/ā/g, 'a').replace(/ī/g, 'i').replace(/š/g, 's').replace(/ņ/g, 'n').replace(/ē/g, 'e').replace(/ž/g, 'z').replace(/č/g, 'c').replace(/ļ/g, 'l');
    const targetDoc = doctor.name.toLowerCase().replace(/ā/g, 'a').replace(/ī/g, 'i').replace(/š/g, 's').replace(/ņ/g, 'n').replace(/ē/g, 'e').replace(/ž/g, 'z').replace(/č/g, 'c').replace(/ļ/g, 'l');
    return itemDoc.includes(targetDoc) || targetDoc.includes(itemDoc);
  });

  const fadeUpVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  } as const;

  const t = {
    specializations: isEn ? 'Specializations' : 'Specialitātes',
    education: isEn ? 'Education' : 'Izglītība',
    additionalQual: isEn ? 'Additional Qualifications' : 'Papildus kvalifikācija',
    languages: isEn ? 'Languages' : 'Valodas',
    workplace: isEn ? 'Workplace' : 'Darba vieta',
    back: isEn ? 'Back to Dentists' : 'Atpakaļ pie zobārstiem',
    bookTitle: isEn ? 'Book an Appointment' : 'Pieteikties uz vizīti',
    bookDesc: isEn 
      ? 'Book a consultation with this specialist online. The scheduling process takes less than a minute.' 
      : 'Piesakieties vizītei vai konsultācijai pie šī speciālista tiešsaistē. Pieteikšanās aizņem mazāk par minūti.',
    bookBtn: isEn ? 'Request Appointment' : 'Pieteikties vizītei',
    bookBadge: isEn ? 'Booking open' : 'Pieraksts atvērts'
  };

  // CTA values — use Prismic fields if set, else hardcoded defaults
  const ctaBadge = doctor.ctaBadgeText || t.bookBadge;
  const ctaTitle = doctor.ctaTitle || t.bookTitle;
  const ctaDesc = doctor.ctaDescription || t.bookDesc;
  const ctaButtonText = doctor.ctaButtonText || t.bookBtn;
  const ctaLink = doctor.ctaLink || undefined;
  const ctaLinkBlank = doctor.ctaLinkBlank ?? false;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="pt-2 pb-16 md:pt-4 md:pb-24 max-w-7xl mx-auto px-6"
      id={`doctor-profile-page-${doctor.id}`}
    >
      {/* Article Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
        {/* Main Content (Bio) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          <div className="space-y-6">
            <p className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">
              {doctor.fullBio}
            </p>
          </div>

          {/* Under doctor detailed text */}
          {doctor.detailedBio && (
            <div className="text-base text-[#6a5b5e] leading-relaxed space-y-6 mt-6">
              <PrismicRichText field={doctor.detailedBio} />
            </div>
          )}

          {/* Dynamic embedded slices (like TestimonialBlock or others) */}
          {doctor.slices && doctor.slices.length > 0 && (
            <div className="pt-8 border-t border-[#efedec]/60">
              <SliceZone slices={doctor.slices} components={components} context={{ isEmbedded: true }} />
            </div>
          )}

          {/* Testimonial Cards Section */}
          {(!doctor.slices || !doctor.slices.some(s => s.slice_type === 'testimonial_block' || s.slice_type === 'testimonial_grid')) && doctorTestimonials.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-[#efedec]/60">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#511B29]">
                {isEn ? 'Patient Reviews' : 'Pacientu atsauksmes'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctorTestimonials.map((item) => (
                  <TestimonialCard 
                    key={item.id} 
                    item={item} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTA Block — redesigned using reusable CTABlock component */}
          <div className="mt-8">
            <CTABlock
              badgeText={ctaBadge}
              title={ctaTitle}
              description={ctaDesc}
              buttonText={ctaButtonText}
              onClick={!ctaLink ? onBook : undefined}
              href={ctaLink}
              targetBlank={ctaLinkBlank}
              id="doctor-profile-cta-btn"
            />
          </div>
        </motion.div>

        {/* Info Sidebar */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Doctor Portrait Image in Sidebar */}
          <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#efedec] bg-[#fbf9f8] shadow-sm hover:shadow-xl transition-shadow duration-300">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover select-none"
            />
          </div>

          {/* Credentials Card */}
          <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 space-y-6">
            {/* Specializations */}
            <div className="space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                <Award className="w-4 h-4 text-[#de7c8a]" />
                {t.specializations}
              </h3>
              <ul className="space-y-2 text-sm text-[#6a5b5e]">
                {doctor.specializations.map((spec, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#de7c8a] font-bold">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            {doctor.education && doctor.education.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                  <GraduationCap className="w-4 h-4 text-[#de7c8a]" />
                  {t.education}
                </h3>
                <ul className="space-y-2 text-sm text-[#6a5b5e]">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-[#de7c8a] font-bold">•</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Qualifications */}
            {doctor.qualifications && doctor.qualifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                  <Award className="w-4 h-4 text-[#de7c8a]" />
                  {t.additionalQual}
                </h3>
                <ul className="space-y-2 text-sm text-[#6a5b5e]">
                  {doctor.qualifications.map((qual, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-[#de7c8a] font-bold">•</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Workplace */}
            {((doctor.workplaces && doctor.workplaces.length > 0) || doctor.workplace) && (
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                  <MapPin className="w-4 h-4 text-[#de7c8a]" />
                  {doctor.workplaceTitle || t.workplace}
                </h3>
                <ul className="space-y-2 text-sm text-[#6a5b5e]">
                  {doctor.workplaces && doctor.workplaces.length > 0 ? (
                    doctor.workplaces.map((wp, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-[#de7c8a] font-bold">•</span>
                        <span>{wp}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex gap-2">
                      <span className="text-[#de7c8a] font-bold">•</span>
                      <span>{doctor.workplace}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Languages */}
            <div className="space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                <Languages className="w-4 h-4 text-[#de7c8a]" />
                {t.languages}
              </h3>
              <ul className="space-y-2 text-sm text-[#6a5b5e]">
                {doctor.languages.map((lang, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#de7c8a] font-bold">•</span>
                    <span>{lang}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back Button underneath */}
      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
          {t.back}
        </button>
      </div>
    </motion.div>
  );
}
