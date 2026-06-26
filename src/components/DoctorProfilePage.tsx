'use client';

import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { SliceZone, PrismicRichText, JSXMapSerializer } from '@prismicio/react';
import { components } from '../slices';
import { Doctor, GroupedWidget } from '../types';
import { getTestimonials } from '../data';
import TestimonialCard from './TestimonialCard';
import CTABlock from './CTABlock';

const richTextComponents = {
  paragraph: ({ children }: any) => <span className="inline">{children}</span>,
  hyperlink: ({ node, children }: any) => (
    <a 
      href={node.data.url} 
      target={node.data.target} 
      rel="noopener noreferrer" 
      className="text-[#de7c8a] hover:underline font-semibold"
    >
      {children}
    </a>
  )
};

const detailedBioSerializer: JSXMapSerializer = {
  paragraph: ({ node, children }: any) => {
    const text = node?.text || '';
    const trimmed = text.trim();
    if (
      trimmed.startsWith('-') || 
      trimmed.startsWith('•') || 
      trimmed.startsWith('*') || 
      /^\d+[\.\)]/.test(trimmed)
    ) {
      return <p className="mb-1.5 last:mb-0">{children}</p>;
    }
    return <p className="mb-4 last:mb-0">{children}</p>;
  },
  list: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>,
  oList: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>,
  listItem: ({ children }) => <li className="leading-relaxed">{children}</li>,
  heading1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-[#511B29] mt-8 mb-4">{children}</h1>,
  heading2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-[#511B29] mt-6 mb-3">{children}</h2>,
  heading3: ({ children }) => <h3 className="text-xl font-serif font-bold text-[#511B29] mt-5 mb-2">{children}</h3>,
  heading4: ({ children }) => <h4 className="text-lg font-serif font-bold text-[#511B29] mt-4 mb-2">{children}</h4>,
  heading5: ({ children }) => <h5 className="text-base font-serif font-bold text-[#511B29] mt-4 mb-2">{children}</h5>,
  heading6: ({ children }) => <h6 className="text-sm font-serif font-bold text-[#511B29] mt-4 mb-2">{children}</h6>,
};

interface DoctorProfilePageProps {
  doctor: Doctor;
  onBack: () => void;
  onBook: () => void;
  langCode?: string;
  hideBack?: boolean;
}

export default function DoctorProfilePage({ doctor, onBack, onBook, langCode = 'lv', hideBack = false }: DoctorProfilePageProps) {
  const isEn = langCode === 'en-us';

  const allTestimonials = getTestimonials(langCode);
  const doctorTestimonials = allTestimonials.filter((item) => {
    const itemDoc = item.doctor.toLowerCase().replace(/ā/g, 'a').replace(/ī/g, 'i').replace(/š/g, 's').replace(/ņ/g, 'n').replace(/ē/g, 'e').replace(/ž/g, 'z').replace(/č/g, 'c').replace(/ļ/g, 'l');
    const targetDoc = doctor.name.toLowerCase().replace(/ā/g, 'a').replace(/ī/g, 'i').replace(/š/g, 's').replace(/ņ/g, 'n').replace(/ē/g, 'e').replace(/ž/g, 'z').replace(/č/g, 'c').replace(/ļ/g, 'l');
    return itemDoc.includes(targetDoc) || targetDoc.includes(itemDoc);
  });

  // Dynamically resolve widgets list, backing up with local doctor properties if empty
  const widgets: GroupedWidget[] = [];
  if (doctor.widgets && doctor.widgets.length > 0) {
    widgets.push(...doctor.widgets);
  } else {
    if (doctor.specializations && doctor.specializations.length > 0) {
      widgets.push({
        title: isEn ? 'Specializations' : 'Specialitātes',
        icon: 'Award',
        items: doctor.specializations
      });
    }
    if (doctor.education && doctor.education.length > 0) {
      widgets.push({
        title: isEn ? 'Education' : 'Izglītība',
        icon: 'GraduationCap',
        items: doctor.education
      });
    }
    if (doctor.qualifications && doctor.qualifications.length > 0) {
      widgets.push({
        title: isEn ? 'Additional Qualifications' : 'Papildus kvalifikācija',
        icon: 'Award',
        items: doctor.qualifications
      });
    }
    const workplaces = doctor.workplaces || (doctor.workplace ? [doctor.workplace] : []);
    if (workplaces.length > 0) {
      widgets.push({
        title: doctor.workplaceTitle || (isEn ? 'Workplace' : 'Darba vieta'),
        icon: 'MapPin',
        items: workplaces
      });
    }
    if (doctor.languages && doctor.languages.length > 0) {
      widgets.push({
        title: isEn ? 'Languages' : 'Valodas',
        icon: 'Languages',
        items: doctor.languages
      });
    }
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'tween', ease: 'easeOut', duration: 0.55 }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start text-left">
        {/* Main Content (Bio) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          <div className="space-y-6">
            <p className="text-base md:text-lg font-serif font-medium text-[#511B29] leading-relaxed border-l-2 border-[#de7c8a] pl-4">
              {doctor.fullBio}
            </p>
          </div>

          {/* Under doctor detailed text */}
          {doctor.detailedBio && (
            <div className="text-base text-[#6a5b5e] leading-relaxed mt-6">
              <PrismicRichText field={doctor.detailedBio} components={detailedBioSerializer} />
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
              priority
            />
          </div>

          {/* Credentials Card */}
          <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 space-y-6">
            {widgets.map((widget, idx) => {
              // Resolve Lucide icon component dynamically (handles lowercase/PascalCase formats)
              const name = widget.icon.charAt(0).toUpperCase() + widget.icon.slice(1);
              const IconComponent = (LucideIcons as any)[name] || (LucideIcons as any)[widget.icon] || LucideIcons.Award;
              return (
                <div key={idx} className="space-y-3">
                  <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
                    <IconComponent className="w-4 h-4 text-[#de7c8a]" />
                    {widget.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-[#6a5b5e]">
                    {widget.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex gap-2">
                        <span className="text-[#de7c8a] font-bold">•</span>
                        {typeof item === 'string' ? (
                          <span>{item}</span>
                        ) : (
                          <span className="inline-block rich-text-widget-item">
                            <PrismicRichText field={item} components={richTextComponents} />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Back Button underneath */}
      {!hideBack && (
        <div className="mt-16 md:mt-24 text-center">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
            {t.back}
          </button>
        </div>
      )}
    </motion.div>
  );
}
