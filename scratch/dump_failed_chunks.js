const fs = require('fs');

function extractTextFromPrismic(obj) {
  const texts = [];

  function traverse(node) {
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
        const fullText = node.map((item) => item.text).join("\n").trim();
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

function getPublicUrl(type, uid, lang) {
  const isEn = lang === 'en-us';
  const prefix = isEn ? '/en' : '';
  
  if (type === 'homepage') {
    return isEn ? '/en' : '/';
  }
  
  if (type === 'page' && uid) {
    const staticMap = {
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

function splitParagraph(text, maxLength) {
  const parts = [];
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

function buildChunks(paragraphs, title, url, langName) {
  const chunks = [];
  const maxChunkLength = 1200;
  
  let currentChunk = `Klīnika: Dentamix\nLapa: ${title} (${langName})\nSaite: ${url}\nSaturs:\n`;
  const headerLength = currentChunk.length;
  const maxContentLength = maxChunkLength - headerLength;

  const flatParagraphs = [];
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

fetch('https://dentamix-v30.cdn.prismic.io/api/v2')
  .then(r => r.json())
  .then(apiData => {
    const masterRef = apiData.refs.find(r => r.isMasterRef).ref;
    const url = `https://dentamix-v30.cdn.prismic.io/api/v2/documents/search?ref=${masterRef}&lang=*&pageSize=100`;
    return fetch(url);
  })
  .then(r => r.json())
  .then(res => {
    const documents = res.results;
    const chunks = [];

    for (const doc of documents) {
      const langName = doc.lang === 'en-us' ? 'English' : 'Latvian';

      if (doc.type === 'footer') {
        const logoText = doc.data?.logo_text || '';
        const description = doc.data?.description || '';
        const clinics = doc.data?.clinics || [];

        if (description) {
          const text = `Klīnika: Dentamix (Vispārīgā informācija) (${langName})\nApraksts: ${description}\nLogo: ${logoText}`;
          chunks.push({ text, source: `footer:${doc.lang}` });
        }

        for (const clinic of clinics) {
          const text = `Klīnika: ${clinic.name || 'Dentamix'} (Valoda: ${langName})
Adrese: ${clinic.address || ''}
Tālrunis: ${clinic.phone || ''}
E-pasts: ${clinic.email || ''}
Darba laiks:
- Darba dienas: ${clinic.work_hours_weekdays || ''}
- Sestdienas: ${clinic.work_hours_saturday || ''}
- Svētdienas: ${clinic.work_hours_sunday || ''}
${clinic.accessibility_alert ? `Piezīme par pieejamību: ${clinic.accessibility_alert}` : ''}`;
          chunks.push({ text, source: `footer:clinic:${clinic.name || 'info'}:${doc.lang}` });
        }
        continue;
      }

      if (['menu', 'settings'].includes(doc.type)) {
        continue;
      }

      const title = doc.data?.meta_title || doc.data?.title || doc.uid || doc.type;
      const docUrl = getPublicUrl(doc.type, doc.uid, doc.lang);
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

      const docChunks = buildChunks(filteredParas, title, docUrl, langName);
      for (const text of docChunks) {
        chunks.push({ text, source: docUrl });
      }
    }

    const targets = ['/atsauksmes', '/zobarsti/marika-veldre', '/pakalpojumi/zobu-kirurgija', '/en/services/pediatric-dentistry', '/privatuma-politika'];
    const output = {};
    targets.forEach(target => {
      output[target] = chunks.filter(c => c.source === target).map(c => c.text);
    });
    fs.writeFileSync('scratch/failed_chunks.json', JSON.stringify(output, null, 2));
    console.log("Dumped failed chunks to scratch/failed_chunks.json");
  })
  .catch(console.error);
