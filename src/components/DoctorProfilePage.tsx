'use client';

import { ArrowLeft, Award, GraduationCap, Languages, CalendarDays, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Doctor } from '../types';
import { getTestimonials } from '../data';
import TestimonialCard from './TestimonialCard';

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
    bookBtn: isEn ? 'Request Appointment' : 'Pieteikties vizītei'
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="py-16 md:py-24 max-w-7xl mx-auto px-6"
      id={`doctor-profile-page-${doctor.id}`}
    >
      {/* Header Metadata block - Centered and full-width */}
      <motion.div variants={fadeUpVariants} className="text-center w-full mb-12 animate-fade-in">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block text-center">
          {doctor.category === 'SPECIĀLISTE' || doctor.category === 'SPECIALIST' ? doctor.role : doctor.category}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight leading-tight mb-6 text-center w-full">
          {doctor.name}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium text-center max-w-2xl mx-auto">
          {doctor.description}
        </p>
      </motion.div>

      {/* Article Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
        {/* Main Content (Bio) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          <div className="text-base sm:text-lg leading-relaxed text-slate-800 space-y-6 font-normal">
            <p className="text-[#511B29] font-serif text-lg leading-relaxed border-l-2 border-[#de7c8a] pl-4 font-medium">
              {doctor.fullBio}
            </p>
          </div>

          {/* Testimonial Cards Section */}
          {doctorTestimonials.length > 0 && (
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

          {/* Booking Invite Box matching Blog style card */}
          <div className="p-6 bg-[#fbf9f8] rounded-2xl border border-[#efedec] mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#511B29]">
                {t.bookTitle}
              </h4>
              <p className="text-xs text-[#6a5b5e] leading-relaxed">
                {t.bookDesc}
              </p>
            </div>
            <button
              onClick={onBook}
              className="btn inline-flex items-center gap-2 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-6 py-3 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#511B29]/15 shrink-0"
            >
              <CalendarDays className="w-4 h-4" />
              {t.bookBtn}
            </button>
          </div>
        </motion.div>

        {/* Info Sidebar */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Doctor Portrait Image in Sidebar */}
          <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#efedec] bg-[#fbf9f8] shadow-sm">
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
              <ul className="space-y-2 text-xs text-[#6a5b5e]">
                {doctor.specializations.map((spec, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#de7c8a] font-bold">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            {doctor.education.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                  <GraduationCap className="w-4 h-4 text-[#de7c8a]" />
                  {t.education}
                </h3>
                <ul className="space-y-2 text-xs text-[#6a5b5e]">
                  <li className="flex gap-2">
                    <span className="text-[#de7c8a] font-bold">•</span>
                    <span>{doctor.education[0]}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Additional Qualifications */}
            {doctor.education.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                  <Award className="w-4 h-4 text-[#de7c8a]" />
                  {t.additionalQual}
                </h3>
                <ul className="space-y-2 text-xs text-[#6a5b5e]">
                  {doctor.education.slice(1).map((edu, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-[#de7c8a] font-bold">•</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Workplace */}
            {doctor.workplace && (
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                  <MapPin className="w-4 h-4 text-[#de7c8a]" />
                  {t.workplace}
                </h3>
                <ul className="space-y-2 text-xs text-[#6a5b5e]">
                  <li className="flex gap-2">
                    <span className="text-[#de7c8a] font-bold">•</span>
                    <span>{doctor.workplace}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Languages */}
            <div className="space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                <Languages className="w-4 h-4 text-[#de7c8a]" />
                {t.languages}
              </h3>
              <p className="text-xs text-[#6a5b5e] font-semibold leading-relaxed pt-1 flex items-start gap-2">
                <span className="text-[#de7c8a] font-bold shrink-0">•</span>
                <span>{doctor.languages.join(', ')}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back Button underneath */}
      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
          {t.back}
        </button>
      </div>
    </motion.div>
  );
}
