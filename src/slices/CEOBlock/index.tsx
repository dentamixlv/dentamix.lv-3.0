'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, JSXMapSerializer } from "@prismicio/react";
import { PrismicNextLink } from '@prismicio/next';
import Image from 'next/image';
import Link from 'next/link';

// Custom rich text components for biography
const richTextComponents: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="text-[#6A5B5E] text-base leading-relaxed italic mb-8">
      {children}
    </p>
  ),
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
} as const;

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween' as const,
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
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

type CEOBlockProps = SliceComponentProps<Content.CeoBlockSlice>;

export default function CEOBlock({ slice }: CEOBlockProps) {
  const { primary } = slice;
  const params = useParams();

  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langPrefix = isEn ? '/en' : '';

  const rawLeaderTag = primary.leader_tag;
  const leaderTagText = Array.isArray(rawLeaderTag)
    ? rawLeaderTag.map((block: any) => block.text).join(' ')
    : (typeof rawLeaderTag === 'string' ? rawLeaderTag : '');

  const leaderTag = leaderTagText || (isEn ? 'Clinic Director and Leading Specialist' : 'Klīnikas vadītājs un vadošais speciālists');
  const name = primary.name || 'Dr. Jānis Bērziņš';
  const linkText = primary.link_text || (isEn ? 'Learn More' : 'Uzzināt vairāk');
  
  const imageUrl = isFilled.image(primary.image) 
    ? primary.image.url 
    : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800";
  const imageAlt = isFilled.image(primary.image) && primary.image.alt
    ? primary.image.alt
    : name;

  const defaultBioText = isEn 
    ? "Our clinic philosophy is built on excellence in every detail and deep respect for patient well-being. We do not just treat; we create an environment where modern technology meets genuine care and a personalized approach, ensuring a premier dental experience."
    : "Mūsu klīnikas filozofija balstās uz izcilību katrā detaļā un dziļu cieņu pret pacienta labsajūtu. Mēs ne tikai ārstējam, bet radām vidi, kurā modernākās tehnoloģijas satiekas ar patiesu rūpību un individuālu pieeju, nodrošinot augstākā līmeņa zobārstniecības pieredzi.";

  const bioContent = isFilled.richText(primary.biography) ? (
    <PrismicRichText field={primary.biography} components={richTextComponents} />
  ) : (
    <p className="text-[#6A5B5E] text-base leading-relaxed italic mb-8">
      {defaultBioText}
    </p>
  );

  const customLink = isFilled.link(primary.link_url) ? (
    <PrismicNextLink
      field={primary.link_url}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-learn-more-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </PrismicNextLink>
  ) : (
    <Link
      href={`${langPrefix}/doctors`}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#511B29] hover:text-[#5d1726] border-b border-[#efedec] hover:border-[#511B29] pb-1.5 transition-all cursor-pointer"
      id="home-learn-more-btn"
    >
      {linkText}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainerVariants}
        className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 p-6 md:p-12 relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          <motion.div 
            variants={slideInLeftVariants}
            className="lg:col-span-5 w-full aspect-[3/4] lg:aspect-[2/3] max-h-[480px] lg:max-h-[580px] rounded-2xl overflow-hidden border border-[#efedec] shadow-md bg-[#fbf9f8] relative"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top hover-scale-102"
            />
          </motion.div>

          <motion.div 
            variants={slideInRightVariants}
            className="lg:col-span-7 flex flex-col justify-center animate-fade-in"
          >
            <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
              {leaderTag}
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#511B29] mt-2 tracking-tight">
              {name}
            </h3>
            
            {/* Pink accent bar */}
            <div className="w-12 h-1 bg-[#de7c8a] mt-3 mb-6" />

            {bioContent}

            {/* Signature Image above the link */}
            {isFilled.image(primary.signature_image) && (
              <div className="mb-8 relative w-72 h-24">
                <Image
                  src={primary.signature_image.url}
                  alt={primary.signature_image.alt || "Signature"}
                  fill
                  className="object-contain object-left"
                />
              </div>
            )}

            <div>
              {customLink}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
