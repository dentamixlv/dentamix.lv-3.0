<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

# Dentamix v3.0 Agent Guidance & Reference

Welcome! This document provides core guidance for AI agents and developers working on the **Dentamix v3.0** codebase. Refer to this document to understand the project structure, stack, design rules, routing/localization architecture, AI system, and coding standards.

---

## 1. Project Overview
**Dentamix** (https://dentamix.lv) is a premium dental clinic based in Latvia (with locations in Riga and Ādaži). This codebase is the clinic's official modern digital platform. It features:
* **Interactive AI Chat Assistant** ("Ieva") with streaming responses and Retrieval-Augmented Generation (RAG).
* **Multi-locale support** (Latvian and English).
* **Visual content management** managed via Prismic CMS.

---

## 2. Technology Stack
* **Framework**: Latest [Next.js](https://nextjs.org/) (Next.js 16+ App Router, as specified in package.json) using React 19 and TypeScript. Always target and support the latest Next.js version features and requirements.
* **Styling**: Tailwind CSS v4 with dynamic custom theme variables defined in CSS (`src/app/globals.css`).
  * Primary color token: `#511B29` / `--main-color`.
  * Secondary / Header color token: `--header-color`.
  * Fonts: `Manrope` (Sans-serif, default body font) and `Playfair Display` (Serif, elegant headings).
* **Backend Database & Functions**: [Convex](https://convex.dev) (functions located in `convex/`).
* **CMS**: [Prismic CMS](https://prismic.io/) (utilizing Local Slice Machine UI for content modeling and custom sections).
* **AI Engine**: Google Gemini API via `@google/generative-ai` (using `gemini-3.5-flash` model inside Convex actions).
* **Analytics**: PostHog integration.
* **Package Manager**: `pnpm` (configured in a workspace).

---

## 3. Localization & Routing (Prismic Multi-Locale)
The application maintains **Latvian** (`lv`) as the default language (master locale) and **English** (`en`) as the secondary language.

### Locale Mapping
| URL Prefix | Prismic Locale Code | Target Language |
| :--- | :--- | :--- |
| `/` (default) / `/lv/*` | `lv` | Latvian |
| `/en/*` | `en-us` | English |

### Dynamic Route Segment Resolution
In the latest Next.js releases (Next.js 15/16+), route parameters (`params`) are asynchronous Promises. They must be awaited before extracting the `lang` segment and resolving it using `getPrismicLocale`:

```typescript
export function getPrismicLocale(lang?: string | string[]) {
  const code = Array.isArray(lang) ? lang[0] : lang;
  if (code?.toLowerCase() === 'en') return 'en-us';
  return 'lv';
}
```

### URL Normalization & Rewrite Rules (`src/proxy.ts`)

Clean Latvian URLs are mapped internally to their Next.js routing equivalents:

* **Latvian Slugs mapped internally**:
  * `/pakalpojumi` -> `/lv/services`
  * `/cenas` -> `/lv/prices`
  * `/zobarsti` -> `/lv/doctors`
  * `/atsauksmes` -> `/lv/testimonials`
  * `/par-mums` -> `/lv/about`
  * `/kontakti` -> `/lv/contacts`

* **English/Prismic standard normalization**:
  * `/en-us/*` -> Redirects (307) to `/en/*`
  * `/en/zobarsti` -> Redirects (307) to `/en/doctors`
  * `/en/par-mums` -> Redirects (307) to `/en/about`
  * Paths lacking `/en` or `/lv` are automatically rewritten internally to the `/lv` namespace.

*Note: For the URL rewrites to trigger automatically in the application run, ensure the routing middleware intercepts requests and invokes `src/proxy.ts` (e.g. from a `src/middleware.ts` wrapper).*

---

## 4. AI Chat Assistant ("Ieva")

The assistant (`convex/assistant.ts`) is designed to answer client questions, explain dental services, share pricing information, and guide clients to schedule appointments.

### Core Mechanics

1. **RAG Vector Search**: The user's query is embedded using the Gemini embedding API and searched against the `documents` table via a Convex vector index (`by_embedding`, 768 dimensions). Matching documents are injected as system context.
2. **Name Extraction**: A structured name extraction utility parses the last few messages. If the user introduces themselves, their first name is extracted and saved in the `conversations` record.
3. **Response Streaming**: Responses are streamed chunk-by-chunk using `gemini-3.5-flash`'s stream generator, updating the message content in real time.

### Conversational Rules

* **Identity**: Named "Ieva", the Dentamix website assistant.
* **Tone**: Warm, empathetic, professional, clean, polite.
* **Format**:
  * **Bold Phone Numbers**: Phone numbers must ALWAYS be written in bold markdown: **+371 29419999**.
  * **No Markdown Links**: Do NOT output markdown links (e.g. `[text](url)`) or URL paths. Direct users to the native Call/WhatsApp buttons at the bottom of the chat bubble.
  * **No WhatsApp URLs**: Do NOT output raw WhatsApp links (e.g. `https://wa.me/`). Tell them to tap the WhatsApp button.
  * **Name Handling**: Address the user by name if known (e.g., "Gints, ..."). If the name is unknown, greet politely and gently ask for their name at the very end of the response (e.g., *“Kā es varētu Jūs uzrunāt?”*). NEVER use string representations like 'null', 'undefined', or 'none'.
  * **Auto-Language**: Respond in the EXACT same language that the user used (Latvian, Russian, or English).
  * **Input Constraint**: The backend enforces a maximum length limit of 140 characters for incoming user messages.

---

## 5. Prismic Custom Types & Slices Workflow

When modifying content schemas or adding localized fields:

1. **Launch Slice Machine**: Run `npm run slicemachine` locally (runs at `http://localhost:9999`).
2. **Configure Types**: Edit custom schemas (e.g., Footer, Settings, custom slices in `src/slices/`).
3. **Save and Codegen**: Run `npx prismic-ts-codegen` to regenerate TypeScript definitions in `prismicio-types.d.ts`.
4. **Fetch Fields**: Add the fields to queries in Server Components (`layout.tsx` or `page.tsx`).
5. **Render & Map**: Provide safe fallback dictionary properties (`t` object) in Client Components.
6. **Push to Prismic**: Push models through the Slice Machine UI, then publish changes inside the online Prismic dashboard.

---

## 6. Design & Aesthetic Guidelines

* **Premium Theme**: Maintain a clean, high-contrast, premium experience using `--main-color` (deep burgundy/maroon) and contrast colors depending on light/dark mode.
* **Transitions**: Use smooth hardware-accelerated transitions for images and hover effects. Apply utility classes like `.hover-scale-103` and `.hover-scale-102`.
* **No Placeholders**: Never use generic grey placeholders. Use high-quality asset resources or generating tools.

---

## 7. Convex Coding Guidelines

Refer to `convex/_generated/ai/guidelines.md` for complete rules. Summary of critical rules:

* **Function Registration**: Include argument validation (`v.string()`, `v.id("table")`, etc.) for ALL functions. Register public functions with `query`, `mutation`, or `action`, and private ones with `internalQuery`, `internalMutation`, or `internalAction`.
* **Query Performance**: Never use `filter` in query pipelines. Always define indexes in `convex/schema.ts` and search using `withIndex` or `withSearchIndex`.
* **Data Limits**: Do not use `.collect()`. Retrieve bounded arrays via `.take(n)` or use `.paginate()` to prevent runtime overhead.
* **Database Transactions**: Never use `ctx.db` inside actions. Actions must only cross-call runtime helpers or use fetch APIs. Keep mutations small to avoid OCC transaction conflicts.
* **Testing**: Write vitest tests inside the `convex/` directory using `convex-test` with `vitest` and `@edge-runtime/vm`.
