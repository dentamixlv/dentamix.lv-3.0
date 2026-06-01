'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

import { getDoctors } from '../../data';
import { Doctor, GroupedWidget } from '../../types';
import ReusableCTABlock from '../../components/CTABlock';

export interface WidgetBlockSliceDefaultItem {
  widget_title?: string | null;
  widget_icon?: string | null;
  text?: string | null;
}

export interface WidgetBlockSlice {
  slice_type: "widget_block";
  primary: {
    image?: any;
    workplace_title?: string | null;
    cta_badge_text?: string | null;
    cta_title?: string | null;
    cta_description?: string | null;
    cta_button_text?: string | null;
    cta_link?: any;
    cta_link_blank?: boolean | null;
  };
  items: WidgetBlockSliceDefaultItem[];
}

type WidgetBlockProps = {
  slice: WidgetBlockSlice;
  context?: any;
};

export default function WidgetBlock({ slice, context }: WidgetBlockProps) {
  const params = useParams();
  const router = useRouter();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';

  let doctorId = typeof params?.id === 'string' ? params.id : '';
  const isAboutPage = !params?.id;
  if (!doctorId) {
    doctorId = 'dr-janis-berzins';
  }
  const fallbackDoc = getDoctors(langCode).find(d => d.id === doctorId);

  const image = slice.primary.image?.url || fallbackDoc?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';

  const items = slice.items || [];
  const hasItems = items.length > 0 && items.some(item => item.text && item.widget_title);

  // Group repeatable widgets dynamically
  const groupedWidgets: GroupedWidget[] = [];
  if (hasItems) {
    items.forEach(item => {
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
    // Reconstruct widgets from local fallback database
    if (fallbackDoc.specializations && fallbackDoc.specializations.length > 0) {
      groupedWidgets.push({
        title: isEn ? 'Specializations' : 'Specialitātes',
        icon: 'Award',
        items: fallbackDoc.specializations
      });
    }
    if (fallbackDoc.education && fallbackDoc.education.length > 0) {
      groupedWidgets.push({
        title: isEn ? 'Education' : 'Izglītība',
        icon: 'GraduationCap',
        items: fallbackDoc.education
      });
    }
    if (fallbackDoc.qualifications && fallbackDoc.qualifications.length > 0) {
      groupedWidgets.push({
        title: isEn ? 'Additional Qualifications' : 'Papildus kvalifikācija',
        icon: 'Award',
        items: fallbackDoc.qualifications
      });
    }
    const workplaces = fallbackDoc.workplaces || (fallbackDoc.workplace ? [fallbackDoc.workplace] : []);
    if (workplaces.length > 0) {
      groupedWidgets.push({
        title: fallbackDoc.workplaceTitle || (isEn ? 'Workplace' : 'Darba vieta'),
        icon: 'MapPin',
        items: workplaces
      });
    }
    if (fallbackDoc.languages && fallbackDoc.languages.length > 0) {
      groupedWidgets.push({
        title: isEn ? 'Languages' : 'Valodas',
        icon: 'Languages',
        items: fallbackDoc.languages
      });
    }
  }

  // CTA values
  const t = {
    bookTitle: isEn ? 'Book an Appointment' : 'Pieteikties uz vizīti',
    bookDesc: isEn 
      ? 'Book a consultation online.' 
      : 'Piesakieties vizītei vai konsultācijai tiešsaistē.',
    bookBtn: isEn ? 'Book' : 'Pieteikties',
    bookBadge: isEn ? 'Booking open' : 'Pieraksts atvērts'
  };

  const ctaBadge = slice.primary.cta_badge_text || t.bookBadge;
  const ctaTitle = slice.primary.cta_title || t.bookTitle;
  const ctaDesc = slice.primary.cta_description || t.bookDesc;
  const ctaButtonText = slice.primary.cta_button_text || t.bookBtn;
  const ctaLink = slice.primary.cta_link?.url || undefined;
  const ctaLinkBlank = slice.primary.cta_link_blank ?? false;

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  const fadeUpVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className="space-y-6"
    >
      {/* Portrait Image in Sidebar */}
      <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#efedec] bg-[#fbf9f8] shadow-sm hover:shadow-xl transition-shadow duration-300">
        <Image
          src={image}
          alt={fallbackDoc?.name || "Sidebar image"}
          fill
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-cover select-none"
        />
      </div>

      {/* Dynamic Widgets Card */}
      {groupedWidgets.length > 0 && (
        <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 space-y-6">
          {groupedWidgets.map((widget, idx) => {
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
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking CTA (only if not about page, or if cta fields are explicitly set) */}
      {(!isAboutPage || slice.primary.cta_title) && (
        <div className="mt-8">
          <ReusableCTABlock
            badgeText={ctaBadge}
            title={ctaTitle}
            description={ctaDesc}
            buttonText={ctaButtonText}
            onClick={!ctaLink ? handleBook : undefined}
            href={ctaLink}
            targetBlank={ctaLinkBlank}
            id="doctor-profile-cta-btn"
          />
        </div>
      )}
    </motion.div>
  );
}
