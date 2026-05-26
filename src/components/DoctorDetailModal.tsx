'use client';

import React from 'react';
import { X, Award, GraduationCap, Languages, Check, CalendarDays, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onBookWithDoctor: (doctorId: string) => void;
}

export default function DoctorDetailModal({ doctor, isOpen, onClose, onBookWithDoctor }: DoctorDetailModalProps) {
  if (!doctor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop with 12px blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[12px]"
          />

          {/* Modal layout box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.35 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row my-8 max-h-[90vh]"
            id="doctor-detail-modal-container"
          >
            {/* Left: Professional Portrait Graphic */}
            <div className="w-full md:w-2/5 relative h-64 md:h-auto min-h-[300px] bg-[#fbf9f8] border-r border-[#efedec]">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#f2dde1]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#400112] border border-[#d9c1c2]/50 shadow-sm">
                {doctor.category}
              </div>
            </div>

            {/* Right: Rich Bio text, education and contacts */}
            <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[90vh]">
              {/* Close Button top right */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-[#6a5b5e] hover:text-[#400112] hover:bg-[#f2dde1]/50 rounded-full transition-all cursor-pointer z-10"
                id="close-doctor-detail-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1">
                {/* Titles */}
                <h3 className="text-2xl font-serif font-bold text-[#400112] tracking-tight pr-8">
                  {doctor.name}
                </h3>
                <p className="text-sm font-bold text-[#6a5b5e] uppercase tracking-wider mt-0.5">
                  {doctor.role}
                </p>
                <div className="w-12 h-0.5 bg-[#de7c8a] mt-3 mb-5" />

                {/* Professional Statement */}
                <p className="text-[#1b1c1b] text-sm leading-relaxed mb-6 font-medium">
                  {doctor.fullBio}
                </p>

                {/* Grid of details */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Specializations list */}
                  <div>
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#400112] mb-3">
                      <Award className="w-4 h-4 text-[#de7c8a]" />
                      Specialitātes & Kompetences
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6a5b5e] font-semibold">
                      {doctor.specializations.map((spec, index) => (
                        <li key={index} className="flex items-start gap-2 bg-[#fbf9f8] p-2 rounded-xl border border-[#efedec] hover:border-[#d9c1c2] transition-colors">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Education logs */}
                  <div>
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#400112] mb-3">
                      <GraduationCap className="w-4 h-4 text-[#de7c8a]" />
                      Izglītība & tālākizglītība
                    </span>
                    <ul className="flex flex-col gap-2.5 text-xs text-[#6a5b5e] font-medium pl-1.5 border-l border-[#f2dde1]">
                      {doctor.education.map((edu, index) => (
                        <li key={index} className="relative pl-4">
                          <div className="absolute left-[-10px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#de7c8a]" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Communication languages list */}
                  <div>
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#400112] mb-2">
                      <Languages className="w-4 h-4 text-[#de7c8a]" />
                      Saziņas valodas
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {doctor.languages.map((lng, index) => (
                        <span key={index} className="bg-[#f2dde1]/40 border border-[#d9c1c2]/30 px-3 py-1 rounded-full text-xs font-bold text-[#400112]">
                          {lng}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons to schedule with the doctor */}
              <div className="mt-8 pt-5 border-t border-[#efedec] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onBookWithDoctor(doctor.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#400112] text-white hover:bg-[#5d1726] active:scale-[0.99] transition-all px-6 py-3.5 rounded-full text-sm font-bold cursor-pointer shadow-md shadow-[#400112]/15"
                  id={`modal-book-doctor-${doctor.id}`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Pierakstīties pie ārsta
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 text-xs font-bold text-[#6a5b5e] hover:text-[#400112] bg-[#fbf9f8] hover:bg-[#efedec] rounded-full text-center transition-all cursor-pointer border border-[#efedec]"
                >
                  Aizvērt
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
