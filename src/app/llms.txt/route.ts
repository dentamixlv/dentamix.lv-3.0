import { getServices, getBlogPosts, getDoctors } from '../../data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://dentamix.lv';

  const doctorsLv = getDoctors('lv');
  const doctorsEn = getDoctors('en-us');
  const servicesLv = getServices('lv');
  const servicesEn = getServices('en-us');
  const blogsLv = getBlogPosts('lv');
  const blogsEn = getBlogPosts('en-us');

  const md = `# Dentamix

> Dentamix is a modern, premium dental clinic with state-of-the-art facilities in Riga and Adazi, Latvia. We offer high-quality dental treatments, aesthetic dentistry, implants, and orthodontics.

This file provides a directory of LLM-friendly documentation and content paths for the Dentamix website.

## Main Pages (Latvian)

- [Sākums](${baseUrl}/): Mājaslapas galvenā lapa.
- [Par mums](${baseUrl}/par-mums): Informācija par klīniku, ārstiem un iekārtām.
- [Pakalpojumi](${baseUrl}/pakalpojumi): Zobārstniecības pakalpojumu saraksts.
- [Zobārsti](${baseUrl}/zobarsti): Mūsu sertificēto speciālistu saraksts.
- [Cenas](${baseUrl}/cenas): Pilns pakalpojumu cenu rādītājs.
- [Blogs](${baseUrl}/blogs): Noderīgi raksti un jaunumi par zobu veselību.
- [Kontakti](${baseUrl}/kontakti): Klīniku darba laiki, adreses Rīgā un Ādažos.
- [Atsauksmes](${baseUrl}/atsauksmes): Pacientu atsauksmes par klīniku.

## Main Pages (English)

- [Home](${baseUrl}/en): English landing page.
- [About Us](${baseUrl}/en/about): Information about our clinic and vision.
- [Services](${baseUrl}/en/services): Dental services directory.
- [Doctors](${baseUrl}/en/doctors): Certified specialists directory.
- [Prices](${baseUrl}/en/prices): Price list in English.
- [Blogs](${baseUrl}/en/blogs): Articles and updates.
- [Contacts](${baseUrl}/en/contacts): Contact details, working hours, locations.
- [Testimonials](${baseUrl}/en/testimonials): Patient feedback.

## Services (Latvian)

${servicesLv.map(s => `- [${s.title}](${baseUrl}/pakalpojumi/${s.id}): ${s.description}`).join('\n')}

## Services (English)

${servicesEn.map(s => `- [${s.title}](${baseUrl}/en/services/${s.id}): ${s.description}`).join('\n')}

## Doctors (Latvian)

${doctorsLv.map(d => `- [${d.name}](${baseUrl}/zobarsti/${d.id}): ${d.description}`).join('\n')}

## Doctors (English)

${doctorsEn.map(d => `- [${d.name}](${baseUrl}/en/doctors/${d.id}): ${d.description}`).join('\n')}

## Blog Posts (Latvian)

${blogsLv.map(b => `- [${b.title}](${baseUrl}/blogs/${b.id}): ${b.description}`).join('\n')}

## Blog Posts (English)

${blogsEn.map(b => `- [${b.title}](${baseUrl}/en/blogs/${b.id}): ${b.description}`).join('\n')}

## Optional

- [Full Content Directory](${baseUrl}/llms-full.txt): Consolidated markdown of all doctors, services, prices, and clinic information.
`;

  return new Response(md, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
