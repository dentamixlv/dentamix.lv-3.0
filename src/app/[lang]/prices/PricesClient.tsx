'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CenasPage, { PriceItem } from '../../../components/CenasPage';

interface PricesClientProps {
  langCode: string;
  initialPriceItems?: PriceItem[];
}

export default function PricesClient({ langCode, initialPriceItems = [] }: PricesClientProps) {
  const router = useRouter();
  const [priceItems, setPriceItems] = useState<PriceItem[]>(initialPriceItems);

  useEffect(() => {
    if (!initialPriceItems || initialPriceItems.length === 0) {
      const fetchPrices = async () => {
        try {
          const response = await fetch(`/api/prices?lang=${langCode}`);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              setPriceItems(data);
            }
          }
        } catch (error) {
          console.warn("Client-side prices fetch fallback failed:", error);
        }
      };
      fetchPrices();
    }
  }, [initialPriceItems]);

  const handleBook = () => {
    router.push(langCode === 'en-us' ? '/en/contacts' : '/kontakti');
  };

  return (
    <CenasPage 
      onBook={handleBook} 
      langCode={langCode} 
      priceItems={priceItems} 
    />
  );
}

