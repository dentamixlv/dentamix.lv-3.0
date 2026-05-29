'use client';

import React from 'react';
import { MapPin, Phone, Mail, Map, Navigation } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getClinics } from '../data';

interface FooterProps {
  logoText?: string;
  logoImage?: any;
  description?: string;
  clinicsTitle?: string;
  workingHoursTitle?: string;
  clinics?: Array<{
    name: string;
    address: string;
    phone: string;
    email: string;
    workHoursWeekdays: string;
    workHoursSaturday: string;
    workHoursSunday: string;
    labelWeekdays?: string;
    labelSaturday?: string;
    labelSunday?: string;
    accessibilityAlert?: string;
    mapTitle?: string;
    mapUrl?: string;
    wazeTitle?: string;
    wazeUrl?: string;
  }>;
  copyrightText?: string;
  privacyPolicyLabel?: string;
  privacyPolicyLink?: any;
  cookiePolicyLabel?: string;
  cookiePolicyLink?: any;
}

export default function Footer({
  logoText,
  logoImage,
  description,
  clinicsTitle,
  workingHoursTitle,
  clinics: clinicsProp,
  copyrightText,
  privacyPolicyLabel,
  privacyPolicyLink,
  cookiePolicyLabel,
  cookiePolicyLink
}: FooterProps) {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');

  const t = {
    quote: isEn ? '"Modern dental technologies and experienced specialists for your smile\'s health. We provide the highest quality dental services in a comfortable environment in Riga and Adazi."' : '"Modernas zobārstniecības tehnoloģijas un pieredzējuši speciālisti Jūsu smaida veselībai. Mēs nodrošinām augstākās kvalitātes zobārstniecības pakalpojumus ērtā vidē Rīgā un Ādažos."',
    ourClinics: isEn ? 'Our Clinics' : 'Mūsu Klīnikas',
    workingHours: isEn ? 'Working Hours' : 'Darba Laiks',
    weekdays: isEn ? 'Weekdays:' : 'Darba dienas:',
    saturday: isEn ? 'Saturday:' : 'Sestdiena:',
    sunday: isEn ? 'Sunday:' : 'Svētdiena:',
    closed: isEn ? 'Closed' : 'Slēgts',
    allRightsReserved: isEn ? 'All rights reserved.' : 'Visas tiesības aizsargātas.',
    patientSafety: isEn ? 'Patient Safety' : 'Pacientu drošība',
    cookieSettings: isEn ? 'Cookie Settings' : 'Sīkdatņu iestatījumi',
    map: isEn ? 'Map' : 'Karte'
  };

  const clinicsToRender = clinicsProp && clinicsProp.length > 0
    ? clinicsProp.map((c, idx) => ({
        id: `dynamic-${idx}`,
        name: c.name,
        address: c.address,
        phone: c.phone,
        email: c.email,
        gmapsLink: c.mapUrl || (c.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}` : undefined),
        waze: c.wazeUrl || (c.address ? `https://waze.com/ul?q=${encodeURIComponent(c.address)}` : undefined),
        mapTitle: c.mapTitle,
        wazeTitle: c.wazeTitle,
        workHours: {
          weekdays: c.workHoursWeekdays ? `P. - Pk.: ${c.workHoursWeekdays}` : '',
          saturday: c.workHoursSaturday ? `S.: ${c.workHoursSaturday}` : '',
          sunday: c.workHoursSunday ? `Sv.: ${c.workHoursSunday}` : '',
        },
        labels: {
          weekdays: c.labelWeekdays || t.weekdays,
          saturday: c.labelSaturday || t.saturday,
          sunday: c.labelSunday || t.sunday,
          closed: t.closed,
        },
        accessibilityAlert: c.accessibilityAlert
      }))
    : getClinics(isEn ? 'en-us' : 'lv').map((clinic) => ({
        ...clinic,
        mapTitle: undefined,
        wazeTitle: undefined,
        workHours: {
          weekdays: clinic.workHours.weekdays,
          saturday: clinic.workHours.saturday,
          sunday: clinic.workHours.sunday,
        },
        labels: {
          weekdays: t.weekdays,
          saturday: t.saturday,
          sunday: t.sunday,
          closed: t.closed,
        },
        accessibilityAlert: clinic.accessibilityAlert
      }));

  const getHoursValue = (hoursString: string) => {
    if (!hoursString) return '';
    if (hoursString.includes(': ')) {
      return hoursString.split(': ').slice(1).join(': ');
    }
    return hoursString;
  };

  const resolveLink = (linkField: any) => {
    if (!linkField?.url) return undefined;
    let url = linkField.url;
    if (url.startsWith('/') && !url.startsWith('//')) {
      const hasPrefix = url.startsWith('/en/') || url.startsWith('/lv/') || url === '/en' || url === '/lv';
      if (!hasPrefix && isEn) {
        url = `/en${url}`;
      }
    }
    return url;
  };

  return (
    <footer className="bg-[#151617] text-white border-t border-[#252728]">
      {/* Logo Row - Left aligned, full width on its own line like header logo */}
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 flex items-center justify-start">
        <Link 
          href={isEn ? '/en' : '/'} 
          className="inline-block cursor-pointer group"
          id="footer-logo-button"
        >
          {logoImage?.url ? (
            <Image 
              src={logoImage.url} 
              alt={logoImage.alt || logoText || "Dentamic"} 
              width={logoImage.dimensions?.width || 120}
              height={logoImage.dimensions?.height || 50}
              className="h-14 md:h-16 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          ) : (
            <span className="text-3xl font-extrabold tracking-tight text-white font-serif relative select-none transition-opacity group-hover:opacity-95">
              {logoText || 'Dentamic'}<span className="text-[#de7c8a]">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* Upper Footer section with Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 items-start text-left">
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-5">
          <p className="text-[#989999] text-sm leading-relaxed max-w-sm font-medium">
            {description || t.quote}
          </p>
        </div>

        {/* Column 2: Mūsu Klīnikas */}
        <div>
          <h4 className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-6">
            {clinicsTitle || t.ourClinics}
          </h4>
          <div className="flex flex-col gap-8">
            {clinicsToRender.map((clinic) => (
              <div key={clinic.id} className="group border-l-2 border-white/[0.06] hover:border-[#de7c8a]/50 pl-4 transition-all duration-300">
                <h5 className="text-sm font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-sm text-[#989999]">
                  <span className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#de7c8a]" />
                    <span className="leading-relaxed hover:text-white transition-colors duration-200">{clinic.address}</span>
                  </span>
                  {clinic.phone && (
                    <a 
                      href={`tel:${clinic.phone.replace(/\s+/g, '')}`} 
                      className="flex items-center gap-2 hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                      <span className="font-mono font-bold text-[#511B29]">{clinic.phone}</span>
                    </a>
                  )}
                  {clinic.email && (
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                      <span className="font-medium">{clinic.email}</span>
                    </span>
                  )}
                  {clinic.gmapsLink && (
                    <span className="flex items-center gap-2">
                      <Map className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                      <a 
                        href={clinic.gmapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white hover:underline transition-colors duration-200 font-medium"
                      >
                        {clinic.mapTitle || t.map}
                      </a>
                    </span>
                  )}
                  {clinic.waze && (
                    <span className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                      <a 
                        href={clinic.waze}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white hover:underline transition-colors duration-200 font-medium"
                      >
                        {clinic.wazeTitle || 'Waze'}
                      </a>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Darba Laiks */}
        <div>
          <h4 className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-6">
            {workingHoursTitle || t.workingHours}
          </h4>
          
          <div className="flex flex-col gap-8">
            {clinicsToRender.map((clinic) => (
              <div 
                key={`hours-${clinic.id}`} 
                className="group border-l-2 border-white/[0.06] hover:border-[#de7c8a]/50 pl-4 transition-all duration-300"
              >
                <h5 className="text-sm font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-sm text-[#989999]">
                  {/* Weekdays */}
                  {clinic.workHours.weekdays && (
                    <div className="flex justify-between items-center gap-4">
                      <span className="font-medium group-hover:text-white transition-colors duration-200">
                        {clinic.labels.weekdays}
                      </span>
                      <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                        {getHoursValue(clinic.workHours.weekdays)}
                      </span>
                    </div>
                  )}
                  
                  {/* Saturday */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium group-hover:text-white transition-colors duration-200">
                      {clinic.labels.saturday}
                    </span>
                    {clinic.workHours.saturday.includes('Slēgts') || clinic.workHours.saturday.includes('Closed') || !getHoursValue(clinic.workHours.saturday) ? (
                      <span className="text-slate-500 font-medium italic text-xs">
                        {clinic.labels.closed}
                      </span>
                    ) : (
                      <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                        {getHoursValue(clinic.workHours.saturday)}
                      </span>
                    )}
                  </div>

                  {/* Sunday */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium group-hover:text-white transition-colors duration-200">
                      {clinic.labels.sunday}
                    </span>
                    {clinic.workHours.sunday.includes('Slēgts') || clinic.workHours.sunday.includes('Closed') || !getHoursValue(clinic.workHours.sunday) ? (
                      <span className="text-slate-500 font-medium italic text-xs">
                        {clinic.labels.closed}
                      </span>
                    ) : (
                      <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                        {getHoursValue(clinic.workHours.sunday)}
                      </span>
                    )}
                  </div>

                  {/* Accessibility Alert Message */}
                  {clinic.accessibilityAlert && (
                    <div className="font-medium group-hover:text-white transition-colors duration-200 mt-1">
                      {clinic.accessibilityAlert}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="border-t border-white/[0.06] bg-[#0f1011]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#989999] font-medium">
          <p>© {new Date().getFullYear()} {copyrightText || `Dentamic. ${t.allRightsReserved}`}</p>
          <div className="flex gap-6">
            <Link
              href={resolveLink(privacyPolicyLink) || (isEn ? '/en/privacy' : '/privatuma-politika')}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {privacyPolicyLabel || (isEn ? 'Privacy Policy' : 'Privātuma politika')}
            </Link>
            <Link
              href={resolveLink(cookiePolicyLink) || (isEn ? '/en/cookies' : '/sikdatnu-politika')}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {cookiePolicyLabel || (isEn ? 'Cookie Policy' : 'Sīkdatņu politika')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
