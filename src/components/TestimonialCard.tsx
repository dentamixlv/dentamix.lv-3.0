'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Heart } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  item: Testimonial;
  variants?: any;
}

export default function TestimonialCard({ item, variants }: TestimonialCardProps) {
  return (
    <motion.div 
      variants={variants}
      className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group h-full"
      id={`testimonial-card-${item.id}`}
    >
      {/* Upper Card visual block with only stars */}
      <div className="relative bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 overflow-hidden border-b border-[#efedec] flex flex-col items-center justify-center py-8 px-6 text-center shrink-0">
        {/* Soft ambient background quote marks */}
        <div className="absolute top-4 right-4 text-[#f2dde1]/30 group-hover:text-[#de7c8a]/15 transition-all duration-300">
          <Quote className="w-10 h-10 transform scale-x-[-1]" />
        </div>

        {/* Stars Rating */}
        <div className="z-10 flex gap-1 justify-center text-[#de7c8a]">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#de7c8a] stroke-[#de7c8a]" />
          ))}
        </div>
      </div>

      {/* Card metadata and content matching Doctor section */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          <span className="text-[0.625rem] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
            {item.treatment}
          </span>
          <h3 className="text-xl font-serif font-bold text-[#511B29] tracking-tight group-hover:text-[#5d1726] transition-colors">
            {item.author}
          </h3>
          
          {/* Complete story matching descriptive length of doctors */}
          <p className="text-base text-[#6a5b5e] leading-relaxed mt-3 italic">
            {item.story}
          </p>
        </div>

        {/* Footer timestamp and actions */}
        <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Heart className="w-3.5 h-3.5 text-[#de7c8a] fill-[#de7c8a]/20" />
            <span className="text-[0.625rem] font-semibold text-slate-500">{item.date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
