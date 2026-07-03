import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createClient } from '../../prismicio';
import { getPrismicLocale } from './page';
import { LanguageProvider } from '../../components/LanguageContext';
import ConvexClientProvider from '../../components/ConvexClientProvider';
import ClientChatAssistant from '../../components/ClientChatAssistant';

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
        whatsappCtaText: doc.data.whatsapp_cta_text || undefined,
        whatsappLinkUrl: doc.data.whatsapp_link_url || undefined,
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
                whatsappText: c.whatsapp_text || undefined,
                whatsappUrl: c.whatsapp_url || undefined,
                email: c.email || '',
                workHoursWeekdays: c.work_hours_weekdays || '',
                workHoursSaturday: c.work_hours_saturday || '',
                workHoursSunday: c.work_hours_sunday || '',
                labelWeekdays: c.label_weekdays || undefined,
                labelSaturday: c.label_saturday || undefined,
                labelSunday: c.label_sunday || undefined,
                accessibilityAlert: c.accessibility_alert || undefined,
                accessibilityAlertSecond: c.accessibility_alert_second || undefined,
                mapTitle: c.map_title || undefined,
                mapUrl: c.map_url || undefined,
                wazeTitle: c.waze_title || undefined,
                wazeUrl: c.waze_url || undefined,
                reviewTitle: c.review_title || undefined,
                reviewUrl: c.review_url || undefined,
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
    <LanguageProvider>
      <ConvexClientProvider>
        <Header 
          logoText={menuData?.logoText}
          logoImage={menuData?.logoImage}
          phoneNumber={menuData?.phoneNumber}
          bookingButtonText={menuData?.bookingButtonText}
          menuLinks={menuData?.menuLinks}
          whatsappCtaText={menuData?.whatsappCtaText}
          whatsappLinkUrl={menuData?.whatsappLinkUrl}
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
        <ClientChatAssistant />
      </ConvexClientProvider>
    </LanguageProvider>
  );
}
