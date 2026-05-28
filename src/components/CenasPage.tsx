'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CalendarDays, ShieldCheck, Sparkles, Activity, Scissors, Droplet } from 'lucide-react';

interface PriceItem {
  name: string;
  price: string;
  note?: string;
}

interface PriceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: PriceItem[];
}

interface CenasPageProps {
  onBook: () => void;
  langCode?: string;
  customPriceData?: PriceCategory[];
}

export default function CenasPage({ onBook, langCode = 'lv', customPriceData }: CenasPageProps) {
  const isEn = langCode === 'en-us';

  const priceData: PriceCategory[] = customPriceData || [
    {
      id: 'higiene',
      title: isEn ? 'Hygiene and prevention' : 'Higiēna un profilakse',
      icon: <Droplet className="w-5 h-5 text-[#de7c8a]" />,
      items: [
        { 
          name: isEn ? 'Professional oral hygiene (both jaws)' : 'Profesionālā mutes dobuma higiēna (abi žokļi)', 
          price: '85 €', 
          note: isEn ? 'Ultrasonic tartar scaling, Air-Flow polishing, fluoridation' : 'Zobakmens noņemšana ar ultraskaņu, pigmentācijas likvidēšana ar Air-Flow, pulēšana' 
        },
        { 
          name: isEn ? 'Hygiene for patients with orthodontic appliances' : 'Higiēna pacientiem ar ortodontiskām ierīcēm', 
          price: '95 €', 
          note: isEn ? 'Individual care around brackets and wires' : 'Individuāla pieeja apkārt breketēm un stieplēm' 
        },
        { 
          name: isEn ? 'Fluoride varnish treatment' : 'Zobu apstrāde ar fluorīda preparātu', 
          price: '30 €', 
          note: isEn ? 'Enamel strengthening and sensitivity reduction' : 'Emaljas stiprināšanai un jutīguma mazināšanai' 
        },
        { 
          name: isEn ? 'Home teeth whitening kit with custom trays' : 'Zobu balināšana ar progresīvo kapu sistēmu', 
          price: '250 €', 
          note: isEn ? 'Take-home kit – custom trays and premium whitening gel' : 'Komplekts mājām – kapes un augstākās klases balinošais gēls' 
        },
        { 
          name: isEn ? 'In-office teeth whitening' : 'Zobu balināšana klīnikā', 
          price: '350 €', 
          note: isEn ? 'Complete and painless whitening of both jaws in one session' : 'Pilna un nesāpīga divu žokļu balināšana vienā seansā' 
        }
      ]
    },
    {
      id: 'implanti',
      title: isEn ? 'Dental implantology and surgery' : 'Zobu implantācija un ķirurģija',
      icon: <Scissors className="w-5 h-5 text-[#de7c8a]" />,
      items: [
        { 
          name: isEn ? 'First surgeon / implantologist consultation' : 'Ķirurga / Implantologa pirmreizēja konsultācija', 
          price: '50 €', 
          note: isEn ? 'Treatment planning based on 3D CT scan data' : 'Ārstēšanas plāna izstrāde pēc 3D datortomogrāfijas datiem' 
        },
        { 
          name: isEn ? 'Simple tooth extraction' : 'Zoba ekstrakcija (vienkārša)', 
          price: '65 € - 90 €', 
          note: isEn ? 'Under complete and painless local anesthesia' : 'Pilnā un nesāpīgā lokālā anestēzijā' 
        },
        { 
          name: isEn ? 'Complex / wisdom tooth extraction' : 'Sarežģīta zoba / gudrības zoba ekstrakcija', 
          price: '120 € - 220 €', 
          note: isEn ? 'Surgical extraction under microscope or CT guidance' : 'Slēgtā un mikroskopa vai CT kontrolētā ķirurģija' 
        },
        { 
          name: isEn ? 'Premium dental implant (Straumann / Nobel Biocare)' : 'Premium zobu implants (Straumann / Nobel Biocare)', 
          price: '750 €', 
          note: isEn ? 'Includes implant screw and sterile surgical work' : 'Cenā ietilpst implanta skrūve un sterils ķirurģiskais darbs' 
        },
        { 
          name: isEn ? 'Abutment installation' : 'Implanta fiksācijas detaļa (Abutment) un uzstādīšana', 
          price: '250 €', 
          note: isEn ? 'Custom connection for natural-looking gum aesthetics' : 'Individuāli pielāgots savienotājs labākai smaganu estētikai' 
        },
        { 
          name: isEn ? 'Sinus lift (maxillary sinus floor elevation)' : 'Sinus-lifts (augšžokļa dobuma pamatnes pacelšana)', 
          price: '550 € - 850 €', 
          note: isEn ? 'Surgical bone height increase for safe implant placement' : 'Ķirurģiska kaula apjoma palielināšana drošai implantācijai' 
        },
        { 
          name: isEn ? 'Bone graft (augmentation)' : 'Kaula augmentācija (kaula transplantācija)', 
          price: 'from 450 €', 
          note: isEn ? 'Synthetic or autogenous bone graft to increase volume' : 'Sintētiskā vai pacienta paša kaula apjoma papildināšana' 
        }
      ]
    },
    {
      id: 'terapija',
      title: isEn ? 'Therapeutic dentistry (fillings)' : 'Terapeitiskā zobārstniecība (plombēšana)',
      icon: <ShieldCheck className="w-5 h-5 text-[#de7c8a]" />,
      items: [
        { 
          name: isEn ? 'Initial checkup and consultation' : 'Sākotnējā apskate un konsultācija', 
          price: '25 €', 
          note: isEn ? 'Visual inspection, diagnosis of oral health status' : 'Mutes dobuma stāvokļa diagnosticēšana, vizuāla apskate' 
        },
        { 
          name: isEn ? 'Dental X-ray (digital)' : 'Zoba rentgenuzņēmums (digitāls)', 
          price: '15 €', 
          note: isEn ? 'Low-radiation dose digital radiography' : 'Minimāla starojuma devas digitālā radiogrāfija' 
        },
        { 
          name: isEn ? 'Aesthetic composite filling (small)' : 'Estētiskā kompozīta plomba (maza)', 
          price: '65 €', 
          note: isEn ? 'German and Swiss nanocomposites, customized shade matching' : 'Vācijas un Šveices nanokompozīti, krāsas salāgošana' 
        },
        { 
          name: isEn ? 'Aesthetic composite filling (medium)' : 'Estētiskā kompozīta plomba (vidēja)', 
          price: '85 €', 
          note: isEn ? 'Full anatomical shape restoration of the tooth' : 'Zoba anatomiskās formas pilnvērtīga restaurācija' 
        },
        { 
          name: isEn ? 'Aesthetic composite filling (large / crown build-up)' : 'Estētiskā kompozīta plomba (liela / zoba kroņa atjaunošana)', 
          price: '110 € - 140 €', 
          note: isEn ? 'Durable decay restoration, enamel replication' : 'Izturīga kariesa aizvietošana, emaljas imitācija' 
        },
        { 
          name: isEn ? 'Root canal treatment (endodontics) under microscope' : 'Zoba sakņu kanāla ārstēšana (endodontija) ar mikroskopu', 
          price: 'from 120 €', 
          note: isEn ? 'Per single canal. Precise instrumentation, disinfection and obturation' : 'Par vienu kanālu. Precīza instrumentācija, dezinfekcija un pildīšana' 
        }
      ]
    },
    {
      id: 'estetika',
      title: isEn ? 'Aesthetic dentistry and prosthodontics' : 'Estētiskā zobārstniecība un protezēšana',
      icon: <Sparkles className="w-5 h-5 text-[#de7c8a]" />,
      items: [
        { 
          name: isEn ? 'Premium dental porcelain veneer' : 'Premium zobu porcelāna lamināts (Veneer)', 
          price: '480 € - 650 €', 
          note: isEn ? 'Custom laboratory-crafted Swiss ceramic veneer' : 'Laboratorijā individuāli izstrādāts plāns Šveices keramikas zobs' 
        },
        { 
          name: isEn ? 'Zirconia crown' : 'Cirkonija dioksīda kronis', 
          price: '450 € - 550 €', 
          note: isEn ? 'Superior aesthetics and strength with CAD/CAM precision' : 'Augstākā estētika un izturība ar CAD/CAM precizitāti' 
        },
        { 
          name: isEn ? 'Porcelain-fused-to-metal crown' : 'Metālkeramikas kronis', 
          price: '380 €', 
          note: isEn ? 'Solid classic restoration for the posterior segment' : 'Masīva klasiska konstrukcija sānu zobu segmentam' 
        },
        { 
          name: isEn ? 'Temporary tooth crown' : 'Zoba pagaidu kronis', 
          price: '60 €', 
          note: isEn ? 'Placed immediately during fabrication of the permanent crown' : 'Uzstāda nekavējoties pastāvīgā darba ražošanas laikā' 
        },
        { 
          name: isEn ? 'Smile simulation and digital smile design (DSD)' : 'Smaida modelēšana un digitālā smaidu plānošana (DSD)', 
          price: '150 €', 
          note: isEn ? 'Photo shooting, simulation on screen and mock-up try-in' : 'Fotofiksācija un simulācija uz ekrāna un mutē' 
        }
      ]
    },
    {
      id: 'ortodontija',
      title: isEn ? 'Orthodontics (aligners & braces)' : 'Ortodontija (kapes & breketes)',
      icon: <Activity className="w-5 h-5 text-[#de7c8a]" />,
      items: [
        { 
          name: isEn ? 'Initial orthodontic consultation & 3D scan' : 'Ortodonta pirmreizējā konsultācija un 3D skenēšana', 
          price: '60 €', 
          note: isEn ? 'Digital diagnostic model setup' : 'Digitālais diagnostiskais modelis' 
        },
        { 
          name: isEn ? 'Clear aligner therapy (one jaw, course)' : 'Neredzamās iztaisnošanas kapes (viens žoklis, kurss)', 
          price: 'from 1550 €', 
          note: isEn ? 'Depending on complexity of the case and duration' : 'Atkarībā no gadījuma sarežģītības pakāpes un ilguma' 
        },
        { 
          name: isEn ? 'Metal braces system (one jaw)' : 'Metāla brekešu sistēma (viens žoklis)', 
          price: '750 €', 
          note: isEn ? 'Classic and highly reliable bite alignment method' : 'Klasiska un augsti uzticama sakodiena koriģēšanas metode' 
        },
        { 
          name: isEn ? 'Aesthetic sapphire / ceramic braces system' : 'Estētiskā safīra / keramikas brekešu sistēma', 
          price: '950 €', 
          note: isEn ? 'Almost invisible brackets matching enamel color' : 'Gandrīz nemanāmas fiksācijas uz zoba emaljas' 
        },
        { 
          name: isEn ? 'Orthodontic adjustment / wire change visit' : 'Ortodontisko kapju / brekešu regulācijas vizīte', 
          price: '45 € - 65 €', 
          note: isEn ? 'Wire replacement or pressure calibration' : 'Sastāv no stiepļu nomaiņas vai spiediena korekcijas' 
        }
      ]
    }
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  } as const;

  return (
    <div className="pt-8 pb-16 md:pt-12 md:pb-24 max-w-7xl mx-auto px-6" id="prices-page-view">
      {/* 1. Header with Badge */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {isEn ? 'Pricelist' : 'Cenrādis'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight">
          {isEn ? 'Transparent Pricing & Quality' : 'Caurspīdīgas cenas un kvalitāte'}
        </h2>
        <p className="text-base text-[#6a5b5e] mt-2 font-medium">
          {isEn ? 'Clear and simple pricing with zero hidden fees and full cost transparency.' : 'Skaidrs un saprotams cenrādis bez slēptiem maksājumiem ar pilnīgu izmaksu pārredzamību.'}
        </p>
      </motion.div>

      {/* 3. List of Categories and Rows */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-12"
      >
        {priceData.map((cat) => (
          <motion.div 
            variants={fadeUpVariants}
            key={cat.id}
            className="bg-white border border-[#efedec] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Category Header */}
            <div className="bg-[#fbf9f8] px-6 py-5 border-b border-[#efedec] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#efedec]/80 flex items-center justify-center">
                {cat.icon}
              </div>
              <h3 className="text-lg font-serif font-bold text-[#511B29] tracking-tight">
                {cat.title}
              </h3>
            </div>

            {/* Rows List */}
            <div className="divide-y divide-[#efedec]/65">
              {cat.items.map((item, index) => (
                <div 
                  key={index}
                  className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-[#fbf9f8]/40 transition-colors gap-4"
                >
                  <div className="max-w-2xl">
                    <h4 className="text-sm font-bold text-[#511B29] tracking-tight">
                      {item.name}
                    </h4>
                    {item.note && (
                      <p className="text-sm text-[#6a5b5e] mt-1 font-normal leading-relaxed">
                        {item.note}
                      </p>
                    )}
                  </div>
                  {/* Price Tag styled aligned nicely */}
                  <div className="flex items-center sm:text-right shrink-0">
                    <span className="text-sm font-mono font-extrabold text-[#511B29] bg-[#f2dde1]/35 px-4 py-2 rounded-full border border-[#d9c1c2]/20">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 4. Bottom Quality Standard Guarantee Box */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mt-16 bg-gradient-to-br from-[#fbf9f8] to-[#f2dde1]/20 border border-[#efedec] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[0.625rem] font-extrabold uppercase tracking-widest text-[#de7c8a]">
              {isEn ? 'Guaranteed Quality' : 'Garantēta Kvalitāte'}
            </span>
          </div>
          <h4 className="text-xl font-serif font-bold text-[#511B29] tracking-tight">
            {isEn ? 'Would you like to receive a full, detailed estimate?' : 'Vai vēlaties saņemt pilnu, detalizētu tāmi?'}
          </h4>
          <p className="text-sm md:text-base text-[#6a5b5e] leading-relaxed">
            {isEn
              ? 'An individual treatment plan detailing all steps and costs is prepared for each patient after the initial examination and 3D X-ray. There are no hidden fees, and the estimate is valid for 3 months.'
              : 'Ikvienam pacientam pēc pirmreizējās apskates un 3D rentgenuzņēmuma izveides tiek sagatavots individuāls ārstēšanas plāns, kurā detalizēti atrunāti visi soļi un izmaksas. Nav slēptu izmaksu, un tāme ir derīga 3 mēnešus no izveides brīža.'}
          </p>
        </div>
        <button
          onClick={onBook}
          className="btn inline-flex items-center gap-2 bg-[#511B29] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-sm font-bold cursor-pointer shadow-lg shadow-[#511B29]/15 shrink-0"
          id="prices-cta-booking-btn"
        >
          <CalendarDays className="w-4 h-4" />
          {isEn ? 'Book a Consultation' : 'Pierakstīties konsultācijai'}
        </button>
      </motion.div>
    </div>
  );
}
