'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Quote, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';

// Fallback slices if Prismic CMS doesn't return data (e.g. for en-us document before it is created)
const getFallbackSlices = (langCode: string) => [
  {
    slice_type: "hero" as const,
    variation: "default" as const,
    id: "fallback-hero",
    primary: {
      title: [
        {
          type: "heading1" as const,
          text: langCode === 'en-us' 
            ? "Excellent Dentistry for Your Well-being" 
            : "Izcila zobārstniecība Jūsu labsajūtai",
          spans: [],
          direction: "ltr" as const
        }
      ],
      subtitle: [
        {
          type: "paragraph" as const,
          text: langCode === 'en-us'
            ? "Modern technology and a personalized approach for every patient. Experience painless, custom care."
            : "Modernas tehnoloģijas un individuāla pieeja katram pacientam. Piedzīvojiet nesāpīgu un pilnībā personalizētu aprūpi ekspertu vadībā.",
          spans: [],
          direction: "ltr" as const
        }
      ],
      premium_tag: langCode === 'en-us' ? "Premium Care" : "Premium Care",
      cta_text: langCode === 'en-us' ? "Book a Visit" : "Pierakstīties vizītei",
      secondary_cta_text: langCode === 'en-us' ? "Our Services" : "Mūsu pakalpojumi",
      background_image: {
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1400"
      }
    },
    items: []
  }
];

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
      type: 'tween',
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const slideInRightVariants = {
  hidden: { opacity: 0, x: 35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const homeTranslations = {
  lv: {
    leaderTag: 'Klīnikas vadītājs un vadošais speciālists',
    learnMore: 'Uzzināt vairāk',
    biography: 'Mūsu klīnikas filozofija balstās uz izcilību katrā detaļā un dziļu cieņu pret pacienta labsajūtu. Mēs ne tikai ārstējam, bet radām vidi, kurā modernākās tehnoloģijas satiekas ar patiesu rūpību un individuālu pieeju, nodrošinot augstākā līmeņa zobārstniecības pieredzi.',
    advantagesTitle: 'DENTAMIC PRIEKŠROCĪBAS',
    testimonialsTitle: 'Pacientu atsauksmes',
    testimonialsSub: 'Mūsu pacienti novērtē augstāko aprūpes kvalitāti, nesāpīgas procedūras un gādīgu attieksmi.',
    viewAllReviews: 'Skatīt visus pacientu stāstus',
    partnerTag: 'Pacientu drošība un tehnoloģijas',
    partnerTitle: 'Mūsu partneri',
    partnerSub: 'Sadarbojamies ar pasaulē vadošajiem Šveices, Vācijas un Somijas medicīnas zīmoliem, lai garantētu izcilību katrā smaidā.'
  },
  en: {
    leaderTag: 'Clinic Director and Leading Specialist',
    learnMore: 'Learn More',
    biography: 'Our clinic philosophy is built on excellence in every detail and deep respect for patient well-being. We do not just treat; we create an environment where modern technology meets genuine care and a personalized approach, ensuring a premier dental experience.',
    advantagesTitle: 'DENTAMIC ADVANTAGES',
    testimonialsTitle: 'Patient Testimonials',
    testimonialsSub: 'Our patients appreciate the highest quality of care, painless procedures, and attentive treatment.',
    viewAllReviews: 'View All Patient Stories',
    partnerTag: 'Patient Safety and Technology',
    partnerTitle: 'Our Partners',
    partnerSub: 'We partner with the world\'s leading Swiss, German, and Finnish medical brands to guarantee excellence in every smile.'
  }
};

interface HomeClientProps {
  slices: any[] | null;
  langCode: string;
}

export default function HomeClient({ slices, langCode }: HomeClientProps) {
  const t = langCode === 'en-us' ? homeTranslations.en : homeTranslations.lv;
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const isEn = langCode === 'en-us';
  const activeSlices = slices && slices.length > 0 ? slices : getFallbackSlices(langCode);

  return (
    <div className="relative">
      {/* Dynamic Hero Section via SliceZone */}
      <SliceZone slices={activeSlices} components={components} />

      {/* Introductory section with Dr. Jānis Bērziņš Card */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainerVariants}
          className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-2xl shadow-[#511B29]/5 p-6 md:p-12 relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <motion.div 
              variants={slideInLeftVariants}
              className="lg:col-span-5 w-full aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden border border-[#efedec] shadow-md bg-[#fbf9f8] relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Dr. Jānis Bērziņš"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                priority
              />
            </motion.div>

            {/* Right side: Biography details inline */}
            <motion.div 
              variants={slideInRightVariants}
              className="lg:col-span-7 flex flex-col justify-center animate-fade-in"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
                {t.leaderTag}
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
                Dr. Jānis Bērziņš
              </h2>
              
              {/* Pink accent bar */}
              <div className="w-12 h-1 bg-[#de7c8a] mt-3 mb-6" />

              <p className="text-[#1b1c1b] text-base leading-relaxed font-normal mb-8">
                {t.biography}
              </p>

              <div>
                <Link
                  href={`${langPrefix}/doctors`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
                  id="home-learn-more-btn"
                >
                  {t.learnMore}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Highlights Bento-like Features Section */}
      <section className="bg-gradient-to-b from-white to-[#fbf9f8] py-20 border-t border-[#efedec]/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">{t.advantagesTitle}</span>
            <h3 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">{t.testimonialsTitle}</h3>
            <p className="text-xs text-[#6a5b5e] mt-2 font-medium">{t.testimonialsSub}</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Testimonial 1 */}
            <motion.div variants={fadeUpVariants} className="bg-white p-8 rounded-2xl border border-[#efedec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
              <div className="absolute top-6 right-6 text-[#f2dde1]/50 group-hover:text-[#de7c8a]/20 transition-all duration-300">
                <Quote className="w-10 h-10 transform scale-x-[-1]" />
              </div>
              <div>
                <div className="flex gap-1 mb-4 text-[#de7c8a]">
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                </div>
                
                <p className="text-xs text-[#6a5b5e] leading-relaxed italic mb-6">
                  {langCode === 'en-us'
                    ? '"Excellent premium quality and precision. Swiss implants were inserted completely painlessly. Dr. Jānis Bērziņš and his team work amazingly professionally – every detail is considered."'
                    : '"Izcila premium kvalitāte un precizitāte. Šveices implanti tika ievietoti pilnīgi nesāpīgi. Dr. Jānis Bērziņš un viņa komanda strādā apbrīnojami profesionāli – katra detaļa ir pārdomāta."'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#efedec]">
                <div className="w-10 h-10 rounded-full bg-[#511B29] flex items-center justify-center text-white text-xs font-bold font-serif shadow-sm">
                  KZ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#511B29]">{langCode === 'en-us' ? 'Kristaps Zarins' : 'Kristaps Zariņš'}</h4>
                  <p className="text-[10px] text-[#de7c8a] font-medium">{langCode === 'en-us' ? 'Dental Implants' : 'Zobu implantācija'}</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div variants={fadeUpVariants} className="bg-white p-8 rounded-2xl border border-[#efedec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
              <div className="absolute top-6 right-6 text-[#f2dde1]/50 group-hover:text-[#de7c8a]/20 transition-all duration-300">
                <Quote className="w-10 h-10 transform scale-x-[-1]" />
              </div>
              <div>
                <div className="flex gap-1 mb-4 text-[#de7c8a]">
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                </div>
                
                <p className="text-xs text-[#6a5b5e] leading-relaxed italic mb-6">
                  {langCode === 'en-us'
                    ? '"I have always had a massive fear of the dentist, but at Dentamic clinic it vanished completely. Gentle touch, calming environment, and 100% care. I am incredibly grateful for my new smile!"'
                    : '"Man vienmēr ir bijušas milzīgas bailes no zobārsta, bet Dentamic klīnikā tās pilnībā izgaisa. Maigs pieskāriens, nomierinoša vide un 100% gādība. Esmu bezgala pateicīga par savu jauno smaidu!"'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#efedec]">
                <div className="w-10 h-10 rounded-full bg-[#de7c8a] flex items-center justify-center text-white text-xs font-bold font-serif shadow-sm">
                  AK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#511B29]">{langCode === 'en-us' ? 'Anete Kalnina' : 'Anete Kalniņa'}</h4>
                  <p className="text-[10px] text-[#de7c8a] font-medium">{langCode === 'en-us' ? 'Aesthetic Restoration' : 'Estētiskā restaurācija'}</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div variants={fadeUpVariants} className="bg-white p-8 rounded-2xl border border-[#efedec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
              <div className="absolute top-6 right-6 text-[#f2dde1]/50 group-hover:text-[#de7c8a]/20 transition-all duration-300">
                <Quote className="w-10 h-10 transform scale-x-[-1]" />
              </div>
              <div>
                <div className="flex gap-1 mb-4 text-[#de7c8a]">
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                  <Star className="w-3.5 h-3.5 fill-[#de7c8a]" />
                </div>
                
                <p className="text-xs text-[#6a5b5e] leading-relaxed italic mb-6">
                  {langCode === 'en-us'
                    ? '"We believe in the precision and work of our doctors, which is why we received both contract guarantees and very attentive follow-up care after the procedure. This service exceeds any experience in Latvia."'
                    : '"Mēs ticam mūsu ārstu precizitātei un darbam, tāpēc saņēmām gan līguma garantijas, gan ļoti gādīgu sekošanu līdzi pēc procedūras. Šis serviss pārsniedz jebkuru pieredzi Latvijā."'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#efedec]">
                <div className="w-10 h-10 rounded-full bg-[#6a5b5e] flex items-center justify-center text-white text-xs font-bold font-serif shadow-sm">
                  MO
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#511B29]">{langCode === 'en-us' ? 'Marcis Ozolins' : 'Mārcis Ozoliņš'}</h4>
                  <p className="text-[10px] text-[#de7c8a] font-medium">{langCode === 'en-us' ? 'Hygiene & Fillings' : 'Zobu higiēna un labošana'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* View all testimonials link */}
          <div className="text-center mt-12">
            <Link
              href={`${langPrefix}/testimonials`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
              id="home-view-all-reviews-btn"
            >
              {t.viewAllReviews}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partneri section */}
      <section className="bg-white py-16 border-t border-[#efedec]/65">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">{t.partnerTag}</span>
            <h3 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">{t.partnerTitle}</h3>
            <p className="text-xs text-[#6a5b5e] mt-2 font-medium">{t.partnerSub}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center"
          >
            {/* Partner 1: Straumann */}
            <motion.div variants={fadeUpVariants} className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl h-28 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group">
              <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
                <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 14v12M14 20h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <text x="40" y="26" fontSize="16" fontWeight="900" letterSpacing="0.03em" className="font-sans">straumann</text>
              </svg>
              <span className="text-[8px] font-bold text-[#de7c8a]/60 uppercase tracking-widest mt-2">{langCode === 'en-us' ? 'Switzerland' : 'Šveice'}</span>
            </motion.div>

            {/* Partner 2: Planmeca */}
            <motion.div variants={fadeUpVariants} className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl h-28 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group">
              <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
                <path d="M10 26 L18 14 L23 22 L28 16 L34 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="14" r="2" />
                <circle cx="28" cy="16" r="2" />
                <text x="44" y="26" fontSize="16" fontWeight="800" letterSpacing="0.08em" className="font-serif">PLANMECA</text>
              </svg>
              <span className="text-[8px] font-bold text-[#de7c8a]/60 uppercase tracking-widest mt-2">{langCode === 'en-us' ? 'Finland' : 'Somija'}</span>
            </motion.div>

            {/* Partner 3: Ivoclar */}
            <motion.div variants={fadeUpVariants} className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl h-28 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group">
              <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
                <circle cx="15" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                <circle cx="24" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 1.5" />
                <text x="42" y="26" fontSize="18" fontWeight="700" letterSpacing="0.01em" className="font-sans">ivoclar</text>
              </svg>
              <span className="text-[8px] font-bold text-[#de7c8a]/60 uppercase tracking-widest mt-2">{langCode === 'en-us' ? 'Liechtenstein' : 'Lihtenšteina'}</span>
            </motion.div>

            {/* Partner 4: Geistlich */}
            <motion.div variants={fadeUpVariants} className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl h-28 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group">
              <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
                <path d="M10 20 l4 -7 h8 l4 7 l-4 7 h-8 z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 13 l4 7 l-4 7" fill="none" stroke="currentColor" strokeWidth="1" />
                <text x="36" y="26" fontSize="17" fontWeight="700" letterSpacing="-0.01em" className="font-serif italic font-bold">Geistlich</text>
              </svg>
              <span className="text-[8px] font-bold text-[#de7c8a]/60 uppercase tracking-widest mt-2">{langCode === 'en-us' ? 'Switzerland' : 'Šveice'}</span>
            </motion.div>

            {/* Partner 5: Curaprox */}
            <motion.div variants={fadeUpVariants} className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl h-28 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group">
              <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
                <circle cx="15" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="20" r="4.5" fill="currentColor" opacity="0.4" />
                <circle cx="15" cy="14" r="1.5" fill="currentColor" />
                <circle cx="15" cy="26" r="1.5" fill="currentColor" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                <circle cx="21" cy="20" r="1.5" fill="currentColor" />
                <text x="34" y="25" fontSize="15" fontWeight="900" letterSpacing="0.12em" className="font-sans">CURAPROX</text>
              </svg>
              <span className="text-[8px] font-bold text-[#de7c8a]/60 uppercase tracking-widest mt-2">{langCode === 'en-us' ? 'Switzerland' : 'Šveice'}</span>
            </motion.div>

            {/* Partner 6: 3M ESPE */}
            <motion.div variants={fadeUpVariants} className="bg-[#fbf9f8]/40 border border-[#efedec]/65 hover:border-[#de7c8a]/20 p-4 rounded-2xl h-28 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-sm group">
              <svg className="h-6 w-full text-[#511B29] opacity-80 group-hover:opacity-100 group-hover:text-[#5d1726] transition-all" viewBox="0 0 160 40" fill="currentColor">
                <rect x="6" y="10" width="22" height="18" rx="2" fill="currentColor" opacity="0.15" />
                <text x="10" y="23" fontSize="11" fontWeight="900" className="font-sans">3M</text>
                <text x="35" y="26" fontSize="16" fontWeight="800" letterSpacing="0.08em" className="font-serif">ESPE</text>
              </svg>
              <span className="text-[8px] font-bold text-[#de7c8a]/60 uppercase tracking-widest mt-2">{langCode === 'en-us' ? 'Germany' : 'Vācija'}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
