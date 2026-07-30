'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { Mail, Check, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../convex/_generated/api';

const t = {
  lv: {
    title: "Jaunumi",
    badge: "E-pasta jaunumi",
    desc: "Pieraksties jaunumiem, lai saņemtu jaunāko informāciju, īpašos piedāvājumus un padomus zobu kopšanā.",
    placeholder: "Jūsu e-pasta adrese",
    button: "Pierakstīties",
    success_subscribed: "Paldies! Jūs esat veiksmīgi pierakstījies.",
    success_reactivated: "Jūsu abonements ir veiksmīgi atjaunots!",
    already_subscribed: "Šis e-pasts jau ir pierakstīts jaunumiem.",
    error_generic: "Notikusi kļūda. Lūdzu, mēģiniet vēlreiz.",
    gdpr_prefix: "Piesakoties jūs piekrītat mūsu ",
    gdpr_link_text: "Privātuma politikai",
    gdpr_suffix: ".",
  },
  en: {
    title: "Newsletter",
    badge: "Email updates",
    desc: "Subscribe to receive the latest updates, special offers, and dental care tips.",
    placeholder: "Your email address",
    button: "Subscribe",
    success_subscribed: "Thank you! You have subscribed successfully.",
    success_reactivated: "Your subscription has been successfully reactivated!",
    already_subscribed: "This email is already subscribed to the newsletter.",
    error_generic: "An error occurred. Please try again.",
    gdpr_prefix: "By subscribing you agree to our ",
    gdpr_link_text: "Privacy Policy",
    gdpr_suffix: ".",
  }
};

interface NewsletterFormProps {
  variant?: 'footer' | 'widget' | 'page';
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  badge?: string;
}

export default function NewsletterForm({ 
  variant = 'page', 
  className = '',
  title,
  description,
  badge
}: NewsletterFormProps) {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');
  const locale = isEn ? 'en' : 'lv';
  const text = t[locale];

  const displayTitle = title || text.title;
  const displayDesc = description || text.desc;
  const displayBadge = badge || text.badge;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Honeypot field state for bot/spam protection
  const [honeypot, setHoneypot] = useState('');

  const subscribeMutation = useMutation(api.newsletter.subscribe);

  // Auto-dismiss notification after 6 seconds
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setFeedbackMsg('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: if bots fill this field, ignore submission
    if (honeypot) {
      setEmail('');
      setStatus('success');
      setFeedbackMsg(text.success_subscribed);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setSubmitting(true);
    setStatus('idle');
    setFeedbackMsg('');

    try {
      const result = await subscribeMutation({
        email: cleanEmail,
        locale: isEn ? 'en-us' : 'lv',
      });

      if (result.success) {
        setStatus('success');
        setEmail('');
        if (result.status === 'already_subscribed') {
          setFeedbackMsg(text.already_subscribed);
        } else if (result.status === 'reactivated') {
          setFeedbackMsg(text.success_reactivated);
        } else {
          setFeedbackMsg(text.success_subscribed);
        }
      } else {
        setStatus('error');
        setFeedbackMsg(text.error_generic);
      }
    } catch (err: any) {
      console.error('Newsletter submission error:', err);
      setStatus('error');
      setFeedbackMsg(err.message || text.error_generic);
    } finally {
      setSubmitting(false);
    }
  };

  const gdprLink = isEn ? '/en/privacy-policy' : '/privatuma-politika';

  // --- Variant 1: FOOTER STYLE ---
  if (variant === 'footer') {
    return (
      <div className={`flex flex-col gap-4 w-full md:max-w-sm ${className}`}>
        <h4 className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a]">
          {displayTitle}
        </h4>
        <p className="text-sm text-[#989999] leading-relaxed font-medium">
          {displayDesc}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* Honeypot field (hidden from screen readers & users) */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />

          <div className="relative">
            <input
              type="email"
              required
              placeholder={text.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e2021]/80 border border-[#2d3031] focus:border-[#de7c8a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#5e6061] outline-none transition-all duration-300 pr-10"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#de7c8a] hover:text-white transition-colors duration-200 p-1 flex items-center justify-center cursor-pointer"
              title={text.button}
            >
              {submitting ? (
                <span className="block w-4 h-4 border-2 border-[#de7c8a] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Mail className="w-4 h-4 hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Toast / Alert message inside form */}
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`flex items-start gap-2 text-xs font-medium mt-1 p-2 rounded-lg border ${
                  status === 'success'
                    ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                    : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                }`}
              >
                {status === 'success' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                )}
                <span className="flex-1">{feedbackMsg}</span>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="hover:opacity-80 p-0.5 ml-auto"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* GDPR Notice */}
        <p className="text-sm text-[#5e6061] leading-relaxed font-medium mt-0.5">
          {text.gdpr_prefix}
          <Link href={gdprLink} className="underline text-[#989999] hover:text-white transition-colors">
            {text.gdpr_link_text}
          </Link>
          {text.gdpr_suffix}
        </p>
      </div>
    );
  }

  // --- Variant 2: SIDEBAR WIDGET STYLE ---
  if (variant === 'widget') {
    return (
      <div className={`bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 space-y-4 ${className}`}>
        <h3 className="text-sm font-serif font-bold text-[#511B29] tracking-tight flex items-center gap-2 border-b border-[#efedec] pb-2">
          <Mail className="w-4 h-4 text-[#de7c8a]" />
          {displayTitle}
        </h3>
        <p className="text-xs text-[#6a5b5e] leading-relaxed">
          {displayDesc}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />

          <div className="space-y-2">
            <input
              type="email"
              required
              placeholder={text.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fbf9f8] border border-[#efedec] focus:border-[#de7c8a] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#511B29] placeholder-[#a59b9e] outline-none transition-all duration-300"
              disabled={submitting}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-3 bg-[#511B29] hover:bg-[#632233] active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-[#511B29]/10 hover:shadow-lg transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>{text.button}</span>
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`flex items-start gap-2 text-xs font-medium p-2.5 rounded-xl border ${
                  status === 'success'
                    ? 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5'
                    : 'text-rose-600 border-rose-500/20 bg-rose-500/5'
                }`}
              >
                {status === 'success' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                )}
                <span className="flex-1 leading-snug">{feedbackMsg}</span>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="hover:opacity-80 p-0.5 ml-auto text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="text-[10px] text-[#a59b9e] leading-normal font-medium">
          {text.gdpr_prefix}
          <Link href={gdprLink} className="underline text-[#6a5b5e] hover:text-[#511B29] transition-colors">
            {text.gdpr_link_text}
          </Link>
          {text.gdpr_suffix}
        </p>
      </div>
    );
  }

  // --- Variant 3: PAGE STYLE (CTA style with Border Beam) ---
  return (
    <div
      className={`relative bg-[#fbf9f8] border border-[#efedec] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}
    >
      {/* Premium Border Beam effect */}
      <div className="cta-border-beam" />

      {/* Text column */}
      <div className="space-y-3 max-w-2xl text-center md:text-left w-full relative z-10">
        <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] block">
          {displayBadge}
        </span>
        <h4 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
          {displayTitle}
        </h4>
        <p className="text-base text-[#6a5b5e] leading-relaxed">
          {displayDesc}
        </p>
        <p className="text-xs text-[#a59b9e] leading-normal font-medium pt-2">
          {text.gdpr_prefix}
          <Link href={gdprLink} className="underline text-[#6a5b5e] hover:text-[#511B29] transition-colors">
            {text.gdpr_link_text}
          </Link>
          {text.gdpr_suffix}
        </p>
      </div>

      {/* Form / Subscription column */}
      <div className="w-full md:w-auto min-w-[280px] sm:min-w-[360px] relative z-10 flex flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="email"
              required
              placeholder={text.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-[#efedec] focus:border-[#de7c8a] rounded-full px-5 py-4 text-sm text-[#511B29] placeholder-[#a59b9e] outline-none transition-all duration-300"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 bg-[#511B29] hover:bg-[#632233] active:scale-[0.98] text-white rounded-full text-sm font-bold shadow-lg shadow-[#511B29]/10 hover:shadow-xl transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-2 group shrink-0"
            >
              {submitting ? (
                <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{text.button}</span>
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`flex items-start gap-2 text-sm font-medium p-3 rounded-2xl border ${
                  status === 'success'
                    ? 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5'
                    : 'text-rose-600 border-rose-500/20 bg-rose-500/5'
                }`}
              >
                {status === 'success' ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="flex-1 leading-normal">{feedbackMsg}</span>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="hover:opacity-80 p-0.5 ml-auto text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
