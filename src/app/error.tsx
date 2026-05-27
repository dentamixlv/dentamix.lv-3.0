'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-4xl font-serif font-bold text-[#511B29] mb-3">Kaut kas nogāja greizi</h2>
      <p className="text-xs text-[#6a5b5e] mb-6">Mājaslapā radās neparedzēta kļūda.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#511B29] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#5d1726] transition-all cursor-pointer"
      >
        Mēģināt vēlreiz
      </button>
    </div>
  );
}
