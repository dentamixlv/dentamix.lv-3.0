import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createClient } from '../../prismicio';
import { getPrismicLocale } from './page';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang?: string | string[];
  }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

  let menuData = null;
  try {
    const doc = await client.getSingle('menu', { lang: locale });
    if (doc) {
      menuData = {
        logoText: doc.data.logo_text || undefined,
        bookingButtonText: doc.data.booking_button_text || undefined,
        menuLinks: Array.isArray(doc.data.menu_links)
          ? doc.data.menu_links
              .filter((link: any) => link.label || link.path)
              .map((link: any) => ({
                label: link.label || '',
                path: link.path || '',
              }))
          : undefined,
      };
    }
  } catch (e) {
    console.warn(`Prismic Menu document not found for locale "${locale}", using local fallback translations.`);
  }

  return (
    <>
      <Header 
        logoText={menuData?.logoText}
        bookingButtonText={menuData?.bookingButtonText}
        menuLinks={menuData?.menuLinks}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
