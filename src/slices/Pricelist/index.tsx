'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { ShieldCheck, Sparkles, Activity, Scissors, Droplet } from 'lucide-react';

import CenasPage from '../../components/CenasPage';
import { createClient } from '../../prismicio';

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

type PricelistProps = SliceComponentProps<Content.PricelistSlice>;

export default function Pricelist({ slice }: PricelistProps) {
  const router = useRouter();
  const params = useParams();
  const langList = params?.lang;
  const langCode = Array.isArray(langList) && langList.length > 0 ? (langList[0] === 'en' ? 'en-us' : 'lv') : 'lv';
  const langPrefix = langCode === 'en-us' ? '/en' : '';

  const [customPriceData, setCustomPriceData] = useState<PriceCategory[] | undefined>(undefined);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const client = createClient();
        const docs = await client.getAllByType('price_item', { lang: langCode });
        if (docs && docs.length > 0) {
          // Sort by order index
          const sortedDocs = [...docs].sort((a, b) => {
            const orderA = Number(a.data.order) || 0;
            const orderB = Number(b.data.order) || 0;
            return orderA - orderB;
          });

          // Group by category
          const categoriesMap: Record<string, PriceItem[]> = {};
          sortedDocs.forEach(d => {
            const cat = d.data.category || 'Higiēna un profilakse';
            if (!categoriesMap[cat]) {
              categoriesMap[cat] = [];
            }
            categoriesMap[cat].push({
              name: d.data.name || '',
              price: d.data.price || '',
              note: d.data.note || undefined
            });
          });

          // Map to PriceCategory structures
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

          const mappedData: PriceCategory[] = Object.keys(categoriesMap).map(catName => {
            const id = categoryIds[catName] || 'higiene';
            return {
              id,
              title: catName,
              icon: getIcon(id),
              items: categoriesMap[catName]
            };
          });

          setCustomPriceData(mappedData);
        }
      } catch (e) {
        console.warn("Failed to fetch price items from Prismic, using fallbacks.", e);
      }
    };
    fetchPrices();
  }, [langCode]);

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <CenasPage 
      onBook={handleBook} 
      langCode={langCode} 
      customPriceData={customPriceData} 
    />
  );
}
