'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LanguageContextType {
  altLangUrl: string | null;
  setAltLangUrl: (url: string | null) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  altLangUrl: null,
  setAltLangUrl: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [altLangUrl, setAltLangUrl] = useState<string | null>(null);
  const pathname = usePathname();

  // Reset the alt URL whenever the pathname changes, so other pages don't inherit it
  useEffect(() => {
    setAltLangUrl(null);
  }, [pathname]);

  return (
    <LanguageContext.Provider value={{ altLangUrl, setAltLangUrl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageUpdater({ url }: { url: string | null }) {
  const { setAltLangUrl } = useLanguage();

  useEffect(() => {
    if (url) {
      setAltLangUrl(url);
    }
  }, [url, setAltLangUrl]);

  return null;
}
