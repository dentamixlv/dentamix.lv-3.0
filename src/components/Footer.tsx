'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getClinics } from '../data';

export default function Footer() {
  const params = useParams();
  const langList = params?.lang;
  const isEn = Array.isArray(langList) && langList.length > 0 && langList[0] === 'en';

  const clinics = getClinics(isEn ? 'en-us' : 'lv');

  const t = {
    quote: isEn ? '"A smile that inspires. Care that calms."' : '"Smails, kas iedvesmo. Aprūpe, kas nomierina."',
    ourClinics: isEn ? 'Our Clinics' : 'Mūsu Klīnikas',
    workingHours: isEn ? 'Working Hours' : 'Darba Laiks',
    weekdays: isEn ? 'Weekdays:' : 'Darba dienas:',
    saturday: isEn ? 'Saturday:' : 'Sestdiena:',
    sunday: isEn ? 'Sunday:' : 'Svētdiena:',
    closed: isEn ? 'Closed' : 'Slēgts',
    allRightsReserved: isEn ? 'All rights reserved.' : 'Visas tiesības aizsargātas.',
    patientSafety: isEn ? 'Patient Safety' : 'Pacientu drošība',
    cookieSettings: isEn ? 'Cookie Settings' : 'Sīkdatņu iestatījumi'
  };

  return (
    <footer className="bg-[#151617] text-white border-t border-[#252728]">
      {/* Upper Footer section with Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 items-start text-left">
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-5">
          <span className="text-3xl font-extrabold tracking-tight text-white font-serif relative select-none">
            Dentamic<span className="text-[#de7c8a]">.</span>
          </span>
          <p className="text-[#989999] text-sm leading-relaxed max-w-sm italic font-medium">
            {t.quote}
          </p>
        </div>

        {/* Column 2: Mūsu Klīnikas */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#de7c8a] mb-6">
            {t.ourClinics}
          </h4>
          <div className="flex flex-col gap-8">
            {clinics.map((clinic) => (
              <div key={clinic.id} className="group border-l-2 border-white/[0.06] hover:border-[#de7c8a]/50 pl-4 transition-all duration-300">
                <h5 className="text-[13px] font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-xs text-[#989999]">
                  <span className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#de7c8a]" />
                    <span className="leading-relaxed hover:text-white transition-colors duration-200">{clinic.address}</span>
                  </span>
                  <a 
                    href={`tel:${clinic.phone.replace(/\s+/g, '')}`} 
                    className="flex items-center gap-2 hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                    <span className="font-mono font-medium">{clinic.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${clinic.email}`} 
                    className="flex items-center gap-2 hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" />
                    <span className="font-medium">{clinic.email}</span>
                  </a>
                  {clinic.waze && (
                    <a 
                      href={clinic.waze}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#de7c8a] transition-colors duration-200 w-fit"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0 text-[#de7c8a]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.676 8.615a6.633 6.633 0 0 0-.13-1.343 6.773 6.773 0 0 0-4.718-5.036A6.819 6.819 0 0 0 12.005 2h-.013a6.824 6.824 0 0 0-6.532 4.495 6.04 6.04 0 0 0-.26.974 5.146 5.146 0 0 0-.097.551 6.724 6.724 0 0 0-.073.947l.002.004c-.007.773.12 1.541.376 2.266l.002.006a10.336 10.336 0 0 0 1.346 2.647l.005.007a14.65 14.65 0 0 0 3.16 3.15l.01.008.008.006A17.72 17.72 0 0 0 12 18.656a18.006 18.006 0 0 0 2.685-1.694 16.316 16.316 0 0 0 2.551-2.213 11.9 11.9 0 0 0 1.296-1.724 9.74 9.74 0 0 0 .793-1.485 6.78 6.78 0 0 0 .483-1.452A5.74 5.74 0 0 0 20 9.317a2.795 2.795 0 0 0-.008-.243l-.002-.008a3.774 3.774 0 0 0-.01-.14c-.074-.1-.156-.2-.304-.311Zm-8.671 5.518a3.307 3.307 0 1 1 0-6.614 3.307 3.307 0 0 1 0 6.614Z"/>
                      </svg>
                      <span className="font-medium">Waze</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Darba Laiks */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#de7c8a] mb-6">
            {t.workingHours}
          </h4>
          
          <div className="flex flex-col gap-8">
            {clinics.map((clinic) => (
              <div 
                key={`hours-${clinic.id}`} 
                className="group border-l-2 border-white/[0.06] hover:border-[#de7c8a]/50 pl-4 transition-all duration-300"
              >
                <h5 className="text-[13px] font-bold text-white tracking-wide uppercase mb-2">
                  {clinic.name}
                </h5>
                
                <div className="flex flex-col gap-2 text-xs text-[#989999]">
                  {/* Weekdays */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium group-hover:text-white transition-colors duration-200">
                      {t.weekdays}
                    </span>
                    <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                      {clinic.workHours.weekdays.split(': ')[1]}
                    </span>
                  </div>
                  
                  {/* Saturday */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium group-hover:text-white transition-colors duration-200">
                      {t.saturday}
                    </span>
                    {clinic.workHours.saturday.includes('Slēgts') || clinic.workHours.saturday.includes('Closed') ? (
                      <span className="text-slate-500 font-medium italic text-[11px]">
                        {t.closed}
                      </span>
                    ) : (
                      <span className="font-mono font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
                        {clinic.workHours.saturday.split(': ')[1]}
                      </span>
                    )}
                  </div>

                  {/* Sunday */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium group-hover:text-white transition-colors duration-200">
                      {t.sunday}
                    </span>
                    <span className="text-slate-500 font-medium italic text-[11px]">
                      {t.closed}
                    </span>
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
          <p>© {new Date().getFullYear()} Dentamic. {t.allRightsReserved}</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors duration-200 cursor-pointer">
              {t.patientSafety}
            </span>
            <span className="hover:text-white transition-colors duration-200 cursor-pointer">
              {t.cookieSettings}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
