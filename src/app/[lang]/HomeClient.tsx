'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';
import { getTestimonials } from '../../data/testimonials';

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
  },
  {
    slice_type: "ceo_block" as const,
    variation: "default" as const,
    id: "fallback-ceo",
    primary: {
      leader_tag: langCode === 'en-us' ? "Clinic Director and Leading Specialist" : "Klīnikas vadītājs un vadošais speciālists",
      name: "Dr. Jānis Bērziņš",
      biography: [
        {
          type: "paragraph" as const,
          text: langCode === 'en-us'
            ? "Our clinic philosophy is built on excellence in every detail and deep respect for patient well-being. We do not just treat; we create an environment where modern technology meets genuine care and a personalized approach, ensuring a premier dental experience."
            : "Mūsu klīnikas filozofija balstās uz izcilību katrā detaļā un dziļu cieņu pret pacienta labsajūtu. Mēs ne tikai ārstējam, bet radām vidi, kurā modernākās tehnoloģijas satiekas ar patiesu rūpību un individuālu pieeju, nodrošinot augstākā līmeņa zobārstniecības pieredzi.",
          spans: [],
          direction: "ltr" as const
        }
      ],
      image: {
        url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
        alt: "Dr. Jānis Bērziņš"
      },
      signature_image: {
        url: "",
        alt: ""
      },
      link_text: langCode === 'en-us' ? "Learn More" : "Uzzināt vairāk",
      link_url: {
        link_type: "Web" as const,
        url: "/doctors"
      }
    },
    items: []
  },
  {
    slice_type: "testimonial_block" as const,
    variation: "default" as const,
    id: "fallback-testimonials",
    primary: {
      badge_text: langCode === 'en-us' ? "TESTIMONIALS" : "PACIENTU ATSAUKSMES",
      title: langCode === 'en-us' ? "Patient Testimonials" : "Pacientu atsauksmes",
      subtitle: langCode === 'en-us' 
        ? "Our patients appreciate the highest quality of care, painless procedures, and attentive treatment."
        : "Mūsu pacienti novērtē augstāko aprūpes kvalitāti, nesāpīgas procedūras un gādīgu attieksmi.",
      link_text: langCode === 'en-us' ? "View All Patient Stories" : "Skatīt visus pacientu stāstus",
      link_url: {
        link_type: "Web" as const,
        url: "/testimonials"
      }
    },
    items: getTestimonials(langCode === 'en-us' ? 'en-us' : 'lv').slice(0, 3).map((item) => ({
      tagline: item.treatment,
      author: item.author,
      testimonial_text: item.story,
      date: item.date,
      rating: item.rating
    }))
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

const homeTranslations = {
  lv: {
    advantagesTitle: 'DENTAMIC PRIEKŠROCĪBAS',
    testimonialsTitle: 'Pacientu atsauksmes',
    testimonialsSub: 'Mūsu pacienti novērtē augstāko aprūpes kvalitāti, nesāpīgas procedūras un gādīgu attieksmi.',
    viewAllReviews: 'Skatīt visus pacientu stāstus',
    partnerTag: 'Pacientu drošība un tehnoloģijas',
    partnerTitle: 'Mūsu partneri',
    partnerSub: 'Sadarbojamies ar pasaulē vadošajiem Šveices, Vācijas un Somijas medicīnas zīmoliem, lai garantētu izcilību katrā smaidā.'
  },
  en: {
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
