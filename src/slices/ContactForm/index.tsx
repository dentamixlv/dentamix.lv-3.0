'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { getClinics } from '../../data';

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
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
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'tween' as const,
      ease: 'easeOut',
      duration: 0.45
    }
  }
} as const;

type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

export default function ContactForm({ slice }: ContactFormProps) {
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';

  const isEn = langCode === 'en-us';
  const clinics = getClinics(langCode);

  // Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Prefill if message or doctor query was in localStorage or session (e.g. from team booking clicks)
  useEffect(() => {
    const draftMsg = sessionStorage.getItem('dentamic_booking_message');
    if (draftMsg) {
      setContactMessage(draftMsg);
      sessionStorage.removeItem('dentamic_booking_message');
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setContactSuccess(true);
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setContactSuccess(false);
      }, 5000);
    }
  };

  const labels = {
    tag: isEn ? 'Contacts' : 'Kontakti',
    defaultTitle: isEn ? 'Our Clinics & Contacts' : 'Mūsu klīnikas un kontakti',
    defaultSub: isEn ? 'We will be glad to see you and provide the best dental assistance.' : 'Būsim priecīgi Jūs redzēt un sniegt labāko palīdzību.',
    centralBranch: isEn ? 'Central Branch' : 'Centrālā filiāle',
    suburbBranch: isEn ? 'Suburb Branch' : 'Pierīgas filiāle',
    workingHours: isEn ? 'Working Hours' : 'Darba laiks',
    workingDays: isEn ? 'Weekdays:' : 'Darba dienās:',
    sat: isEn ? 'Saturday:' : 'Sestdien:',
    sun: isEn ? 'Sunday:' : 'Svētdien:',
    applyToClinic: isEn ? 'Book at this branch' : 'Pieteikties šajā klīnikā',
    writeUs: isEn ? 'Write Us a Message' : 'Uzrakstiet mums ziņu',
    writeUsSub: isEn 
      ? 'If you have questions, suggestions or need a custom estimate, please fill in the form. We will reply within 2 hours.'
      : 'Ja Jums ir jautājumi, ieteikumi vai vēlaties individuālu tāmēšanu, lūdzu, aizpildiet formu. Atbildēsim 2 stundu laikā.',
    yourName: isEn ? 'First, Last Name' : 'Vārds, Uzvārds',
    yourEmail: isEn ? 'Email Address' : 'E-pasta adrese',
    messageContent: isEn ? 'Message Content' : 'Ziņojuma saturs',
    messagePlaceholder: isEn ? 'Hello! I would like to get more information about...' : 'Sveiki! Es vēlētos uzzināt sīkāku informāciju par...',
    sendMsg: isEn ? 'Send Message' : 'Nosūtīt ziņu',
    msgSuccess: isEn ? 'Message sent successfully!' : 'Ziņa ir sekmīgi nosūtīta!',
    msgSuccessSub: isEn 
      ? 'Thank you for contacting us! Our administrator will get in touch with you shortly at the provided email address.'
      : 'Paldies, ka sazinājāties ar mums! Mūsu administrators drīzumā sazināsies ar Jums norādītajā e-pasta adresē.'
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {labels.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
          {(slice.primary.title as any)?.[0]?.text || labels.defaultTitle}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {slice.primary.subtitle || labels.defaultSub}
        </p>
      </motion.div>

      {/* Clinics addresses and embedded maps grids */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
      >
        {clinics.map((clinic) => (
          <motion.div 
            variants={fadeUpVariants}
            key={clinic.id} 
            className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden"
            id={`branch-block-${clinic.id}`}
          >
            <div>
              {/* Upper tag detail */}
              <span className="text-[10px] font-extrabold tracking-widest text-[#de7c8a] block mb-1.5 uppercase">
                {clinic.id === 'riga' ? labels.centralBranch : labels.suburbBranch}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#400112] mb-4">
                {clinic.name}
              </h3>

              {/* Info details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs text-[#6a5b5e]">
                <div className="space-y-3">
                  <p className="flex items-start gap-2 text-[#1b1c1b] font-medium leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#de7c8a] shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono font-bold text-[#400112] hover:text-[#5d1726]/80 transition-colors">
                    <Phone className="w-4 h-4 text-[#de7c8a] shrink-0" />
                    <span>{clinic.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-[#de7c8a] shrink-0" />
                    <span className="truncate">{clinic.email}</span>
                  </p>
                </div>

                <div className="bg-[#fbf9f8] p-4 rounded-xl border border-[#efedec] text-[11px]">
                  <p className="text-[#400112] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#de7c8a]" />
                    {labels.workingHours}
                  </p>
                  <div className="space-y-1 font-semibold">
                    <p className="flex justify-between">
                      <span>{labels.workingDays}</span>
                      <span className="font-mono">{clinic.workHours.weekdays.split(': ')[1]}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>{labels.sat}</span>
                      {clinic.workHours.saturday.includes('Slēgts') || clinic.workHours.saturday.includes('Closed') ? (
                        <span className="text-red-500">{isEn ? 'Closed' : 'Slēgts'}</span>
                      ) : (
                        <span className="font-mono">{clinic.workHours.saturday.split(': ')[1]}</span>
                      )}
                    </p>
                    <p className="flex justify-between">
                      <span>{labels.sun}</span>
                      <span className="text-red-500">{isEn ? 'Closed' : 'Slēgts'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map iframe element if present */}
            {clinic.gmapsEmbed && (
              <div className="w-full h-60 rounded-2xl overflow-hidden border border-[#efedec] bg-slate-50 relative mt-4 shadow-sm">
                <iframe
                  src={clinic.gmapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title={clinic.name}
                  className="grayscale-[20%] opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-[#efedec]/60">
              <button
                onClick={() => {
                  const formEl = document.getElementById('contact-form-section');
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-[#400112] hover:bg-[#f2dde1]/50 border border-[#d9c1c2] rounded-xl transition-all cursor-pointer"
              >
                {labels.applyToClinic}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Direct Patient Enquiry Contact Form */}
      <motion.div 
        id="contact-form-section"
        initial="hidden"
        animate="visible"
        variants={scaleInVariants}
        className="max-w-xl mx-auto bg-white border border-[#efedec] rounded-3xl p-6 md:p-10 shadow-sm relative"
      >
        <h3 className="text-xl font-serif font-bold text-[#400112] tracking-tight mb-2">
          {labels.writeUs}
        </h3>
        <p className="text-xs text-[#6a5b5e] mb-6 font-medium">
          {labels.writeUsSub}
        </p>

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a5b5e] mb-1">
              {labels.yourName}
            </label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={isEn ? "John Doe" : "Edgars Kalniņš"}
              className="w-full px-4 py-3 text-sm bg-[#fbf9f8] border border-[#efedec] focus:border-[#400112] focus:bg-white rounded-xl transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a5b5e] mb-1">
              {labels.yourEmail}
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 text-sm bg-[#fbf9f8] border border-[#efedec] focus:border-[#400112] focus:bg-white rounded-xl transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6a5b5e] mb-1">
              {labels.messageContent}
            </label>
            <textarea
              required
              rows={4}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder={labels.messagePlaceholder}
              className="w-full px-4 py-3 text-sm bg-[#fbf9f8] border border-[#efedec] focus:border-[#400112] focus:bg-white rounded-xl transition-all outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#400112] text-white hover:bg-[#5d1726] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#400112]/10"
            id="contact-submit-btn"
          >
            <Send className="w-3.5 h-3.5" />
            {labels.sendMsg}
          </button>
        </form>

        {/* Contact success notification */}
        <AnimatePresence>
          {contactSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-[#400112] text-lg">
                {labels.msgSuccess}
              </h4>
              <p className="text-xs text-[#6a5b5e] mt-2 max-w-xs leading-relaxed font-semibold">
                {labels.msgSuccessSub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
