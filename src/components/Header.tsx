'use client';

import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

interface HeaderProps {
  logoText?: string;
  logoImage?: any;
  phoneNumber?: string;
  bookingButtonText?: string;
  menuLinks?: Array<{ label: string; path: string }>;
  whatsappCtaText?: string;
  whatsappLinkUrl?: string;
}

export default function Header({ logoText, logoImage, phoneNumber, bookingButtonText, menuLinks, whatsappCtaText, whatsappLinkUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const { altLangUrl } = useLanguage();

  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');
  const langPrefix = isEn ? '/en' : '';

  const getPath = (id: string) => {
    if (id === 'home') return langPrefix || '/';
    
    const normalizedId = id.startsWith('/') ? id.substring(1) : id;
    
    if (normalizedId === 'services' || normalizedId === 'pakalpojumi') {
      return isEn ? '/en/services' : '/pakalpojumi';
    }
    if (normalizedId === 'prices' || normalizedId === 'cenas') {
      return isEn ? '/en/prices' : '/cenas';
    }
    if (normalizedId === 'testimonials' || normalizedId === 'atsauksmes') {
      return isEn ? '/en/testimonials' : '/atsauksmes';
    }
    if (normalizedId === 'contacts' || normalizedId === 'kontakti') {
      return isEn ? '/en/contacts' : '/kontakti';
    }
    if (normalizedId === 'about' || normalizedId === 'par-mums') {
      return isEn ? '/en/about' : '/par-mums';
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
    if (normalizedId === 'prices' || normalizedId === 'cenas') {
      return pathname === '/prices' || pathname === '/lv/prices' || pathname === '/cenas' || pathname === '/lv/cenas' || pathname === '/en/prices';
    }
    if (normalizedId === 'testimonials' || normalizedId === 'atsauksmes') {
      return pathname === '/testimonials' || pathname === '/lv/testimonials' || pathname === '/atsauksmes' || pathname === '/lv/atsauksmes' || pathname === '/en/testimonials';
    }
    if (normalizedId === 'contacts' || normalizedId === 'kontakti') {
      return pathname === '/contacts' || pathname === '/lv/contacts' || pathname === '/kontakti' || pathname === '/lv/kontakti' || pathname === '/en/contacts';
    }
    if (normalizedId === 'about' || normalizedId === 'par-mums') {
      return pathname === '/about' || pathname === '/lv/about' || pathname === '/par-mums' || pathname === '/lv/par-mums' || pathname === '/en/about' || pathname === '/en/par-mums';
    }

    return pathname.endsWith(`/${normalizedId}`);
  };

  const getLanguagePath = (targetLang: 'lv' | 'en') => {
    if (altLangUrl) {
      if (targetLang === 'en' && altLangUrl.startsWith('/en')) {
        return altLangUrl;
      }
      if (targetLang === 'lv' && !altLangUrl.startsWith('/en')) {
        return altLangUrl;
      }
    }

    if (targetLang === 'en') {
      if (pathname.startsWith('/lv/')) {
        const remaining = pathname.substring(4);
        let target = remaining;
        if (remaining === 'pakalpojumi') target = 'services';
        else if (remaining.startsWith('pakalpojumi/')) target = `services/${remaining.substring('pakalpojumi/'.length)}`;
        else if (remaining === 'cenas') target = 'prices';
        else if (remaining === 'atsauksmes') target = 'testimonials';
        else if (remaining === 'kontakti') target = 'contacts';
        else if (remaining === 'par-mums') target = 'about';
        else if (remaining === 'privatuma-politika') target = 'privacy-policy';
        else if (remaining === 'sikdatnu-politika') target = 'cookie-policy';

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
        else if (remaining.startsWith('pakalpojumi/')) target = `services/${remaining.substring('pakalpojumi/'.length)}`;
        else if (remaining === 'cenas') target = 'prices';
        else if (remaining === 'atsauksmes') target = 'testimonials';
        else if (remaining === 'kontakti') target = 'contacts';
        else if (remaining === 'par-mums') target = 'about';
        else if (remaining === 'privatuma-politika') target = 'privacy-policy';
        else if (remaining === 'sikdatnu-politika') target = 'cookie-policy';

        return `/en${target ? '/' + target : ''}`;
      }
    } else {
      if (pathname.startsWith('/en/')) {
        const remaining = pathname.substring(4);
        let target = remaining;
        if (remaining === 'services') target = 'pakalpojumi';
        else if (remaining.startsWith('services/')) target = `pakalpojumi/${remaining.substring('services/'.length)}`;
        else if (remaining === 'prices') target = 'cenas';
        else if (remaining === 'testimonials') target = 'atsauksmes';
        else if (remaining === 'contacts') target = 'kontakti';
        else if (remaining === 'about') target = 'par-mums';
        else if (remaining === 'privacy-policy' || remaining === 'privacy') target = 'privatuma-politika';
        else if (remaining === 'cookie-policy' || remaining === 'cookies') target = 'sikdatnu-politika';

        return `/${target}`;
      } else if (pathname === '/en') {
        return '/';
      } else {
        const remaining = pathname === '/' ? '' : pathname.substring(1);
        let target = remaining;
        if (remaining === 'services') target = 'pakalpojumi';
        else if (remaining.startsWith('services/')) target = `pakalpojumi/${remaining.substring('services/'.length)}`;
        else if (remaining === 'prices') target = 'cenas';
        else if (remaining === 'testimonials') target = 'atsauksmes';
        else if (remaining === 'contacts') target = 'kontakti';
        else if (remaining === 'privacy-policy' || remaining === 'privacy') target = 'privatuma-politika';
        else if (remaining === 'cookie-policy' || remaining === 'cookies') target = 'sikdatnu-politika';

        return `/${target}`;
      }
    }
  };

  const navItems = menuLinks && menuLinks.length > 0
    ? menuLinks.map(link => ({ id: link.path, label: link.label }))
    : [
        { id: 'services', label: isEn ? 'Services' : 'Pakalpojumi' },
        { id: 'about', label: isEn ? 'About' : 'Par Mums' },
        { id: 'doctors', label: isEn ? 'Dentists' : 'Zobārsti' },
        { id: 'prices', label: isEn ? 'Prices' : 'Cenas' },
        { id: 'testimonials', label: isEn ? 'Testimonials' : 'Atsauksmes' },
        { id: 'blogs', label: isEn ? 'Blog' : 'Blogs' },
        { id: 'contacts', label: isEn ? 'Contacts' : 'Kontakti' }
      ];

  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
    transition: 'none'
  });
  const linkRefs = React.useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isInitial = React.useRef(true);
  const activeItemId = navItems.find(item => isActive(item.id))?.id;

  React.useEffect(() => {
    const updatePosition = (immediate = false) => {
      if (!activeItemId) {
        setUnderlineStyle(prev => ({ ...prev, opacity: 0 }));
        return;
      }

      const activeEl = linkRefs.current[activeItemId];
      if (activeEl) {
        const left = activeEl.offsetLeft;
        const width = activeEl.offsetWidth;

        setUnderlineStyle({
          left,
          width,
          opacity: 1,
          transition: (isInitial.current || immediate)
            ? 'none'
            : 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease'
        });
      }
    };

    // Give browser time to layout and paint, particularly during dynamic loads/hydration
    const timer = setTimeout(() => {
      updatePosition();
      if (isInitial.current) {
        isInitial.current = false;
      }
    }, 50);

    const handleResize = () => updatePosition(true);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeItemId]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#511B29] backdrop-blur-md border-b border-[#5d1726]/30">
      <div className="max-w-7xl mx-auto px-6 h-20 lg:h-24 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href={getPath('home')}
          className="flex items-center gap-2 cursor-pointer group"
          id="header-logo-button"
        >
          {logoImage?.url ? (
            <Image 
              src={logoImage.url} 
              alt={logoImage.alt || logoText || "Dentamic"} 
              width={logoImage.dimensions?.width || 120}
              height={logoImage.dimensions?.height || 50}
              className="h-14 md:h-16 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          ) : (
            <span className="text-3xl font-extrabold tracking-tight text-white font-serif transition-opacity group-hover:opacity-95">
              {logoText || 'Dentamic'}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 relative">
          {navItems.map((item) => {
            const active = isActive(item.id);
            return (
              <Link
                key={item.id}
                ref={(el) => { linkRefs.current[item.id] = el; }}
                href={getPath(item.id)}
                className={`relative py-2 nav-text-desktop font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  active ? 'text-[#de7c8a]' : 'text-white/75 hover:text-white'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Language Switcher */}
          {isEn ? (
            <Link
              href={getLanguagePath('lv')}
              className="relative py-2 nav-text-desktop font-bold uppercase tracking-widest text-white/75 hover:text-white transition-colors cursor-pointer"
              id="lang-switch-lv"
            >
              LV
            </Link>
          ) : (
            <Link
              href={getLanguagePath('en')}
              className="relative py-2 nav-text-desktop font-bold uppercase tracking-widest text-white/75 hover:text-white transition-colors cursor-pointer"
              id="lang-switch-en"
            >
              EN
            </Link>
          )}

          {/* Underline Indicator */}
          <div
            className="absolute bottom-0 h-[2px] bg-[#de7c8a]"
            style={underlineStyle}
          />
        </nav>

        {/* Header CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <Link
            href={getPath('contacts')}
            className="hidden sm:inline-flex items-center justify-center bg-white text-[#511B29] hover:bg-[#fbf9f8] active:scale-[0.98] transition-all px-6 py-3 rounded-full text-sm font-semibold cursor-pointer shadow-md shadow-[#511B29]/30"
            id="header-booking-btn"
          >
            {bookingButtonText || (isEn ? 'Book Now' : 'Pierakstīties')}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            id="mobile-menu-toggle-btn"
            aria-label={isEn ? "Menu" : "Izvēlne"}
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
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
            className="lg:hidden w-full bg-[#511B29] border-b border-[#5d1726]/40 overflow-hidden"
          >
            <div className="px-6 pt-3.5 pb-6 flex flex-col gap-0">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={getPath(item.id)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-bold uppercase tracking-widest py-3 border-b border-white/10 ${
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
                  className="text-left text-sm font-bold uppercase tracking-widest py-3 border-b border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  id="mobile-lang-switch-lv"
                >
                  LV
                </Link>
              ) : (
                <Link
                  href={getLanguagePath('en')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-sm font-bold uppercase tracking-widest py-3 border-b border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  id="mobile-lang-switch-en"
                >
                  EN
                </Link>
              )}

              <Link
                href={phoneNumber ? `tel:${phoneNumber.replace(/\s+/g, '')}` : getPath('contacts')}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-7 inline-flex items-center justify-center gap-2 bg-[#de7c8a] text-white hover:bg-[#e38c98] px-6 py-3.5 rounded-full text-sm font-bold shadow-md shadow-[#511B29]/20"
                id="mobile-booking-btn"
              >
                <Phone className="w-4 h-4" />
                {bookingButtonText || (isEn ? 'Book a Visit' : 'Pierakstīties vizītei')}
              </Link>

              <a
                href={whatsappLinkUrl || (phoneNumber ? `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-[#25d366] border border-[#25d366] text-white hover:bg-[#20ba5a] hover:border-[#20ba5a] px-6 py-3.5 rounded-full text-sm font-bold transition-all"
                id="mobile-whatsapp-btn"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{whatsappCtaText || 'Whatsapp'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
