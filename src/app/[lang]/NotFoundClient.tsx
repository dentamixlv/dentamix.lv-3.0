'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { renderPageLayout } from '../layoutHelper';
import { components } from '../../slices';

interface NotFoundClientProps {
  enSlices: any[] | null;
  lvSlices: any[] | null;
  fallbackEnUi: React.ReactNode;
  fallbackLvUi: React.ReactNode;
}

export default function NotFoundClient({
  enSlices,
  lvSlices,
  fallbackEnUi,
  fallbackLvUi,
}: NotFoundClientProps) {
  const pathname = usePathname();
  const isEn = /^\/en(\/|$)/.test(pathname);

  const slices = isEn ? enSlices : lvSlices;

  return (
    <>
      <title>{isEn ? 'Page Not Found | Dentamic' : 'Lapa nav atrasta | Dentamic'}</title>
      {slices && slices.length > 0 ? (
        renderPageLayout(slices, components)
      ) : (
        isEn ? fallbackEnUi : fallbackLvUi
      )}
    </>
  );
}
