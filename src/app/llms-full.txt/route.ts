import { getServices, getBlogPosts, getDoctors, getClinics } from '../../data';
import { getPricesFromGoogleSheets } from '../../data/prices';

export const dynamic = 'force-dynamic';

export async function GET() {
  const clinicsLv = getClinics('lv');
  const clinicsEn = getClinics('en-us');
  const doctorsLv = getDoctors('lv');
  const doctorsEn = getDoctors('en-us');
  const servicesLv = getServices('lv');
  const servicesEn = getServices('en-us');
  const blogsLv = getBlogPosts('lv');
  const blogsEn = getBlogPosts('en-us');

  let pricesLv: any[] = [];
  let pricesEn: any[] = [];
  try {
    pricesLv = await getPricesFromGoogleSheets('lv');
    pricesEn = await getPricesFromGoogleSheets('en-us');
  } catch (err) {
    console.error("Failed to load prices for llms-full.txt", err);
  }

  let md = `# Dentamix - Full Website Content (LLM Context)

This file contains the complete consolidated text content of the Dentamix website. It is designed for LLMs to ingest in a single request.

---

## 1. Clinics and Contacts

### Latvian Branches

`;

  clinicsLv.forEach(c => {
    md += `#### ${c.name}
- **Adrese**: ${c.address}
- **Telefons**: ${c.phone}
- **E-pasts**: ${c.email}
- **Darba laiks**:
  - Darba dienās: ${c.workHours.weekdays}
  - Sestdienās: ${c.workHours.saturday}
  - Svētdienās: ${c.workHours.sunday}
${c.accessibilityAlert ? `- **Pieejamība**: ${c.accessibilityAlert} ${c.accessibilityAlertSecond || ''}\n` : ''}- **Google Maps saite**: ${c.gmapsLink || 'N/A'}
- **Waze saite**: ${c.waze || 'N/A'}

`;
  });

  md += `### English Branches

`;

  clinicsEn.forEach(c => {
    md += `#### ${c.name}
- **Address**: ${c.address}
- **Phone**: ${c.phone}
- **Email**: ${c.email}
- **Working Hours**:
  - Weekdays: ${c.workHours.weekdays}
  - Saturdays: ${c.workHours.saturday}
  - Sundays: ${c.workHours.sunday}
${c.accessibilityAlert ? `- **Accessibility**: ${c.accessibilityAlert} ${c.accessibilityAlertSecond || ''}\n` : ''}- **Google Maps Link**: ${c.gmapsLink || 'N/A'}
- **Waze Link**: ${c.waze || 'N/A'}

`;
  });

  md += `---

## 2. Dental Services

### Pakalpojumi (Latvian)

`;

  servicesLv.forEach(s => {
    md += `#### ${s.title}
- **Apraksts**: ${s.description}
- **Cenas robežās**: ${s.priceRange}
- **Ilgums**: ${s.duration}
- **Detaļas**: ${s.detailedInfo || s.description}

`;
  });

  md += `### Services (English)

`;

  servicesEn.forEach(s => {
    md += `#### ${s.title}
- **Description**: ${s.description}
- **Price Range**: ${s.priceRange}
- **Duration**: ${s.duration}
- **Details**: ${s.detailedInfo || s.description}

`;
  });

  md += `---

## 3. Specialists / Doctors

### Ārsti (Latvian)

`;

  doctorsLv.forEach(d => {
    const specializationsList = Array.isArray(d.specializations)
      ? d.specializations.map(sp => `  - ${sp}`).join('\n')
      : '  - Nav norādītas';
    const educationList = Array.isArray(d.education)
      ? d.education.map(e => `  - ${e}`).join('\n')
      : '  - Nav norādīta';

    md += `#### ${d.name} (${d.role})
- **Kategorija**: ${d.category}
- **Īss apraksts**: ${d.description}
- **Pilna biogrāfija**: ${d.fullBio}
- **Valodas**: ${Array.isArray(d.languages) ? d.languages.join(', ') : 'Latviešu'}
- **Darba vieta**: ${d.workplace || 'N/A'}
- **Specialitātes**:
${specializationsList}
- **Izglītība**:
${educationList}
${d.qualifications && d.qualifications.length > 0 ? `- **Kvalifikācijas**: \n${d.qualifications.map(q => `  - ${q}`).join('\n')}\n` : ''}
`;
  });

  md += `\n### Doctors (English)\n\n`;

  doctorsEn.forEach(d => {
    const specializationsList = Array.isArray(d.specializations)
      ? d.specializations.map(sp => `  - ${sp}`).join('\n')
      : '  - Not specified';
    const educationList = Array.isArray(d.education)
      ? d.education.map(e => `  - ${e}`).join('\n')
      : '  - Not specified';

    md += `#### ${d.name} (${d.role})
- **Category**: ${d.category}
- **Brief Description**: ${d.description}
- **Full Biography**: ${d.fullBio}
- **Languages**: ${Array.isArray(d.languages) ? d.languages.join(', ') : 'English'}
- **Workplace**: ${d.workplace || 'N/A'}
- **Specializations**:
${specializationsList}
- **Education**:
${educationList}
${d.qualifications && d.qualifications.length > 0 ? `- **Qualifications**: \n${d.qualifications.map(q => `  - ${q}`).join('\n')}\n` : ''}
`;
  });

  md += `\n---\n\n## 4. Prices List\n\n### Zobārstniecības Cenas (Latvian)\n\n`;

  if (pricesLv && pricesLv.length > 0) {
    let currentCategory = '';
    pricesLv.forEach(p => {
      if (p.category !== currentCategory) {
        currentCategory = p.category;
        md += `\n#### ${currentCategory}\n\n`;
      }
      md += `- **${p.title}**: ${p.price}${p.description ? ` (${p.description})` : ''}\n`;
    });
  } else {
    md += `Cenrādis nav pieejams latviešu valodā vai nevarēja tikt ielādēts.\n`;
  }

  md += `\n### Dentistry Prices (English)\n\n`;

  if (pricesEn && pricesEn.length > 0) {
    let currentCategory = '';
    pricesEn.forEach(p => {
      if (p.category !== currentCategory) {
        currentCategory = p.category;
        md += `\n#### ${currentCategory}\n\n`;
      }
      md += `- **${p.title}**: ${p.price}${p.description ? ` (${p.description})` : ''}\n`;
    });
  } else {
    md += `Price list is not available in English or could not be loaded.\n`;
  }

  md += `\n---\n\n## 5. Blog Articles\n\n### Raksti (Latvian)\n\n`;

  blogsLv.forEach(b => {
    const content = Array.isArray(b.detailedContent) ? b.detailedContent.join('\n\n') : (b.detailedContent || 'N/A');
    md += `#### ${b.title}
- **Kategorija**: ${b.category}
- **Datums**: ${b.date}
- **Autors**: ${b.author}
- **Lasīšanas laiks**: ${b.readTime}
- **Apraksts**: ${b.description}
- **Saturs**:
${content}

`;
  });

  md += `### Articles (English)\n\n`;

  blogsEn.forEach(b => {
    const content = Array.isArray(b.detailedContent) ? b.detailedContent.join('\n\n') : (b.detailedContent || 'N/A');
    md += `#### ${b.title}
- **Category**: ${b.category}
- **Date**: ${b.date}
- **Author**: ${b.author}
- **Read Time**: ${b.readTime}
- **Description**: ${b.description}
- **Content**:
${content}

`;
  });

  return new Response(md, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
