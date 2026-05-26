'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
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
        gmapsLink: c.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}` : undefined,
        waze: c.address ? `https://waze.com/ul?q=${encodeURIComponent(c.address)}` : undefined,
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
        }
      }))
    : getClinics(isEn ? 'en-us' : 'lv').map((clinic) => ({
        ...clinic,
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
        }
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
            <img 
              src={logoImage.url} 
              alt={logoImage.alt || logoText || "Dentamic"} 
              className="h-14 md:h-16 w-auto object-contain transition-opacity group-hover:opacity-90"
              referrerPolicy="no-referrer"
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
          <p className="text-[#989999] text-sm leading-relaxed max-w-sm italic font-medium">
            {description || t.quote}
          </p>
        </div>

        {/* Column 2: Mūsu Klīnikas */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#de7c8a] mb-6">
            {clinicsTitle || t.ourClinics}
          </h4>
          <div className="flex flex-col gap-8">
            {clinicsToRender.map((clinic) => (
              <div key={clinic.id} className="group border-l-2 border-white/[0.06] hover:border-[#de7c8a]/50 pl-4 transition-all duration-300">
                <h5 className="text-[13px] font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-xs text-[#989999]">
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
                      <span className="font-mono font-medium">{clinic.phone}</span>
                    </a>
                  )}
                  {clinic.email && (
                    <a 
                      href={`mailto:${clinic.email}`} 
                      className="flex items-center gap-2 hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                      <span className="font-medium">{clinic.email}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    {clinic.gmapsLink && (
                      <a 
                        href={clinic.gmapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-[#de7c8a] transition-colors duration-200 w-fit text-[11px]"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span className="font-medium">{t.map}</span>
                      </a>
                    )}
                    {clinic.waze && (
                      <a 
                        href={clinic.waze}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-[#de7c8a] transition-colors duration-200 w-fit text-[11px]"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.676 8.615a6.633 6.633 0 0 0-.13-1.343 6.773 6.773 0 0 0-4.718-5.036A6.819 6.819 0 0 0 12.005 2h-.013a6.824 6.824 0 0 0-6.532 4.495 6.04 6.04 0 0 0-.26.974 5.146 5.146 0 0 0-.097.551 6.724 6.724 0 0 0-.073.947l.002.004c-.007.773.12 1.541.376 2.266l.002.006a10.336 10.336 0 0 0 1.346 2.647l.005.007a14.65 14.65 0 0 0 3.16 3.15l.01.008.008.006A17.72 17.72 0 0 0 12 18.656a18.006 18.006 0 0 0 2.685-1.694 16.316 16.316 0 0 0 2.551-2.213 11.9 11.9 0 0 0 1.296-1.724 9.74 9.74 0 0 0 .793-1.485 6.78 6.78 0 0 0 .483-1.452A5.74 5.74 0 0 0 20 9.317a2.795 2.795 0 0 0-.008-.243l-.002-.008a3.774 3.774 0 0 0-.01-.14c-.074-.1-.156-.2-.304-.311Zm-8.671 5.518a3.307 3.307 0 1 1 0-6.614 3.307 3.307 0 0 1 0 6.614Z"/>
                        </svg>
                        <span className="font-medium">Waze</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Darba Laiks */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#de7c8a] mb-6">
            {workingHoursTitle || t.workingHours}
          </h4>
          
          <div className="flex flex-col gap-8">
            {clinicsToRender.map((clinic) => (
              <div 
                key={`hours-${clinic.id}`} 
                className="group border-l-2 border-white/[0.06] hover:border-[#de7c8a]/50 pl-4 transition-all duration-300"
              >
                <h5 className="text-[13px] font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-xs text-[#989999]">
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
                      <span className="text-slate-500 font-medium italic text-[11px]">
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
                      <span className="text-slate-500 font-medium italic text-[11px]">
                        {clinic.labels.closed}
                      </span>
                    ) : (
                      <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                        {getHoursValue(clinic.workHours.sunday)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="border-t border-white/[0.06] bg-[#0f1011]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#989999] font-medium">
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
