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
  const [lastPathname, setLastPathname] = useState(pathname);

  // Reset the translation URL immediately during rendering when navigation occurs
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setAltLangUrl(null);
  }

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
