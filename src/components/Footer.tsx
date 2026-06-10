'use client';

import React from 'react';
import { MapPin, Phone, Mail, Map, Navigation, Star, AlertCircle } from 'lucide-react';
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
    whatsappText?: string;
    whatsappUrl?: string;
    email: string;
    workHoursWeekdays: string;
    workHoursSaturday: string;
    workHoursSunday: string;
    labelWeekdays?: string;
    labelSaturday?: string;
    labelSunday?: string;
    accessibilityAlert?: string;
    accessibilityAlertSecond?: string;
    mapTitle?: string;
    mapUrl?: string;
    wazeTitle?: string;
    wazeUrl?: string;
    reviewTitle?: string;
    reviewUrl?: string;
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
        whatsappText: c.whatsappText,
        whatsappUrl: c.whatsappUrl,
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
        accessibilityAlert: c.accessibilityAlert,
        accessibilityAlertSecond: c.accessibilityAlertSecond,
        reviewTitle: c.reviewTitle,
        reviewUrl: c.reviewUrl
      }))
    : getClinics(isEn ? 'en-us' : 'lv').map((clinic) => ({
        ...clinic,
        whatsappText: undefined,
        whatsappUrl: undefined,
        mapTitle: undefined,
        wazeTitle: undefined,
        reviewTitle: undefined,
        reviewUrl: undefined,
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
        accessibilityAlert: clinic.accessibilityAlert,
        accessibilityAlertSecond: clinic.accessibilityAlertSecond
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
              <div key={clinic.id} className="group">
                <h5 className="text-sm font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-sm text-[#989999]">
                  {/* Row 1: Phone */}
                  <div className="md:h-5 flex items-center">
                    {clinic.phone ? (
                      <a 
                        href={`tel:${clinic.phone.replace(/\s+/g, '')}`} 
                        className="flex items-center gap-2 text-white hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                        <span className="font-mono font-bold">{clinic.phone}</span>
                      </a>
                    ) : (
                      '\u00A0'
                    )}
                  </div>

                  {/* Row 2: WhatsApp */}
                  <div className={`${clinic.whatsappText ? 'flex' : 'hidden md:flex'} md:h-5 items-center`}>
                    {clinic.whatsappText ? (
                      <a 
                        href={clinic.whatsappUrl || `https://wa.me/${clinic.whatsappText.replace(/[^0-9]/g, '')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0 text-[#de7c8a]" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="font-mono font-bold">{clinic.whatsappText}</span>
                      </a>
                    ) : (
                      '\u00A0'
                    )}
                  </div>

                  {/* Row 2.5: Google Review */}
                  <div className={`${clinic.reviewUrl ? 'flex' : 'hidden md:flex'} md:h-5 items-center`}>
                    {clinic.reviewUrl ? (
                      <a 
                        href={clinic.reviewUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-[#de7c8a] transition-colors duration-200 w-fit font-bold"
                      >
                        <Star className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                        <span>{clinic.reviewTitle || (isEn ? 'Write a review' : 'Pievieno atsauksmi')}</span>
                      </a>
                    ) : (
                      '\u00A0'
                    )}
                  </div>

                  {/* Row 3: Address */}
                  <div className="md:h-5 flex items-center">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                      <span className="hover:text-white transition-colors duration-200">{clinic.address}</span>
                    </span>
                  </div>

                  {/* Row 4: Email */}
                  <div className={`${clinic.email ? 'flex' : 'hidden md:flex'} md:h-5 items-center`}>
                    {clinic.email ? (
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                        <span className="font-medium">{clinic.email}</span>
                      </span>
                    ) : (
                      '\u00A0'
                    )}
                  </div>

                  {/* Row 5: Actions */}
                  <div className={`${(clinic.gmapsLink || clinic.waze) ? 'flex' : 'hidden md:flex'} md:h-5 items-center`}>
                    {(clinic.gmapsLink || clinic.waze) ? (
                      <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center w-full">
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
                    ) : (
                      '\u00A0'
                    )}
                  </div>
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
                className="group"
              >
                <h5 className="text-sm font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-sm text-[#989999]">
                  {/* Row 1: Weekdays */}
                  <div className={`${clinic.workHours.weekdays ? 'flex' : 'hidden md:flex'} md:h-5 justify-between items-center gap-4`}>
                    {clinic.workHours.weekdays ? (
                      <>
                        <span className="font-medium group-hover:text-white transition-colors duration-200">
                          {clinic.labels.weekdays}
                        </span>
                        <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                          {getHoursValue(clinic.workHours.weekdays)}
                        </span>
                      </>
                    ) : (
                      '\u00A0'
                    )}
                  </div>
                  
                  {/* Row 2: Saturday */}
                  <div className="md:h-5 flex justify-between items-center gap-4">
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

                  {/* Row 3: Sunday */}
                  <div className="md:h-5 flex justify-between items-center gap-4">
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

                  {/* Row 4: Accessibility Alert Message 1 */}
                  <div className={`${clinic.accessibilityAlert ? 'flex' : 'hidden md:flex'} md:h-5 items-center`}>
                    {clinic.accessibilityAlert ? (
                      <span className="flex items-center gap-2 text-white font-bold transition-colors duration-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                        <span>{clinic.accessibilityAlert}</span>
                      </span>
                    ) : (
                      '\u00A0'
                    )}
                  </div>

                  {/* Row 5: Accessibility Alert Message 2 */}
                  <div className={`${clinic.accessibilityAlertSecond ? 'flex font-medium group-hover:text-white transition-colors duration-200' : 'hidden md:flex font-medium group-hover:text-white transition-colors duration-200'} md:h-5 items-center`}>
                    {clinic.accessibilityAlertSecond || '\u00A0'}
                  </div>
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
              href={resolveLink(privacyPolicyLink) || (isEn ? '/en/privacy-policy' : '/privatuma-politika')}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {privacyPolicyLabel || (isEn ? 'Privacy Policy' : 'Privātuma politika')}
            </Link>
            <Link
              href={resolveLink(cookiePolicyLink) || (isEn ? '/en/cookie-policy' : '/sikdatnu-politika')}
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
