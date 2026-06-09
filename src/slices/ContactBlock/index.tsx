'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, ArrowRight, AlertCircle, Map, Navigation, Star } from 'lucide-react';
import { useParams } from 'next/navigation';

interface ContactBlockItem {
  badge_text?: string | null;
  title?: string | null;
  phone?: string | null;
  whatsapp_text?: string | null;
  whatsapp_url?: string | null;
  address?: string | null;
  email?: string | null;
  working_hours_label?: string | null;
  weekday_text?: string | null;
  saturday_text?: string | null;
  sunday_text?: string | null;
  weekday_hours?: string | null;
  saturday_hours?: string | null;
  sunday_hours?: string | null;
  accessibility_text?: string | null;
  gmaps_iframe_url?: string | null;
  waze_url?: string | null;
  waze_title?: string | null;
  review_url?: string | null;
  review_title?: string | null;
}

interface ContactBlockSlice {
  primary: {};
  items: ContactBlockItem[];
}

interface ContactBlockProps {
  slice: ContactBlockSlice;
}

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
} as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

export default function ContactBlock({ slice }: ContactBlockProps) {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';

  const isClosed = (hours: string) => {
    const h = hours.toLowerCase();
    return h.includes('slēgts') || h.includes('closed') || h.includes('slegts') || h === '-';
  };

  const sectionClass = 'pt-2 pb-16 md:pt-4 md:pb-24';

  return (
    <div className={`${sectionClass} max-w-7xl mx-auto px-6`}>
      {/* Clinics address blocks and maps */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {slice.items.map((item, idx) => {
          const branchBadge = item.badge_text || '';
          const branchTitle = item.title || '';
          const phoneVal    = item.phone || '';
          const whatsappText = item.whatsapp_text || '';
          const whatsappUrl  = item.whatsapp_url || '';
          const addressVal  = item.address || '';
          const emailVal    = item.email || '';
          const whLabel     = item.working_hours_label || '';
          const wdText      = item.weekday_text || '';
          const satText     = item.saturday_text || '';
          const sunText     = item.sunday_text || '';
          const wdHours     = item.weekday_hours || '';
          const satHours    = item.saturday_hours || '';
          const sunHours    = item.sunday_hours || '';
          const accText     = item.accessibility_text || '';
          const rawMapUrl   = item.gmaps_iframe_url || '';
          const wazeUrl     = item.waze_url || '';
          const wazeTitle   = item.waze_title || '';
          const reviewUrl   = item.review_url || '';
          const reviewTitle = item.review_title || '';

          // Check if the user entered a direct share URL instead of an iframe embed URL
          const isShareLink = rawMapUrl.includes('maps.app.goo.gl') || (rawMapUrl.includes('google.com/maps') && !rawMapUrl.includes('embed'));

          const mapUrl = isShareLink ? '' : rawMapUrl;
          const directUrl = isShareLink ? rawMapUrl : '';

          return (
            <motion.div 
              variants={fadeUpVariants}
              key={idx} 
              className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group"
              id={`contact-block-branch-${idx}`}
            >
              {/* Upper Card Map visual block */}
              {mapUrl ? (
                <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-[#efedec]">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={branchTitle}
                    className="grayscale-[20%] opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ) : (
                // Fallback placeholder block if no embed map is provided
                <div className="relative aspect-[4/3] w-full bg-[#fbf9f8] overflow-hidden border-b border-[#efedec] flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-[#de7c8a]/40" />
                </div>
              )}

              {/* Card content */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  {/* Upper tag detail */}
                  {branchBadge && (
                    <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                      {branchBadge}
                    </span>
                  )}
                  <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors mb-4">
                    {directUrl ? (
                      <a href={directUrl} target="_blank" rel="noopener noreferrer">
                        {branchTitle}
                      </a>
                    ) : (
                      branchTitle
                    )}
                  </h3>

                  {/* Info details in a single continuous vertical list */}
                  <div className="space-y-4 my-6 text-sm text-[#6A5B5E]">
                    {/* Phone */}
                    {phoneVal && (
                      <a 
                        href={`tel:${phoneVal.replace(/\s+/g, '')}`}
                        className="flex items-center gap-2 font-bold text-[#511B29] hover:text-[#5d1726]/80 transition-colors w-fit"
                      >
                        <Phone className="w-4 h-4 text-[#de7c8a] shrink-0" />
                        <span>{phoneVal}</span>
                      </a>
                    )}

                    {/* WhatsApp */}
                    {whatsappText && (
                      <a 
                        href={whatsappUrl || `https://wa.me/${whatsappText.replace(/[^0-9]/g, '')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-bold text-[#511B29] hover:text-[#5d1726]/80 transition-colors w-fit"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0 text-[#de7c8a]" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>{whatsappText}</span>
                      </a>
                    )}
                    {/* Address */}
                    {addressVal && (
                      <p className="flex items-start gap-2 text-[#6A5B5E] font-medium leading-relaxed">
                        <MapPin className="w-4 h-4 text-[#de7c8a] shrink-0 mt-0.5" />
                        {directUrl ? (
                          <a 
                            href={directUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-[#5d1726] hover:underline transition-colors"
                          >
                            {addressVal}
                          </a>
                        ) : (
                          <span>{addressVal}</span>
                        )}
                      </p>
                    )}
                    {/* Email */}
                    {emailVal && (
                      <p className="flex items-center gap-2 font-medium">
                        <Mail className="w-4 h-4 text-[#de7c8a] shrink-0" />
                        <span className="truncate">{emailVal}</span>
                      </p>
                    )}

                    {/* Karte */}
                    {directUrl && (
                      <p className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#de7c8a] shrink-0" />
                        <a 
                          href={directUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-[#5d1726] hover:underline transition-colors font-medium"
                        >
                          {isEn ? 'Google Maps' : 'Karte'}
                        </a>
                      </p>
                    )}

                    {/* Waze */}
                    {wazeUrl && (
                      <p className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-[#de7c8a] shrink-0" />
                        <a 
                          href={wazeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-[#5d1726] hover:underline transition-colors font-medium"
                        >
                          {wazeTitle || 'Waze'}
                        </a>
                      </p>
                    )}

                    {/* Review Link */}
                    {reviewUrl && (
                      <p className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#de7c8a] shrink-0" />
                        <a 
                          href={reviewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-[#5d1726] hover:underline transition-colors font-medium"
                        >
                          {reviewTitle || (isEn ? 'Write a review' : 'Pievieno atsauksmi')}
                        </a>
                      </p>
                    )}

                    {/* Working hours as sub-list within the vertical list */}
                    {whLabel && (
                      <div className="pt-4 border-t border-[#efedec]/60">
                        <p className="text-[#6A5B5E] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                          <Clock className="w-3.5 h-3.5 text-[#de7c8a]" />
                          {whLabel}
                        </p>
                        <div className="space-y-2 pl-5 font-medium text-sm">
                          {wdText && (
                            <p className="flex justify-between w-full">
                              <span>{wdText}</span>
                              <span className={`text-right ${isClosed(wdHours) ? 'text-[#6A5B5E]' : 'text-[#511B29]'}`}>{wdHours}</span>
                            </p>
                          )}
                          {satText && (
                            <p className="flex justify-between w-full">
                              <span>{satText}</span>
                              <span className={`text-right ${isClosed(satHours) ? 'text-[#6A5B5E]' : 'text-[#511B29]'}`}>
                                {satHours}
                              </span>
                            </p>
                          )}
                          {sunText && (
                            <p className="flex justify-between w-full">
                              <span>{sunText}</span>
                              <span className={`text-right ${isClosed(sunHours) ? 'text-[#6A5B5E]' : 'text-[#511B29]'}`}>
                                {sunHours}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accessibility */}
                    {accText && (
                      <p className="flex items-start gap-2 pt-4 border-t border-[#efedec]/60 text-[#6A5B5E] font-medium leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{accText}</span>
                      </p>
                    )}
                  </div>
                </div>


              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
