import React from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../slices';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export interface PageLayoutOptions {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

/**
 * Automatically groups and renders slices in a modular two-column grid.
 * - Slices before PageBlock/WidgetBlock render full-width at the top.
 * - Slices inside the columns render side-by-side (Left: PageBlock & other content, Right: WidgetBlock).
 * - Slices after WidgetBlock render full-width at the bottom.
 */
export function renderPageLayout(
  slices: any[] | null,
  pageComponents: any = components,
  options?: PageLayoutOptions
) {
  if (!slices || slices.length === 0) {
    return null;
  }

  const pageBlockIndex = slices.findIndex(s => s.slice_type === 'page_block');
  const widgetBlockIndex = slices.findIndex(s => s.slice_type === 'widget_block');

  // If no WidgetBlock (sidebar) is present, render everything full-width sequentially
  if (widgetBlockIndex === -1) {
    return <SliceZone slices={slices} components={pageComponents} />;
  }

  // Find the index of the first layout block
  const firstLayoutIndex = pageBlockIndex !== -1 && pageBlockIndex < widgetBlockIndex
    ? pageBlockIndex
    : widgetBlockIndex;

  // Slices above the layout grid (e.g. PageTitle, Hero)
  const topSlices = slices.slice(0, firstLayoutIndex);

  const bottomSliceTypes = [
    'cta_block',
    'testimonial_block',
    'testimonial_grid',
    'partner_block',
    'contact_block',
    'doctor_grid',
    'service_grid',
    'blog_grid'
  ];

  // Slices inside the main left content column
  const leftColumnSlices = slices.filter((s, idx) => 
    idx >= firstLayoutIndex && 
    s.slice_type !== 'widget_block' &&
    !(idx > widgetBlockIndex && bottomSliceTypes.includes(s.slice_type))
  );

  // The sidebar widget slice
  const rightColumnSlice = slices[widgetBlockIndex];

  // Slices below the layout grid (e.g. bottom CTABlocks, footer content)
  const bottomSlices = slices.filter((s, idx) => 
    idx > widgetBlockIndex && 
    bottomSliceTypes.includes(s.slice_type)
  );

  const pbClass = (bottomSlices.length === 0 && options?.showBackButton)
    ? "pb-8 md:pb-12"
    : "pb-16 md:pb-24";

  return (
    <>
      {topSlices.length > 0 && (
        <SliceZone slices={topSlices} components={pageComponents} />
      )}

      <div className={`max-w-7xl mx-auto px-6 pt-2 md:pt-4 ${pbClass}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
          {/* Main Left Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {leftColumnSlices.length > 0 ? (
              <SliceZone 
                slices={leftColumnSlices} 
                components={pageComponents} 
                context={{ isEmbedded: true }} 
              />
            ) : (
              <div className="text-slate-400 py-12 text-center border border-dashed border-slate-200 rounded-3xl">
                Add content slices (e.g. PageBlock) in Prismic to populate this column.
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <SliceZone 
              slices={[rightColumnSlice]} 
              components={pageComponents} 
              context={{ isEmbedded: true }} 
            />
          </div>
        </div>

      </div>

      {bottomSlices.length > 0 && (
        <SliceZone slices={bottomSlices} components={pageComponents} context={{ isBottom: true }} />
      )}

      {options?.showBackButton && options.backButtonHref && (
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 md:pb-24 text-center">
          <Link 
            href={options.backButtonHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
            {options.backButtonText || 'Back'}
          </Link>
        </div>
      )}
    </>
  );
}
