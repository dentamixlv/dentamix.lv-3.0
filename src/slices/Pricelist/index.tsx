'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import CenasPage, { PriceItem } from '../../components/CenasPage';

type PricelistProps = SliceComponentProps<Content.PricelistSlice>;

export default function Pricelist({ slice }: PricelistProps) {
  const router = useRouter();
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';

  const [priceItems, setPriceItems] = useState<PriceItem[] | undefined>(undefined);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setPriceItems(data);
        }
      } catch (e) {
        console.warn("Failed to fetch price items from Google Sheets API, using fallbacks.", e);
      }
    };
    fetchPrices();
  }, []);

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <CenasPage 
      onBook={handleBook} 
      langCode={langCode} 
      priceItems={priceItems} 
      hideHeader={true}
    />
  );
}


