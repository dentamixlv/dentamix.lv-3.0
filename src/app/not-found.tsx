'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-4xl font-serif font-bold text-[#511B29] mb-3">Lapa nav atrasta</h2>
      <p className="text-xs text-[#6a5b5e] mb-6">Atvainojiet, meklētā lapa neeksistē vai ir pārvietota.</p>
      <Link href="/" className="px-6 py-3 bg-[#511B29] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#5d1726] transition-all">
        Atgriezties sākumā
      </Link>
    </div>
  );
}
