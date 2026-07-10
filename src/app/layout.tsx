import { Manrope, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { createClient } from '../prismicio';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export async function generateMetadata() {
  const client = createClient();
  let settings = null;
  try {
    settings = await client.getSingle('settings');
  } catch (e) {
    // Ignore and fallback
  }

  const faviconUrl = settings?.data?.favicon?.url || '/favicon.ico';

  return {
    title: 'Dentamic | Premium zobārstniecības klīnika',
    description: 'Premium zobārstniecības klīnikas mājaslapa ar interaktīvu vizīšu pieteikšanas un speciālistu vizītkaršu sistēmu.',
    icons: {
      icon: faviconUrl,
    },
  };
}

function isLightColor(colorHex?: string): boolean {
  if (!colorHex) return false;
  const hex = colorHex.replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) return false;
  
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string | string[] }>;
}) {
  const { lang } = await params;
  const resolvedLang = Array.isArray(lang) ? lang[0] : lang;
  const htmlLang = resolvedLang === 'en' ? 'en' : 'lv';

  const client = createClient();
  let settings = null;
  try {
    settings = await client.getSingle('settings');
  } catch (e) {
    // Ignore and fallback
  }

  const mainColor = settings?.data?.main_color || '#511B29';
  const headerColor = settings?.data?.header_color || '#511B29';
  const isHeaderLight = isLightColor(headerColor);

  return (
    <html lang={htmlLang} className={`${manrope.variable} ${playfairDisplay.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H5G60JK2JS"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H5G60JK2JS');
          `}
        </Script>
        <Script id="posthog-init" strategy="lazyOnload">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="Di ji init en nn Ar tn an Yi capture calculateEventProperties dn register register_once register_for_session unregister unregister_for_session gn getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurveyAsync mn identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty fn hn createPersonProfile setInternalOrTestUser pn Ji opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing un debug $r vn getPageViewId captureTraceFeedback captureTraceMetric Zi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_z7oTfiM6pyqbrJ6AxJAEpfGEnADMLctohsjsGWaZC9Z3"}', {
                api_host: 'https://eu.i.posthog.com',
                defaults: '2026-05-30',
                person_profiles: 'identified_only',
                disable_session_recording: typeof window !== 'undefined' && window.innerWidth < 768,
            })
          `}
        </Script>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --main-color: ${mainColor};
            --header-color: ${headerColor};
          }
          
          /* Override background colors containing #511B29 */
          .bg-\\[\\#511B29\\] {
            background-color: var(--main-color) !important;
          }
          .hover\\:bg-\\[\\#5d1726\\]:hover {
            background-color: color-mix(in srgb, var(--main-color) 85%, black) !important;
          }
          
          /* Override text colors containing #511B29 */
          .text-\\[\\#511B29\\] {
            color: var(--main-color) !important;
          }
          .hover\\:text-\\[\\#5d1726\\]:hover {
            color: color-mix(in srgb, var(--main-color) 85%, black) !important;
          }
          .group:hover .group-hover\\:text-\\[\\#5d1726\\] {
            color: color-mix(in srgb, var(--main-color) 85%, black) !important;
          }
          
          /* Override border colors containing #511B29 */
          .border-\\[\\#511B29\\] {
            border-color: var(--main-color) !important;
          }
          .border-\\[\\#511B29\\]\\/30 {
            border-color: color-mix(in srgb, var(--main-color) 30%, transparent) !important;
          }
          .hover\\:border-\\[\\#511B29\\]:hover {
            border-color: var(--main-color) !important;
          }

          /* Override background opacity colors */
          .hover\\:bg-\\[\\#511B29\\]\\/5:hover {
            background-color: color-mix(in srgb, var(--main-color) 5%, transparent) !important;
          }
          .bg-\\[\\#f2dde1\\]\\/50 {
            background-color: color-mix(in srgb, var(--main-color) 15%, transparent) !important;
          }
          .hover\\:bg-\\[\\#f2dde1\\]:hover {
            background-color: color-mix(in srgb, var(--main-color) 25%, transparent) !important;
          }
          
          /* Override shadows */
          .shadow-\\[\\#511B29\\]\\/20 {
            box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--main-color) 20%, transparent), 0 4px 6px -4px color-mix(in srgb, var(--main-color) 20%, transparent) !important;
          }
          .shadow-\\[\\#511B29\\]\\/30 {
            box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--main-color) 30%, transparent), 0 4px 6px -4px color-mix(in srgb, var(--main-color) 30%, transparent) !important;
          }

          /* Header background overrides */
          header.sticky {
            background-color: var(--header-color) !important;
            border-bottom-color: color-mix(in srgb, var(--header-color) 80%, black) !important;
          }
          header.sticky div.overflow-hidden {
            background-color: var(--header-color) !important;
          }

          ${isHeaderLight ? `
            /* Adjust header text and link contrast for light backgrounds */
            header.sticky span.text-white, 
            header.sticky a.text-white\\/75,
            header.sticky button,
            header.sticky a {
              color: var(--main-color) !important;
            }
            header.sticky a.text-white\\/75:hover,
            header.sticky button:hover {
              color: color-mix(in srgb, var(--main-color) 80%, black) !important;
            }
            header.sticky .text-\\[\\#de7c8a\\] {
              color: color-mix(in srgb, var(--main-color) 80%, black) !important;
            }
            header.sticky button svg {
              stroke: var(--main-color) !important;
            }
            header.sticky #header-booking-btn {
              background-color: var(--main-color) !important;
              color: white !important;
            }
          ` : ''}
        ` }} />
      </head>
      <body className="antialiased text-[#1a1718] bg-[#fbf9f8] flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
