'use client';

import React, { useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  logoText?: string;
  bookingButtonText?: string;
  menuLinks?: Array<{ label: string; path: string }>;
}

export default function Header({ logoText, bookingButtonText, menuLinks }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();

  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');
  const langPrefix = isEn ? '/en' : '';

  const getPath = (id: string) => {
    if (id === 'home') return langPrefix || '/';
    
    // Normalize id by removing leading slash if present
    const normalizedId = id.startsWith('/') ? id.substring(1) : id;
    
    if (normalizedId === 'services') {
      return isEn ? '/en/services' : '/pakalpojumi';
    }
    if (normalizedId === 'pakalpojumi') {
      return isEn ? '/en/services' : '/pakalpojumi';
    }
    
    return `${langPrefix}/${normalizedId}`;
  };

  const isActive = (id: string) => {
    if (id === 'home') {
      return pathname === '/' || pathname === '/lv' || pathname === '/en' || pathname === '/en-us';
    }
    const normalizedId = id.startsWith('/') ? id.substring(1) : id;
    if (normalizedId === 'services' || normalizedId === 'pakalpojumi') {
      return pathname === '/services' || pathname === '/lv/services' || pathname === '/pakalpojumi' || pathname === '/lv/pakalpojumi' || pathname.startsWith('/en/services');
    }
    return pathname.endsWith(`/${normalizedId}`);
  };

  const getLanguagePath = (targetLang: 'lv' | 'en') => {
    if (targetLang === 'en') {
      if (pathname.startsWith('/lv/')) {
        const remaining = pathname.substring(4);
        let target = remaining;
        if (remaining === 'pakalpojumi') target = 'services';
        else if (remaining.startsWith('pakalpojumi/')) {
          target = `services/${remaining.substring('pakalpojumi/'.length)}`;
        }
        return `/en/${target}`;
      } else if (pathname === '/lv') {
        return '/en';
      } else if (pathname.startsWith('/en/')) {
        return pathname;
      } else if (pathname === '/en') {
        return pathname;
      } else {
        const remaining = pathname === '/' ? '' : pathname.substring(1);
        let target = remaining;
        if (remaining === 'pakalpojumi') target = 'services';
        else if (remaining.startsWith('pakalpojumi/')) {
          target = `services/${remaining.substring('pakalpojumi/'.length)}`;
        }
        return `/en${target ? '/' + target : ''}`;
      }
    } else {
      if (pathname.startsWith('/en/')) {
        const remaining = pathname.substring(4);
        let target = remaining;
        if (remaining === 'services') target = 'pakalpojumi';
        else if (remaining.startsWith('services/')) {
          target = `pakalpojumi/${remaining.substring('services/'.length)}`;
        }
        return `/${target}`;
      } else if (pathname === '/en') {
        return '/';
      } else {
        const remaining = pathname === '/' ? '' : pathname.substring(1);
        let target = remaining;
        if (remaining === 'services') target = 'pakalpojumi';
        else if (remaining.startsWith('services/')) {
          target = `pakalpojumi/${remaining.substring('services/'.length)}`;
        }
        return `/${target}`;
      }
    }
  };

  const navItems = menuLinks && menuLinks.length > 0
    ? menuLinks.map(link => ({ id: link.path, label: link.label }))
    : [
        { id: 'services', label: isEn ? 'Services' : 'Pakalpojumi' },
        { id: 'doctors', label: isEn ? 'Dentists' : 'Zobārsti' },
        { id: 'prices', label: isEn ? 'Prices' : 'Cenas' },
        { id: 'testimonials', label: isEn ? 'Testimonials' : 'Atsauksmes' },
        { id: 'blogs', label: isEn ? 'Blog' : 'Blogs' },
        { id: 'contacts', label: isEn ? 'Contacts' : 'Kontakti' }
      ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#400112] backdrop-blur-md border-b border-[#5d1726]/30">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href={getPath('home')}
          className="flex items-center gap-2 cursor-pointer group"
          id="header-logo-button"
        >
          <span className="text-3xl font-extrabold tracking-tight text-white font-serif transition-opacity group-hover:opacity-95">
            {logoText || 'Dentamic'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => {
            const active = isActive(item.id);
            return (
              <Link
                key={item.id}
                href={getPath(item.id)}
                className={`relative py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  active ? 'text-[#de7c8a]' : 'text-white/75 hover:text-white'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#de7c8a]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Language Switcher */}
          {isEn ? (
            <Link
              href={getLanguagePath('lv')}
              className="relative py-2 text-xs font-bold uppercase tracking-widest text-white/75 hover:text-white transition-colors cursor-pointer"
              id="lang-switch-lv"
            >
              LV
            </Link>
          ) : (
            <Link
              href={getLanguagePath('en')}
              className="relative py-2 text-xs font-bold uppercase tracking-widest text-white/75 hover:text-white transition-colors cursor-pointer"
              id="lang-switch-en"
            >
              EN
            </Link>
          )}
        </nav>

        {/* Header CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <Link
            href={getPath('contacts')}
            className="hidden sm:inline-flex items-center justify-center bg-white text-[#400112] hover:bg-[#fbf9f8] active:scale-[0.98] transition-all px-6 py-3 rounded-full text-sm font-semibold cursor-pointer shadow-md shadow-[#400112]/30"
            id="header-booking-btn"
          >
            {bookingButtonText || (isEn ? 'Book Now' : 'Pierakstīties')}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            id="mobile-menu-toggle-btn"
            aria-label={isEn ? "Menu" : "Izvēlne"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden w-full bg-[#400112] border-b border-[#5d1726]/40 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={getPath(item.id)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-xs font-bold uppercase tracking-widest py-3 border-b border-white/10 ${
                    isActive(item.id) ? 'text-[#de7c8a]' : 'text-white/80 hover:text-white'
                  }`}
                  id={`mobile-nav-item-${item.id}`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Language Switcher in Mobile Menu */}
              {isEn ? (
                <Link
                  href={getLanguagePath('lv')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-xs font-bold uppercase tracking-widest py-3 border-b border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  id="mobile-lang-switch-lv"
                >
                  LV
                </Link>
              ) : (
                <Link
                  href={getLanguagePath('en')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-xs font-bold uppercase tracking-widest py-3 border-b border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  id="mobile-lang-switch-en"
                >
                  EN
                </Link>
              )}

              <Link
                href={getPath('contacts')}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#de7c8a] text-white hover:bg-[#e38c98] px-6 py-3.5 rounded-full text-sm font-bold shadow-md shadow-[#400112]/20"
                id="mobile-booking-btn"
              >
                <Calendar className="w-4 h-4" />
                {bookingButtonText || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
