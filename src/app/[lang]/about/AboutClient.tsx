'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#400112] mb-8">
            Par Mums
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Dentamic ir mūsdienīga zobārstniecības klīnika, kas apvieno jaunākās tehnoloģijas 
              un individuālu pieeju katram pacientam. Mūsu mērķis ir nodrošināt augstākās kvalitātes 
              zobārstniecības pakalpojumus ērtā un draudzīgā vidē.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Mūsu komandā strādā pieredzējuši speciālisti, kuri regulāri papildina savas zināšanas 
              un seko līdzi jaunākajām tendencēm zobārstniecībā. Mēs lepojamies ar modernu aprīkojumu 
              un individuālu pieeju katram pacientam.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}