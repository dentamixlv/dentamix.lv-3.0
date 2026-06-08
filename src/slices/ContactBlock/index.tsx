'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, ArrowRight, AlertCircle, Map, Navigation } from 'lucide-react';
import { useParams } from 'next/navigation';

interface ContactBlockItem {
  badge_text?: string | null;
  title?: string | null;
  phone?: string | null;
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
  gmaps_direct_url?: string | null;
  map_title?: string | null;
  waze_url?: string | null;
  waze_title?: string | null;
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
          const rawDirectUrl = item.gmaps_direct_url || '';
          const wazeUrl     = item.waze_url || '';
          const mapTitle    = item.map_title || '';
          const wazeTitle   = item.waze_title || '';

          // Check if the user entered a direct share URL instead of an iframe embed URL
          const isShareLink = rawMapUrl.includes('maps.app.goo.gl') || (rawMapUrl.includes('google.com/maps') && !rawMapUrl.includes('embed'));

          const mapUrl = isShareLink ? '' : rawMapUrl;
          const directUrl = rawDirectUrl || (isShareLink ? rawMapUrl : '');

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
                          {mapTitle || (isEn ? 'Google Maps' : 'Karte')}
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
                              <span className={`text-right font-bold ${isClosed(wdHours) ? 'text-[#6A5B5E]' : 'text-[#511B29]'}`}>{wdHours}</span>
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

                {/* Direct Google Maps Link Button */}
                {directUrl && (
                  <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                    <a
                      href={directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#511B29] hover:text-[#5d1726] transition-colors cursor-pointer group-hover:text-[#5d1726]"
                    >
                      <span>{isEn ? 'Open in Google Maps' : 'Skatīt Google Maps'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
