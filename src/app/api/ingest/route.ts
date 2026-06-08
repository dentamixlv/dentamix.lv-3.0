import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import {
  getDoctors,
  getServices,
  getClinics,
  getBlogPosts,
} from "../../../data";

export async function GET() {
  const warnings: string[] = [];
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not defined");
    }

    const convex = new ConvexHttpClient(convexUrl);
    const chunks: { text: string; source: string }[] = [];

    // 1. Ingest Clinics
    for (const lang of ["lv", "en-us"]) {
      try {
        const clinics = getClinics(lang);
        if (!clinics || clinics.length === 0) {
          warnings.push(`Clinics array is empty for lang ${lang}`);
        } else {
          for (const clinic of clinics) {
            const text = `Klīnika: ${clinic.name} (${lang === "en-us" ? "English" : "Latvian"})
Adrese: ${clinic.address}
Tālrunis: ${clinic.phone}
E-pasts: ${clinic.email}
Darba laiks:
- Darba dienas: ${clinic.workHours.weekdays}
- Sestdienas: ${clinic.workHours.saturday}
- Svētdienas: ${clinic.workHours.sunday}
${clinic.accessibilityAlert ? `Piezīme par pieejamību: ${clinic.accessibilityAlert}` : ""}`;
            chunks.push({ text, source: `clinic:${clinic.id}:${lang}` });
          }
        }
      } catch (e: any) {
        warnings.push(`Failed to process clinics for lang "${lang}": ${e.message || String(e)}`);
      }
    }

    // 2. Ingest Doctors
    for (const lang of ["lv", "en-us"]) {
      try {
        const doctors = getDoctors(lang);
        if (!doctors || doctors.length === 0) {
          warnings.push(`Doctors array is empty for lang ${lang}`);
        } else {
          for (const doc of doctors) {
            const text = `Ārsts/Speciālists: ${doc.title} (${lang === "en-us" ? "English" : "Latvian"})
Loma: ${doc.role} (${doc.category})
Apraksts: ${doc.description}
Biogrāfija: ${doc.fullBio}
Valodas: ${doc.languages.join(", ")}
Specializācija: ${doc.specializations.join(", ")}
Izglītība: ${doc.education.join(", ")}
${doc.qualifications && doc.qualifications.length > 0 ? `Papildu kvalifikācija: ${doc.qualifications.join(", ")}` : ""}
${doc.workplaces && doc.workplaces.length > 0 ? `Darba vietas: ${doc.workplaces.join(", ")}` : ""}`;
            chunks.push({ text, source: `doctor:${doc.id}:${lang}` });
          }
        }
      } catch (e: any) {
        warnings.push(`Failed to process doctors for lang "${lang}": ${e.message || String(e)}`);
      }
    }

    // 3. Ingest Services
    for (const lang of ["lv", "en-us"]) {
      try {
        const services = getServices(lang);
        if (!services || services.length === 0) {
          warnings.push(`Services array is empty for lang ${lang}`);
        } else {
          for (const s of services) {
            const text = `Pakalpojums: ${s.title} (${lang === "en-us" ? "English" : "Latvian"})
Cena/Cenu amplitūda: ${s.priceRange}
Ilgums: ${s.duration}
Apraksts: ${s.description}
Sīkāka informācija: ${s.detailedInfo}`;
            chunks.push({ text, source: `service:${s.id}:${lang}` });
          }
        }
      } catch (e: any) {
        warnings.push(`Failed to process services for lang "${lang}": ${e.message || String(e)}`);
      }
    }

    // 4. Ingest Blogs
    for (const lang of ["lv", "en-us"]) {
      try {
        const blogs = getBlogPosts(lang);
        if (!blogs || blogs.length === 0) {
          warnings.push(`Blogs array is empty for lang ${lang}`);
        } else {
          for (const b of blogs) {
            const text = `Raksts/Blogs: ${b.title} (${lang === "en-us" ? "English" : "Latvian"})
Autors: ${b.author}
Datums: ${b.date}
Lasīšanas laiks: ${b.readTime}
Kategorija: ${b.category}
Apraksts: ${b.description}
Saturs: ${b.detailedContent.join("\n")}`;
            chunks.push({ text, source: `blog:${b.id}:${lang}` });
          }
        }
      } catch (e: any) {
        warnings.push(`Failed to process blogs for lang "${lang}": ${e.message || String(e)}`);
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No document chunks were created. Check warnings for details.",
        warnings
      });
    }

    // 5. Call the Convex Ingestion Action
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
