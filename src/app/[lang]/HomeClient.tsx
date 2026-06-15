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
  },
  {
    slice_type: "partner_block" as const,
    variation: "default" as const,
    id: "fallback-partners",
    primary: {
      badge_text: langCode === 'en-us' ? "Patient Safety and Technology" : "Pacientu drošība un tehnoloģijas",
      title: langCode === 'en-us' ? "Our Partners" : "Mūsu partneri",
      subtitle: langCode === 'en-us' 
        ? "We partner with the world's leading Swiss, German, and Finnish medical brands to guarantee excellence in every smile."
        : "Sadarbojamies ar pasaulē vadošajiem Šveices, Vācijas un Somijas medicīnas zīmoliem, lai garantētu izcilību katrā smaidā."
    },
    items: [
      {
        logo: { url: "", alt: "" }
      },
      {
        logo: { url: "", alt: "" }
      },
      {
        logo: { url: "", alt: "" }
      },
      {
        logo: { url: "", alt: "" }
      },
      {
        logo: { url: "", alt: "" }
      },
      {
        logo: { url: "", alt: "" }
      }
    ]
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
  context?: any;
}

export default function HomeClient({ slices, langCode, context }: HomeClientProps) {
  const t = langCode === 'en-us' ? homeTranslations.en : homeTranslations.lv;
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const isEn = langCode === 'en-us';
  const activeSlices = slices && slices.length > 0 ? slices : getFallbackSlices(langCode);

  return (
    <div className="relative">
      {/* Dynamic Hero Section via SliceZone */}
      <SliceZone slices={activeSlices} components={components} context={context} />



    </div>
  );
}
