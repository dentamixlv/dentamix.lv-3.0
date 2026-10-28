export interface PriceItem {
  category: string;
  title: string;
  price: string;
  description: string;
  anchor: string;
  discount?: string;
  originalPrice?: string;
  eyebrow?: string;
}

export function formatDiscount(discountStr: string): string {
  if (!discountStr) return '';
  const trimmed = discountStr.trim();
  if (!trimmed) return '';
  // If purely digits like "20" -> "-20%"
  if (/^\d+$/.test(trimmed)) {
    return `-${trimmed}%`;
  }
  // If digits with percent like "20%" -> "-20%"
  if (/^\d+[\s\xa0]*%$/.test(trimmed)) {
    return `-${trimmed.replace(/[\s\xa0]/g, '')}`;
  }
  return trimmed;
}

export function formatPrice(priceStr: string): string {
  if (!priceStr) return '';
  const trimmed = priceStr.trim();
  if (trimmed.toLowerCase() === 'bez maksas') {
    return trimmed;
  }
  if (trimmed.includes('materiāli')) {
    // e.g. "750,00 + materiāli" -> "750,00 € + materiāli"
    return trimmed.replace(/([\d\s\xa0,]+)/g, (match) => {
      const trimmedMatch = match.trim();
      if (trimmedMatch && !isNaN(Number(trimmedMatch.replace(/[\s\xa0]/g, '').replace(',', '.')))) {
        return `${trimmedMatch} €`;
      }
      return match;
    }).trim();
  }
  // Standard price or range like "70,00-170,00" or "1 000,00"
  if (trimmed && !trimmed.endsWith('€') && !trimmed.endsWith('EUR')) {
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed},00 €`;
    }
    return `${trimmed} €`;
  }
  return trimmed;
}

export async function getPricesFromGoogleSheets(locale: string = 'lv', forceRefresh = false): Promise<PriceItem[]> {
  try {
    const isEn = locale === 'en-us' || locale === 'en';
    const csvUrl = isEn
      ? (process.env.GOOGLE_SHEETS_CSV_URL_EN || "https://docs.google.com/spreadsheets/d/1JmbSDGtun5V56kYeEj9T8LbORPKMkrZ2dRh5IB3kirU/export?format=csv&gid=54843142")
      : (process.env.GOOGLE_SHEETS_CSV_URL_LV || "https://docs.google.com/spreadsheets/d/1JmbSDGtun5V56kYeEj9T8LbORPKMkrZ2dRh5IB3kirU/export?format=csv&gid=0");
    
    // Low cache time so Google Sheets updates appear within seconds
    const fetchOptions: any = forceRefresh
      ? { cache: 'no-store' }
      : { next: { revalidate: 15 } }; // Cache for 15 seconds max

    const response = await fetch(csvUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) {
      return [];
    }

    const results: PriceItem[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      if (values.length >= 3) {
        const stripQuotes = (str: string) => {
          let s = str.trim();
          if (s.startsWith('"') && s.endsWith('"')) {
            s = s.substring(1, s.length - 1);
          }
          return s.trim();
        };

        const category = stripQuotes(values[0]);
        const title = stripQuotes(values[1]);
        const priceRaw = stripQuotes(values[2]);
        const description = stripQuotes(values[3] || '');
        const anchor = stripQuotes(values[4] || '');
        const colF = stripQuotes(values[5] || '');
        const colG = stripQuotes(values[6] || '');

        let discount: string | undefined = undefined;
        let originalPrice: string | undefined = undefined;
        const eyebrow: string | undefined = colG || undefined;

        if (colF) {
          if (colF.includes('|')) {
            const parts = colF.split('|').map(s => s.trim());
            discount = formatDiscount(parts[0]) || undefined;
            originalPrice = formatPrice(parts[1]) || undefined;
          } else {
            discount = formatDiscount(colF) || undefined;
          }
        }

        if (category && title) {
          results.push({
            category,
            title,
            price: formatPrice(priceRaw),
            description,
            anchor,
            discount,
            originalPrice,
            eyebrow
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Error fetching or parsing Google Sheets prices:", error);
    return [];
  }
}
