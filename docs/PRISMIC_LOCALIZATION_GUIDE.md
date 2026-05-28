# Prismic Multi-Locale & Routing Implementation Guide

This guide details the localization architecture and routing strategy used to implement multilingual support (Latvian `lv` and English `en`) in the Dentamix application using Next.js and Prismic CMS. Use this document as a reference when adding new pages, localized fields, or custom routing rules.

---

## 1. Architecture & Locale Mapping

We maintain Latvia (`lv`) as the default language (and master locale in Prismic) and English (`en`) as the secondary locale. However, because Prismic uses standard ISO locale formats, we map them as follows:

| Target Language | Public URL Prefix | Prismic Locale Code |
| :--- | :--- | :--- |
| **Latvian** (Default) | `/` (or `/lv/*` internally) | `lv` |
| **English** | `/en/*` | `en-us` |

---

## 2. Next.js Dynamic Routing (`[lang]`)

The application routing is organized inside a dynamic `[lang]` directory segment under `src/app/`.

### Directory Structure
```
src/
└── app/
    └── [lang]/
        ├── layout.tsx       # Root layout mapping footer/menu locales
        ├── page.tsx         # Root page mapping homepage slices
        ├── about/           # About page
        ├── contacts/        # Contacts page
        └── ...
```

### Dynamic Parameter Resolution (Next.js 15)
In Next.js 15, route parameters are asynchronous and must be resolved before use. The layout/page components extract the segment and map it to Prismic using a helper function:

```typescript
// Located in src/app/[lang]/page.tsx
export function getPrismicLocale(lang?: string | string[]) {
  const code = Array.isArray(lang) ? lang[0] : lang;
  if (code?.toLowerCase() === 'en') return 'en-us';
  return 'lv';
}
```

---

## 3. Proxy (Request Interception) URL Normalization & Rewrite Rules

To ensure clean, SEO-friendly URLs in Latvian and English, a custom `src/proxy.ts` handles routing behavior:

### A. Internal Rewrites for Latvian Slugs
Instead of showing English folder names to Latvian visitors, the proxy rewrites clean Latvian paths to their internal Next.js equivalents:
- `/pakalpojumi` $\rightarrow$ Rewrites internally to `/lv/services`
- `/cenas` $\rightarrow$ Rewrites internally to `/lv/prices`
- `/zobarsti` $\rightarrow$ Rewrites internally to `/lv/doctors`
- `/par-mums` $\rightarrow$ Rewrites internally to `/lv/about`
- `/kontakti` $\rightarrow$ Rewrites internally to `/lv/contacts`

### B. Prismic Link Resolver Normalization
Prismic's link resolver may output paths using the standard Prismic locale segment (e.g. `/en-us/privacy`).
The proxy intercepts these paths and redirects them to clean English URLs:
- `/en-us/*` $\rightarrow$ Redirects (307) to `/en/*`

### C. Default Fallback
If the pathname does not start with `/en` or `/lv`, the proxy automatically rewrites the path internally to the `/lv` namespace.

---

## 4. Localized Data Fetching (Server Components)

All data fetching from Prismic takes place inside Server Components (`layout.tsx` or `page.tsx`). You pass the resolved Prismic locale to the query options.

### Fetching Example (`layout.tsx`)
```typescript
import { createClient } from '../../prismicio';
import { getPrismicLocale } from './page';

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = getPrismicLocale(lang);
  const client = createClient();

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
                // Fields defined inside the repeatable group:
                labelWeekdays: c.label_weekdays || undefined,
                labelSaturday: c.label_saturday || undefined,
                labelSunday: c.label_sunday || undefined,
              }))
          : undefined,
        // ...
      };
    }
  } catch (e) {
    console.warn(`Prismic Footer document not found for locale "${locale}".`);
  }
}
```

---

## 5. Client Component Localization & Translation Fallbacks

For components declared with `'use client'`, you must ensure the language status is resolved correctly and that hardcoded fallbacks are implemented if the CMS fields are unpopulated.

### A. Safe Locale Check in Client Components
Next.js `useParams()` returns route segments that can be arrays or strings. Always parse the segment safely:
```typescript
const params = useParams();
const langList = params?.lang;
const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');
```

### B. Defining a Fallback Dictionary (`t` Object)
Construct a default localized dictionary to use as the baseline fallback if no dynamic values exist in Prismic:
```typescript
const t = {
  weekdays: isEn ? 'Weekdays:' : 'Darba dienas:',
  saturday: isEn ? 'Saturday:' : 'Sestdiena:',
  sunday: isEn ? 'Sunday:' : 'Svētdiena:',
  closed: isEn ? 'Closed' : 'Slēgts',
};
```

### C. Mapping Clinic-Specific Labels
When rendering lists (like clinics) containing nested translation fields, map each item dynamically to override global defaults:
```typescript
const clinicsToRender = clinicsProp && clinicsProp.length > 0
  ? clinicsProp.map((c, idx) => ({
      ...c,
      labels: {
        weekdays: c.labelWeekdays || t.weekdays,
        saturday: c.labelSaturday || t.saturday,
        sunday: c.labelSunday || t.sunday,
        closed: t.closed, // Fallback directly to the localized dictionary closed value
      }
    }))
  : getClinics(isEn ? 'en-us' : 'lv').map((clinic) => ({
      ...clinic,
      labels: {
        weekdays: t.weekdays,
        saturday: t.saturday,
        sunday: t.sunday,
        closed: t.closed,
      }
    }));
```

---

## 6. Step-by-Step Guide to Adding a Localized Field

Follow these steps when you need to add a new customizable translation field inside a repeatable Group component (like `clinics`):

### Step 1: Update the Custom Type Schema
1. Launch the Slice Machine interface locally:
   ```bash
   npm run slicemachine
   ```
2. Navigate to your Custom Type (e.g. **Footer**).
3. Inside your Repeatable Group field configuration (e.g. **Clinics**), click **Add field**.
4. Add a new field (e.g., a **Key Text** field with API ID `label_saturday`).
5. Click **Save** in Slice Machine.

### Step 2: Regenerate TypeScript Definitions
To update the TypeScript models for Prismic document structures:
```bash
npx prismic-ts-codegen
```
This automatically updates `prismicio-types.d.ts` with your new schema fields.

### Step 3: Fetch the Field in the Layout or Page Component
Modify the parent Server Component (e.g. `src/app/[lang]/layout.tsx`) to pull the field inside the `.map()` loop of the repeatable list:
```typescript
clinics: Array.isArray(doc.data.clinics)
  ? doc.data.clinics.map((c: any) => ({
      name: c.name || '',
      // Fetch the nested field
      labelSaturday: c.label_saturday || undefined,
    }))
  : undefined
```

### Step 4: Accept and Map the Prop in the Target Component
Modify the target UI component (e.g. `src/components/Footer.tsx`):
1. Add the optional field to the `clinics` array definition inside `FooterProps`:
   ```typescript
   interface FooterProps {
     clinics?: Array<{
       name: string;
       labelSaturday?: string;
       // ...
     }>;
   }
   ```
2. Map the field in the mapping function to resolve override values:
   ```typescript
   saturday: c.labelSaturday || t.saturday
   ```
3. Use it inside the JSX layout:
   ```typescript
   <span>{clinic.labels.saturday}</span>
   ```

### Step 5: Push and Publish
1. Open Slice Machine (`http://localhost:9999`).
2. Select your Custom Type and click **Push to Prismic** to synchronize the schema.
3. Open your Prismic admin dashboard online, enter the translations for the new field inside your repeatable items, and click **Publish**.

---

## 7. Prismic Model Context Protocol (MCP) Server

To help AI coding assistants (like Claude or other compatible agents) understand your local Prismic setup, slice models, styling configurations, and frameworks, you can activate the official Prismic Model Context Protocol (MCP) server.

### A. Local Setup for Claude Desktop

1. Open your Claude Desktop configuration file:
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add the `@prismicio/mcp-server` configuration under `mcpServers`:
   ```json
   {
     "mcpServers": {
       "prismic": {
         "command": "npx",
         "args": [
           "-y",
           "@prismicio/mcp-server@latest"
         ]
       }
     }
   }
   ```
3. Restart your Claude Desktop application to load the server.

### B. Capabilities Enabled
Once configured, the AI assistant will be able to:
- **Inspect local context:** Read slice configuration models, frameworks (Next.js), and styling preferences (Tailwind CSS) automatically.
- **Bridge UI design to code:** Translate wireframes or mockups into code conforming to your project's custom slice models.
- **Read content models:** Query active and custom schema fields to suggest exact mappings for components.
