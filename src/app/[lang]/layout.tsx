import React from 'react';
import { Manrope, Playfair_Display } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createClient } from '../../prismicio';
import { getPrismicLocale } from './page';
import '../globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

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
  const htmlLang = locale === 'en-us' ? 'en' : 'lv';

  let menuData = null;
  try {
    const doc = await client.getSingle('menu', { lang: locale });
    if (doc) {
      menuData = {
        logoText: doc.data.logo_text || undefined,
        logoImage: doc.data.logo_image || undefined,
        phoneNumber: doc.data.phone_number || undefined,
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

  let footerData = null;
  try {
    const doc = await client.getSingle('footer', { lang: locale });
    if (doc) {
      footerData = {
        logoText: doc.data.logo_text || undefined,
        logoImage: doc.data.logo_image || undefined,
        description: doc.data.description || undefined,
        clinicsTitle: doc.data.clinics_column_title || undefined,
        workingHoursTitle: doc.data.working_hours_column_title || undefined,
        clinics: Array.isArray(doc.data.clinics)
          ? doc.data.clinics
              .filter((c: any) => c.name || c.address)
              .map((c: any) => ({
                name: c.name || '',
                address: c.address || '',
                phone: c.phone || '',
                email: c.email || '',
                workHoursWeekdays: c.work_hours_weekdays || '',
                workHoursSaturday: c.work_hours_saturday || '',
                workHoursSunday: c.work_hours_sunday || '',
                labelWeekdays: c.label_weekdays || undefined,
                labelSaturday: c.label_saturday || undefined,
                labelSunday: c.label_sunday || undefined,
              }))
          : undefined,
        copyrightText: doc.data.copyright_text || undefined,
        privacyPolicyLabel: doc.data.privacy_policy_label || undefined,
        privacyPolicyLink: doc.data.privacy_policy_link || undefined,
        cookiePolicyLabel: doc.data.cookie_policy_label || undefined,
        cookiePolicyLink: doc.data.cookie_policy_link || undefined,
      };
    }
  } catch (e) {
    console.warn(`Prismic Footer document not found for locale "${locale}", using local fallback translations.`);
  }

  return (
    <html lang={htmlLang} className={`${manrope.variable} ${playfairDisplay.variable}`}>
      <body className="antialiased text-[#1a1718] bg-[#fbf9f8] flex flex-col min-h-screen">
        <Header 
          logoText={menuData?.logoText}
          logoImage={menuData?.logoImage}
          phoneNumber={menuData?.phoneNumber}
          bookingButtonText={menuData?.bookingButtonText}
          menuLinks={menuData?.menuLinks}
        />
        <main className="flex-grow">
          {children}
        </main>
        <Footer 
          logoText={footerData?.logoText}
          logoImage={footerData?.logoImage}
          description={footerData?.description}
          clinicsTitle={footerData?.clinicsTitle}
          workingHoursTitle={footerData?.workingHoursTitle}
          clinics={footerData?.clinics}
          copyrightText={footerData?.copyrightText}
          privacyPolicyLabel={footerData?.privacyPolicyLabel}
          privacyPolicyLink={footerData?.privacyPolicyLink}
          cookiePolicyLabel={footerData?.cookiePolicyLabel}
          cookiePolicyLink={footerData?.cookiePolicyLink}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
