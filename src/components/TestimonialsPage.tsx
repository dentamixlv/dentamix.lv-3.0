'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CalendarDays, Heart } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  initials: string;
  bgColor: string;
  treatment: string;
  doctor: string;
  rating: number;
  date: string;
  advTag: string;
  quote: string;
  story: string;
}

interface TestimonialsPageProps {
  onBook: () => void;
  langCode?: string;
  customTestimonials?: Testimonial[];
}

export default function TestimonialsPage({ onBook, langCode = 'lv', customTestimonials }: TestimonialsPageProps) {
  const isEn = langCode === 'en-us';

  const testimonialsData: Testimonial[] = customTestimonials || [
    {
      id: 'at-1',
      author: isEn ? 'Kristaps Zarins' : 'Kristaps Zariņš',
      initials: 'KZ',
      bgColor: 'bg-[#400112] text-white',
      treatment: isEn ? 'Dental Implants (Straumann)' : 'Zobu implantācija (Straumann)',
      doctor: 'Dr. Jānis Kalniņš',
      rating: 5,
      date: '12.04.2026',
      advTag: isEn ? 'Premium Quality' : 'Premium kvalitāte',
      quote: isEn ? 'The Swiss implantation was performed quickly, precisely, and completely painlessly.' : 'Šveices implantācija tika veikta ātri, precīzi un pilnīgi nesāpīgi.',
      story: isEn 
        ? 'Outstanding premium quality and precision. A missing side tooth had caused me discomfort for years. After consulting with Dr. Kalnins, who explained the 3D planning workflow in detail, I felt secure. The operation took less than an hour, and I didn\'t even need painkillers afterward. The result is perfect and feels like my own natural tooth.'
        : 'Izcila premium kvalitāte un precizitāte. Zaudētais sānzobs man radīja diskomfortu jau gadiem. Pēc konsultācijas ar Dr. Kalniņu, kurš detalizēti izskaidroja 3D plānošanas gaitu, jutos drošs. Operācija noritēja nepilnā stundā un pēc tam nebija pat nepieciešamības lietot pretsāpju zāles. Rezultāts ir ideāls un jūtas kā mans dabiskais zobs.'
    },
    {
      id: 'at-2',
      author: isEn ? 'Anete Kalnina' : 'Anete Kalniņa',
      initials: 'AK',
      bgColor: 'bg-[#de7c8a] text-white',
      treatment: isEn ? 'Aesthetic Restoration & Smile Design' : 'Estētiskā restaurācija & Smaida plānošana',
      doctor: 'Dr. Anna Bērziņa',
      rating: 5,
      date: '05.05.2026',
      advTag: isEn ? 'Absolute Comfort' : 'Absolūts komforts',
      quote: isEn ? 'My fear of the dentist completely vanished. Gentle touch and an exceptional result.' : 'Bailes no zobārsta pilnībā izgaisa. Maigs pieskāriens un izcils rezultāts.',
      story: isEn
        ? 'I always had a huge fear of the dentist since childhood, but at Dentamic clinic, it vanished completely during my first visit. Dr. Anna Berzina is an unusually calm and empathetic specialist who explains every action step-by-step. My front teeth restoration looks so natural that nobody can tell they were repaired. I am incredibly grateful.'
        : 'Man vienmēr no bērnības bija milzīgas bailes no zobārsta krēsla, bet Dentamic klīnikā tās pilnībā izgaisa pirmās vizītes laikā. Dr. Anna Bērziņa ir neparasti mierīga un iejūtīga speciāliste, kura solis pa solim stāsta par katru darbību. Mana priekšzobu restaurācija izskatās tik dabiski, ka neviens nespēj pateikt, ka tie ir laboti. Esmu bezgala pateicīga.'
    },
    {
      id: 'at-3',
      author: isEn ? 'Marcis Ozolins' : 'Mārcis Ozoliņš',
      initials: 'MO',
      bgColor: 'bg-[#6a5b5e] text-white',
      treatment: isEn ? 'Oral Hygiene & Air-Flow' : 'Mutes dobuma higiēna & Air-Flow',
      doctor: isEn ? 'Dental Hygienist' : 'Zobu higiēniķis',
      rating: 5,
      date: '28.04.2026',
      advTag: isEn ? 'Long-term Guarantees' : 'Ilglaicīgas garantijas',
      quote: isEn ? 'The first time oral hygiene was truly painless and pleasant.' : 'Pirmā reize, kad mutes higiēna tiešām bija nesāpīga un patīkama.',
      story: isEn
        ? 'Usually, my dental hygiene experience elsewhere was associated with sensitivity and stinging, but the Air-Flow pearl system and gentle care here provided a completely different level. The team monitored everything and even taught me how to use dental floss and interdental brushes correctly, explaining enamel protection.'
        : 'Parasti mana pieredze ar zobu higiēnu citur bija saistīta ar jutīgumu un dzelošu sajūtu, bet šeit izmantotā Air-Flow pērļu sistemā un saudzīgā attieksme sniedza pilnīgi citu līmeni. Komanda seko līdzi visam procesam un pat iemācīja pareizāk lietot zobu diegu un starp zobu birstītes, pastāstot par emaljas aizsardzību.'
    },
    {
      id: 'at-4',
      author: isEn ? 'Laura Krumina' : 'Laura Krūmiņa',
      initials: 'LK',
      bgColor: 'bg-[#e2979e]/90 text-[#400112]',
      treatment: isEn ? 'Porcelain Veneers (Veneers)' : 'Porcelāna lamināti (Veneers)',
      doctor: 'Dr. Anna Bērziņa',
      rating: 5,
      date: '20.03.2026',
      advTag: isEn ? 'Outstanding Aesthetics' : 'Izcila Estētika',
      quote: isEn ? 'Veneers completely changed my self-confidence. My smile is radiant!' : 'Lamināti pilnībā mainīja manu pašapziņu. Mans smaids ir mirdzošs!',
      story: isEn
        ? 'Smile modeling and digital planning allowed me to prepare for the process and see the future result. The veneers themselves were made so thin and perfectly adapted to my face shape that they look exceptionally harmonious. The clinic has a premium atmosphere where genuine care is felt.'
        : 'Smaida modelēšana un digitālā plānošana ļāva sagatavoties procesam un redzēt topošo rezultātu. Paši lamināti tika izgatavoti tik plāni un perfekti pielāgoti manai sejas formai, ka izskatās izcili harmoniski. Klīnikā valda īpaša premium atmosfēra, kurā jūtama patiesa rūpība.'
    },
    {
      id: 'at-5',
      author: isEn ? 'Agnese Silina' : 'Agnese Siliņa',
      initials: 'AS',
      bgColor: 'bg-[#5d1726]/85 text-white',
      treatment: isEn ? 'Clear Aligners (Aligners)' : 'Neredzamās iztaisnošanas kapes (Aligners)',
      doctor: 'Dr. Līga Ozoliņa',
      rating: 5,
      date: '15.02.2026',
      advTag: isEn ? 'Power of Technology' : 'Tehnoloģiju jauda',
      quote: isEn ? 'Aligners are comfortable, invisible, and in just 6 months I see amazing progress.' : 'Kapes ir ērtas, nemanāmas un jau 6 mēnešos redzu apbrīnojamu progresu.',
      story: isEn
        ? 'Dr. Ozolina developed a full 3D animation plan for my bite. The clear orthodontic aligners are very easy to care for and are absolutely transparent in daily life. None of my colleagues even noticed I was wearing them. A true discovery for anyone wanting straight teeth without braces.'
        : 'Dr. Ozoliņa izstrādāja pilnu 3D animācijas plānu manam sakodienam. Neredzamās ortodontiskās kapes ir ļoti viegli kopt un tās ir absolūti caurspīdīgas ikdienā. Neviens darba kolēģis pat nepamanīja, ka tās nēsāju. Patiess atklājums ikvienam, kurš vēlas taisnus zobus bez breketēm.'
    },
    {
      id: 'at-6',
      author: isEn ? 'Edgars Purins' : 'Edgars Puriņš',
      initials: 'EP',
      bgColor: 'bg-[#2a302c] text-white',
      treatment: isEn ? 'Bone Augmentation & Implant' : 'Kaula augmentācija & Implants',
      doctor: 'Dr. Jānis Kalniņš',
      rating: 5,
      date: '10.01.2026',
      advTag: isEn ? 'Medical Excellence' : 'Medicīniskā izcilība',
      quote: isEn ? 'Complex bone reconstruction and implantation with highest precision.' : 'Sarežģīta kaula atjaunošana un implantācija ar augstāko precizitāti.',
      story: isEn
        ? 'I had a major jawbone deficiency after an old injury. Dr. Kalnins professionally performed the bone graft and then placed a Straumann implant. The whole process - from sterility in the operating room to follow-up calls from clinic management - was a model of top-tier medical excellence.'
        : 'Man bija liels žokļa kaula trūkums pēc senas traumas. Dr. Kalniņš profesionāli veica kaula transplantāciju un pēc tam ievietoja Straumann implantu. Viss process – no sterilitātes operāciju zālē līdz pēckopšanas zvaniem no klīnikas vadības – bija augstākās klases medicīnas paraugs.'
    }
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const;

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-6" id="testimonials-page-view">
      {/* 1. Header with same badge and style */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {isEn ? 'DENTAMIC ADVANTAGES' : 'DENTAMIC PRIEKŠROCĪBAS'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
          {isEn ? 'Patient Testimonials' : 'Pacientu atsauksmes'}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {isEn 
            ? 'Genuine feedback and heartwarming stories from our patients about their treatment.'
            : 'Mūsu pacientu patiesas atsauksmes un sirsnīgi pieredzes stāsti par veikto ārstēšanu.'}
        </p>
      </motion.div>

      {/* 3. Testimonial Cards Layout matching Doctors / Services Grid Style */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
      >
        {testimonialsData.length > 0 ? (
          testimonialsData.map((item) => (
            <motion.div 
              variants={fadeUpVariants}
              key={item.id} 
              className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              id={`testimonial-card-${item.id}`}
            >
              {/* Upper Card visual block with only stars */}
              <div className="relative bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 overflow-hidden border-b border-[#efedec] flex flex-col items-center justify-center py-8 px-6 text-center">
                {/* Soft ambient background quote marks */}
                <div className="absolute top-4 right-4 text-[#f2dde1]/30 group-hover:text-[#de7c8a]/15 transition-all duration-300">
                  <Quote className="w-10 h-10 transform scale-x-[-1]" />
                </div>

                {/* Stars Rating */}
                <div className="z-10 flex gap-1 justify-center text-[#de7c8a]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#de7c8a] stroke-[#de7c8a]" />
                  ))}
                </div>
              </div>

              {/* Card metadata and content matching Doctor section */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#de7c8a] block mb-1">
                    {item.treatment}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#400112] tracking-tight group-hover:text-[#5d1726] transition-colors">
                    {item.author}
                  </h3>
                  
                  {/* Quoted block inside card */}
                  <blockquote className="border-l-2 border-[#f2dde1] pl-3.5 mt-4 mb-3">
                    <p className="text-xs text-[#400112] leading-relaxed italic font-medium">
                      "{item.quote}"
                    </p>
                  </blockquote>

                  {/* Complete story matching descriptive length of doctors */}
                  <p className="text-xs text-[#6a5b5e] leading-relaxed mt-3 font-normal">
                    {item.story}
                  </p>
                </div>

                {/* Footer timestamp and actions */}
                <div className="mt-8 pt-5 border-t border-[#efedec]/60 flex items-center">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Heart className="w-3.5 h-3.5 text-[#de7c8a] fill-[#de7c8a]/20" />
                    <span className="text-[10px] font-semibold text-slate-500">{item.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white border border-[#efedec] rounded-3xl">
            <Quote className="w-10 h-10 text-[#de7c8a] mx-auto mb-4" />
            <h3 className="text-base font-bold text-[#400112]">
              {isEn ? 'No testimonials found' : 'Netika atrasts neviens atsauksmes stāsts'}
            </h3>
            <p className="text-xs text-[#6a5b5e] mt-1">
              {isEn ? 'The list is currently empty.' : 'Saraksts pašlaik ir tukšs.'}
            </p>
          </div>
        )}
      </motion.div>

      {/* 4. Bottom Quality Standard CTA */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mt-16 bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/25 border border-[#efedec] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
            {isEn ? 'Patient Testimonials' : 'Pacientu atsauksmes'}
          </h2>
          <p className="text-xs text-[#6a5b5e] leading-relaxed">
            {isEn
              ? 'Every patient\'s opinion helps us grow and maintain our standard of excellence. If you recently visited our clinic, we will be happy to receive your story and feedback!'
              : 'Katrs pacienta viedoklis palīdz mums augt un turpināt uzturēt izcilības līmeni. Ja nesen esat apmeklējis mūsu klīniku, priecāsimies saņemt Jūsu stāstu un ieteikumus!'}
          </p>
        </div>
        <button
          onClick={onBook}
          className="btn inline-flex items-center gap-2 bg-[#400112] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-xs font-bold cursor-pointer shadow-lg shadow-[#400112]/15 shrink-0"
          id="testimonials-cta-booking-btn"
        >
          <CalendarDays className="w-4 h-4" />
          {isEn ? 'Join the Smile Stories' : 'Piedalīties smaidu stāstā'}
        </button>
      </motion.div>
    </div>
  );
}
