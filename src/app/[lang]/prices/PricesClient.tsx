'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CenasPage from '../../../components/CenasPage';
import { ShieldCheck, Sparkles, Activity, Scissors, Droplet } from 'lucide-react';

interface PriceItem {
  name: string;
  price: string;
  note?: string;
}

interface PriceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: PriceItem[];
}

interface PricesClientProps {
  langCode: string;
  customPriceItems?: any[] | null;
}

export default function PricesClient({ langCode, customPriceItems }: PricesClientProps) {
  const router = useRouter();
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  let customPriceData: PriceCategory[] | undefined = undefined;

  if (customPriceItems && customPriceItems.length > 0) {
    // Sort by order index
    const sortedDocs = [...customPriceItems].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Group by category name
    const categoriesMap: Record<string, PriceItem[]> = {};
    sortedDocs.forEach(d => {
      const cat = d.category || 'Higiēna un profilakse';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push({
        name: d.name || '',
        price: d.price || '',
        note: d.note || undefined
      });
    });

    const getIcon = (catId: string) => {
      switch (catId) {
        case 'higiene': return <Droplet className="w-5 h-5 text-[#de7c8a]" />;
        case 'implanti': return <Scissors className="w-5 h-5 text-[#de7c8a]" />;
        case 'terapija': return <ShieldCheck className="w-5 h-5 text-[#de7c8a]" />;
        case 'estetika': return <Sparkles className="w-5 h-5 text-[#de7c8a]" />;
        case 'ortodontija': return <Activity className="w-5 h-5 text-[#de7c8a]" />;
        default: return <Droplet className="w-5 h-5 text-[#de7c8a]" />;
      }
    };

    const categoryIds: Record<string, string> = {
      'Higiēna un profilakse': 'higiene',
      'Zobu implantācija un ķirurģija': 'implanti',
      'Terapeitiskā zobārstniecība (plombēšana)': 'terapija',
      'Estētiskā zobārstniecība un protezēšana': 'estetika',
      'Ortodontija (kapes & breketes)': 'ortodontija'
    };

    customPriceData = Object.keys(categoriesMap).map(catName => {
      const id = categoryIds[catName] || 'higiene';
      return {
        id,
        title: catName,
        icon: getIcon(id),
        items: categoriesMap[catName]
      };
    });
  }

  return (
    <CenasPage 
      onBook={handleBook} 
      langCode={langCode} 
      customPriceData={customPriceData} 
    />
  );
}
