export interface PriceItem {
  category: string;
  title: string;
  price: string;
  description: string;
  anchor: string;
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
    return `${trimmed} €`;
  }
  return trimmed;
}

export async function getPricesFromGoogleSheets(): Promise<PriceItem[]> {
  try {
    const csvUrl = process.env.GOOGLE_SHEETS_CSV_URL || "https://docs.google.com/spreadsheets/d/1JmbSDGtun5V56kYeEj9T8LbORPKMkrZ2dRh5IB3kirU/export?format=csv";
    
    // Cast options to bypass fetch extensions typing issues in some environments
    const fetchOptions: any = {
      next: { revalidate: 300 } // Cache for 5 minutes
    };

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

        if (category && title) {
          results.push({
            category,
            title,
            price: formatPrice(priceRaw),
            description,
            anchor
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
