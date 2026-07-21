import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { createClient } from "../../../prismicio";
import { getPricesFromGoogleSheets } from "../../../data/prices";

export const dynamic = "force-dynamic";

function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u00a0/g, " ") // replace non-breaking space with regular space
    .replace(/\u200b/g, "")  // remove zero-width space
    .replace(/\u00ad/g, "")  // remove soft hyphen
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // remove control characters
}

function extractTextFromPrismic(obj: any): string[] {
  const texts: string[] = [];

  function traverse(node: any) {
    if (!node) return;
    if (typeof node === "string") {
      const trimmed = node.trim();
      if (trimmed && trimmed.length > 3 && !trimmed.startsWith("http")) {
        texts.push(trimmed);
      }
      return;
    }
    if (Array.isArray(node)) {
      const isRichText = node.length > 0 && node.every(item => item && typeof item.type === "string" && typeof item.text === "string");
      if (isRichText) {
        const fullText = node.map((item: any) => item.text).join("\n").trim();
        if (fullText) {
          texts.push(fullText);
        }
        return;
      }
      for (const item of node) {
        traverse(item);
      }
      return;
    }
    if (typeof node === "object") {
      for (const key of Object.keys(node)) {
        if (["link_type", "dimensions", "copyright", "edit", "id", "slice_type", "slice_label", "variation", "version"].includes(key)) {
          continue;
        }
        traverse(node[key]);
      }
    }
  }

  traverse(obj);
  return texts;
}

function getPublicUrl(type: string, uid: string | null, lang: string): string {
  const isEn = lang === 'en-us';
  const prefix = isEn ? '/en' : '';
  
  if (type === 'homepage') {
    return isEn ? '/en' : '/';
  }
  
  if (type === 'page' && uid) {
    const staticMap: Record<string, { en: string; lv: string }> = {
      'about': { en: '/about', lv: '/par-mums' },
      'par-mums': { en: '/about', lv: '/par-mums' },
      'services': { en: '/services', lv: '/pakalpojumi' },
      'pakalpojumi': { en: '/services', lv: '/pakalpojumi' },
      'doctors': { en: '/doctors', lv: '/zobarsti' },
      'zobarsti': { en: '/doctors', lv: '/zobarsti' },
      'prices': { en: '/prices', lv: '/cenas' },
      'cenas': { en: '/prices', lv: '/cenas' },
      'blogs': { en: '/blogs', lv: '/blogs' },
      'contacts': { en: '/contacts', lv: '/kontakti' },
      'kontakti': { en: '/contacts', lv: '/kontakti' },
      'testimonials': { en: '/testimonials', lv: '/atsauksmes' },
      'atsauksmes': { en: '/testimonials', lv: '/atsauksmes' },
      'privacy-policy': { en: '/privacy-policy', lv: '/privatuma-politika' },
      'privatuma-politika': { en: '/privacy-policy', lv: '/privatuma-politika' },
      'cookie-policy': { en: '/cookie-policy', lv: '/sikdatnu-politika' },
      'sikdatnu-politika': { en: '/cookie-policy', lv: '/sikdatnu-politika' },
    };

    if (staticMap[uid]) {
      return isEn ? `/en${staticMap[uid].en}` : staticMap[uid].lv;
    }

    const doctorsList = [
      'ineta-majore', 'jelena-smirnova', 'marija-berzina', 'marika-veldre', 
      'jolanta-reine', 'alvis-sapals', 'kristine-brauna', 'eliza-blumberga', 
      'kristine-andersone', 'oksana-murniece', 'vita-graudina', 'inese-dance'
    ];
    if (doctorsList.includes(uid)) {
      return isEn ? `/en/doctors/${uid}` : `/zobarsti/${uid}`;
    }

    const servicesList = [
      'zobu-sapes', 'zobu-izmeklesana', 'bernu-zobarsts', 'zobu-abscess', 
      'sastrutojis-zobs', 'zobu-kirurgija', 'zobu-balinasana', 'zobu-implanti', 
      'zobu-protezesana', 'zobu-higiena', 'zobu-endodontija', 'zobu-terapija',
      'pediatric-dentistry', 'teeth-whitening', 'dental-implants', 'dental-prosthetics', 
      'dental-check-up', 'dental-hygiene', 'dental-therapy', 'dental-surgery', 'endodontics'
    ];
    if (servicesList.includes(uid)) {
      return isEn ? `/en/services/${uid}` : `/pakalpojumi/${uid}`;
    }

    const blogsList = [
      '5-zobu-izmeklesanas-ieguvumi', 'mutes-higiena', 'neredzamas-kapes', 'porcelana-laminati'
    ];
    if (blogsList.includes(uid)) {
      return isEn ? `/en/blogs/${uid}` : `/blogs/${uid}`;
    }

    return isEn ? `/en/${uid}` : `/${uid}`;
  }
  
  return prefix || '/';
}

function splitParagraph(text: string, maxLength: number): string[] {
  const parts: string[] = [];
  let remaining = text;
  
  while (remaining.length > maxLength) {
    let splitIdx = remaining.lastIndexOf(' ', maxLength);
    if (splitIdx === -1 || splitIdx < maxLength * 0.7) {
      splitIdx = maxLength;
    }
    parts.push(remaining.substring(0, splitIdx).trim());
    remaining = remaining.substring(splitIdx).trim();
  }
  
  if (remaining.length > 0) {
    parts.push(remaining);
  }
  
  return parts;
}

function buildChunks(paragraphs: string[], title: string, url: string, langName: string): string[] {
  const chunks: string[] = [];
  const maxChunkLength = 1200;
  
  let currentChunk = `Klīnika: Dentamix\nLapa: ${title} (${langName})\nSaite: ${url}\nSaturs:\n`;
  const headerLength = currentChunk.length;
  const maxContentLength = maxChunkLength - headerLength;

  const flatParagraphs: string[] = [];
  for (const para of paragraphs) {
    if (para.length > maxContentLength) {
      const splitParas = splitParagraph(para, maxContentLength - 50);
      flatParagraphs.push(...splitParas);
    } else {
      flatParagraphs.push(para);
    }
  }
  
  for (const para of flatParagraphs) {
    if (currentChunk.length + para.length + 2 > maxChunkLength) {
      if (currentChunk.length > headerLength) {
        chunks.push(currentChunk.trim());
        currentChunk = `Klīnika: Dentamix\nLapa: ${title} (${langName})\nSaite: ${url}\nSaturs:\n`;
      }
      currentChunk += para + "\n\n";
    } else {
      currentChunk += para + "\n\n";
    }
  }
  
  if (currentChunk.length > headerLength) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export async function GET(request: Request) {
  if (request.method === "HEAD") {
    return new Response(null, { status: 200 });
  }
  const warnings: string[] = [];
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not defined");
    }

    const convex = new ConvexHttpClient(convexUrl);
    const client = createClient();
    
    // Fetch all documents of all locales
    const documents = await client.dangerouslyGetAll({ lang: "*" });
    const chunks: { text: string; source: string }[] = [];

    for (const doc of documents) {
      const langName = doc.lang === 'en-us' ? 'English' : 'Latvian';

      // 1. Process layout elements (Footer)
      if (doc.type === 'footer') {
        const logoText = doc.data?.logo_text || '';
        const description = doc.data?.description || '';
        const clinics = doc.data?.clinics || [];

        if (description) {
          const text = sanitizeText(`Klīnika: Dentamix (Vispārīgā informācija) (${langName})\nApraksts: ${description}\nLogo: ${logoText}`);
          chunks.push({ text, source: `footer:${doc.lang}` });
        }

        for (const clinic of clinics) {
          const text = sanitizeText(`Klīnika: ${clinic.name || 'Dentamix'} (Valoda: ${langName})
Adrese: ${clinic.address || ''}
Tālrunis: ${clinic.phone || ''}
E-pasts: ${clinic.email || ''}
Darba laiks:
- Darba dienas: ${clinic.work_hours_weekdays || ''}
- Sestdienas: ${clinic.work_hours_saturday || ''}
- Svētdienas: ${clinic.work_hours_sunday || ''}
${clinic.accessibility_alert ? `Piezīme par pieejamību: ${clinic.accessibility_alert}` : ''}`);
          chunks.push({ text, source: `footer:clinic:${clinic.name || 'info'}:${doc.lang}` });
        }
        continue;
      }

      // Skip non-searchable document types (e.g. menus, settings)
      if (['menu', 'settings'].includes(doc.type)) {
        continue;
      }

      // 2. Process page and homepage documents
      const title = (doc.data as any)?.meta_title || (doc.data as any)?.title || doc.uid || doc.type;
      const url = getPublicUrl(doc.type, doc.uid, doc.lang);
      const paragraphs = extractTextFromPrismic(doc.data);

      const filteredParas = paragraphs.filter(p => {
        const lower = p.toLowerCase();
        return p.length > 3 && 
               !lower.startsWith('http') && 
               !lower.includes('lucide') && 
               !lower.includes('waze') &&
               !lower.includes('review') &&
               p !== 'Pieteikt vizīti' &&
               p !== 'Book appointment' &&
               p !== 'Apskatīt pakalpojumus' &&
               p !== 'View services';
      });

      const docChunks = buildChunks(filteredParas, title, url, langName);
      for (const text of docChunks) {
        chunks.push({ text: sanitizeText(text), source: url });
      }
    }

    // 3. Process Google Sheets prices
    try {
      const pricesLv = await getPricesFromGoogleSheets('lv');
      if (pricesLv && pricesLv.length > 0) {
        const categoriesLv = new Map<string, typeof pricesLv>();
        for (const item of pricesLv) {
          const list = categoriesLv.get(item.category) || [];
          list.push(item);
          categoriesLv.set(item.category, list);
        }
        for (const [category, items] of categoriesLv.entries()) {
          let text = `Klīnika: Dentamix\nLapa: Zobārstniecības Cenas - ${category} (Latvian)\nSaite: /cenas\nSaturs:\nKategorija: ${category}\nCenrādis:\n`;
          for (const item of items) {
            text += `- ${item.title}: ${item.price}${item.description ? ` (${item.description})` : ''}\n`;
          }
          chunks.push({ text: sanitizeText(text), source: '/cenas' });
        }
      }
    } catch (e: any) {
      console.warn("Failed to ingest Latvian prices from Google Sheets:", e);
      warnings.push(`Latvian prices ingestion warning: ${e.message}`);
    }

    try {
      const pricesEn = await getPricesFromGoogleSheets('en-us');
      if (pricesEn && pricesEn.length > 0) {
        const categoriesEn = new Map<string, typeof pricesEn>();
        for (const item of pricesEn) {
          const list = categoriesEn.get(item.category) || [];
          list.push(item);
          categoriesEn.set(item.category, list);
        }
        for (const [category, items] of categoriesEn.entries()) {
          let text = `Klīnika: Dentamix\nLapa: Dental Prices - ${category} (English)\nSaite: /en/prices\nSaturs:\nCategory: ${category}\nPricelist:\n`;
          for (const item of items) {
            text += `- ${item.title}: ${item.price}${item.description ? ` (${item.description})` : ''}\n`;
          }
          chunks.push({ text: sanitizeText(text), source: '/en/prices' });
        }
      }
    } catch (e: any) {
      console.warn("Failed to ingest English prices from Google Sheets:", e);
      warnings.push(`English prices ingestion warning: ${e.message}`);
    }

    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No document chunks were created. Check Prismic connection.",
        warnings
      });
    }

    // Call the Convex Ingestion Action
    const result: any = await convex.action(api.documents.ingest, { chunks });

    return NextResponse.json({
      success: true,
      count: result.count,
      errors: result.errors,
      warnings
    });
  } catch (error: any) {
    console.error("Ingestion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
        warnings
      },
      { status: 500 }
    );
  }
}
