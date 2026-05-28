'use client';

import React from 'react';
import ContactFormSliceComponent from '../../../slices/ContactForm';

interface ContactsClientProps {
  langCode: string;
}

export default function ContactsClient({ langCode }: ContactsClientProps) {
  // Fallback using our self-contained ContactForm slice
  const mockSlice = {
    slice_type: "contact_form" as const,
    slice_label: null,
    variation: "default" as const,
    id: "contacts-page-fallback",
    primary: {
      title: [
        {
          type: "heading2" as const,
          text: langCode === 'en-us' ? "Our Clinics & Contacts" : "Mūsu klīnikas un kontakti",
          spans: [],
          direction: "ltr" as const
        }
      ],
      subtitle: langCode === 'en-us' 
        ? "We will be glad to see you and provide the best dental assistance."
        : "Būsim priecīgi Jūs redzēt un sniegt labāko palīdzību."
    },
    items: []
  };

  return (
    <ContactFormSliceComponent 
      slice={mockSlice as any} 
      index={0} 
      slices={[]} 
      context={null} 
    />
  );
}
