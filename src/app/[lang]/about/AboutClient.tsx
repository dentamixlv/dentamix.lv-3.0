'use client';

import React from 'react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutClient() {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');
  const langPrefix = isEn ? '/en' : '';

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'tween' as const, ease: 'easeOut', duration: 0.55 }
    }
  } as const;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  } as const;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="py-16 md:py-24 max-w-7xl mx-auto px-6"
    >
      {/* Header Metadata block - Centered and full-width */}
      <motion.div variants={fadeUpVariants} className="text-center w-full mb-12 animate-fade-in">
        <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block text-center">
          {isEn ? 'About the Clinic' : 'Par klīniku'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight leading-tight mb-6 text-center w-full">
          {isEn ? 'Dentamic Dental Clinic' : 'Dentamic zobārstniecības klīnika'}
        </h2>
        <p className="text-base text-[#6a5b5e] mt-2 font-medium text-center max-w-2xl mx-auto">
          {isEn
            ? 'Modern dentistry combining advanced technology with personalized care in Riga and Adazi.'
            : 'Mūsdienīga zobārstniecība, kas apvieno jaunākās tehnoloģijas un individuālu pieeju Rīgā un Ādažos.'}
        </p>
      </motion.div>

      {/* Article Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start text-left">
        {/* Main Content */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-6">
          <div className="text-base sm:text-lg leading-relaxed text-slate-800 space-y-6 font-normal">
            <p className="text-[#511B29] font-serif text-lg leading-relaxed border-l-2 border-[#de7c8a] pl-4 font-medium">
              {isEn
                ? 'Dentamic is a modern dental clinic that combines the latest technologies with an individual approach to each patient. Our goal is to provide the highest quality dental services in a comfortable and friendly environment.'
                : 'Dentamic ir mūsdienīga zobārstniecības klīnika, kas apvieno jaunākās tehnoloģijas un individuālu pieeju katram pacientam. Mūsu mērķis ir nodrošināt augstākās kvalitātes zobārstniecības pakalpojumus ērtā un draudzīgā vidē.'}
            </p>
            <p>
              {isEn
                ? 'Our team consists of experienced specialists who regularly update their knowledge and follow the latest trends in dentistry. We take pride in our modern equipment and individual approach to each patient.'
                : 'Mūsu komandā strādā pieredzējuši speciālisti, kuri regulāri papildina savas zināšanas un seko līdzi jaunākajām tendencēm zobārstniecībā. Mēs lepojamies ar modernu aprīkojumu un individuālu pieeju katram pacientam.'}
            </p>
            <p>
              {isEn
                ? 'The clinic offers a full range of dental services — from preventive check-ups and hygiene to complex surgical procedures and aesthetic dentistry. We work with patients of all ages, ensuring a comfortable and pain-free experience.'
                : 'Klīnika piedāvā pilnu zobārstniecības pakalpojumu klāstu — no profilaktiskām pārbaudēm un higiēnas līdz sarežģītām ķirurģiskām procedūrām un estētiskai zobārstniecībai. Strādājam ar visu vecumu pacientiem, nodrošinot ērtu un nesāpīgu pieredzi.'}
            </p>
            <p>
              {isEn
                ? 'We are located in two convenient locations — Riga city center and Adazi, making our services easily accessible to residents of both the capital and the Pieriga region.'
                : 'Atrodamies divās ērtās lokācijās — Rīgas centrā un Ādažos, padarot mūsu pakalpojumus viegli pieejamus gan galvaspilsētas, gan Pierīgas iedzīvotājiem.'}
            </p>
          </div>

          <div className="p-6 bg-[#fbf9f8] rounded-2xl border border-[#efedec] mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#511B29] mb-2">
              {isEn ? 'Our Mission' : 'Mūsu misija'}
            </h4>
            <p className="text-xs text-[#6a5b5e] leading-relaxed">
              {isEn
                ? 'To provide accessible, high-quality dental care using the latest technologies, with a focus on patient comfort and long-term oral health.'
                : 'Nodrošināt pieejamu, augstas kvalitātes zobārstniecības aprūpi, izmantojot jaunākās tehnoloģijas, ar uzsvaru uz pacienta komfortu un ilgtermiņa mutes veselību.'}
            </p>
          </div>
        </motion.div>

        {/* Info Sidebar */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Clinic Image in Sidebar */}
          <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-[#efedec] bg-[#fbf9f8] shadow-sm">
            <Image
              src="/clinic-placeholder.jpg"
              alt={isEn ? 'Dentamic Clinic' : 'Dentamic klīnika'}
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover select-none"
            />
          </div>

          <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight mb-4 flex items-center gap-2 border-b border-[#efedec] pb-3">
              <Bookmark className="w-4 h-4 text-[#de7c8a]" />
              {isEn ? 'Why Choose Us' : 'Kāpēc izvēlēties mūs'}
            </h3>
            <ul className="space-y-4 text-xs text-[#6a5b5e]">
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn
                    ? 'Modern equipment and advanced treatment methods.'
                    : 'Modernākā aparatūra un ārstēšanas metodes.'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn
                    ? 'Experienced and certified specialists in every field.'
                    : 'Pieredzējuši un sertificēti speciālisti katrā jomā.'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn
                    ? 'Comfortable and pain-free treatment experience.'
                    : 'Ērta un nesāpīga ārstēšanās pieredze.'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#de7c8a] font-bold">•</span>
                <span>
                  {isEn
                    ? 'Two convenient locations in Riga and Adazi.'
                    : 'Divas ērtas lokācijas Rīgā un Ādažos.'}
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <Link
          href={langPrefix || '/'}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
          {isEn ? 'Back to Home' : 'Atpakaļ uz sākumu'}
        </Link>
      </div>
    </motion.div>
  );
}