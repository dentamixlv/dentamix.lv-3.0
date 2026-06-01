'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import ServicesClient from '../../app/[lang]/services/ServicesClient';
import { getServices } from '../../data';
import { Service } from '../../types';
import { createClient } from '../../prismicio';

type ServicePageProps = SliceComponentProps<Content.ServicePageSlice>;

export default function ServicePage({ slice }: ServicePageProps) {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList.length > 0 && langList[0] === 'en');
  const langCode = isEn ? 'en-us' : 'lv';

  const [services, setServices] = useState<Service[] | null>(null);

  // Check if items are provided (linked service documents)
  const hasLinkedServices = slice.items && slice.items.length > 0 && slice.items.some(item => isFilled.link(item.service));

  useEffect(() => {
    const fetchServices = async () => {
      const linkedItems = slice.items || [];
      try {
        const client = createClient();
        let docs = [];

        if (hasLinkedServices) {
          // Fetch specific linked services
          const ids = linkedItems
            .map(item => (isFilled.link(item.service) && (item.service as any).id) || '')
            .filter(Boolean);
          if (ids.length > 0) {
            const response = await client.getByIDs(ids, { lang: langCode });
            docs = response.results;
          }
        } else {
          // Query all services from Prismic
          const response = await client.getAllByType('service', { lang: langCode });
          docs = response;
        }

        if (docs && docs.length > 0) {
          setServices(docs.map(d => ({
            id: d.uid!,
            title: d.data.title || '',
            description: d.data.description || '',
            detailedInfo: Array.isArray(d.data.detailedInfo) ? (d.data.detailedInfo[0] as any)?.text || '' : (d.data.detailedInfo as any) || '',
            priceRange: d.data.priceRange || '',
            duration: d.data.duration || '',
            iconName: d.data.iconName || 'Sparkles',
            image: d.data.image?.url || 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800',
          })));
        } else {
          setServices(getServices(langCode));
        }
      } catch (e) {
        console.warn("Failed to fetch services in ServicePage, using fallbacks.", e);
        setServices(getServices(langCode));
      }
    };
    fetchServices();
  }, [hasLinkedServices, slice.items, langCode]);

  const hideHeaderValue = slice.primary.hideHeader !== null && slice.primary.hideHeader !== undefined 
    ? slice.primary.hideHeader 
    : true;

  return (
    <ServicesClient 
      langCode={langCode} 
      customServices={services} 
      hideHeader={hideHeaderValue} 
    />
  );
}
