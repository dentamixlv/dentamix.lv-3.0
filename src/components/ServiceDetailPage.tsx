'use client';

import React, { useState } from 'react';
import { ArrowLeft, Clock, Check, ShieldCheck, Sparkles, Droplet, Scissors, Activity, CalendarDays, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../types';

interface ServiceDetailPageProps {
  service: Service;
  onBack: () => void;
  onBookService: () => void;
  langCode?: string;
}

export default function ServiceDetailPage({ service, onBack, onBookService, langCode = 'lv' }: ServiceDetailPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const isEn = langCode === 'en-us';

  // Helper to resolve dynamically named icons
  const getServiceIconLarge = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-12 h-12 text-[#400112]" />;
      case 'Sparkles': return <Sparkles className="w-12 h-12 text-[#400112]" />;
      case 'Droplet': return <Droplet className="w-12 h-12 text-[#400112]" />;
      case 'Scissors': return <Scissors className="w-12 h-12 text-[#400112]" />;
      case 'Activity': return <Activity className="w-12 h-12 text-[#400112]" />;
      default: return <Sparkles className="w-12 h-12 text-[#400112]" />;
    }
  };

  // Service-specific custom FAQs in Latvian & English
  const getServiceFAQs = (serviceId: string) => {
    if (isEn) {
      switch (serviceId) {
        case 'terapija':
          return [
            {
              question: "How often should diagnostics and preventive examinations be performed?",
              answer: "We recommend a preventive visit to the dentist and hygienist every 6-12 months. This allows diagnosing caries and other problems at an early stage, when treatment is fast, simple, and completely painless."
            },
            {
              question: "Is caries treatment and filling completely painless?",
              answer: "Yes, effective local anesthesia is applied during the procedure using extra-fine needles. For patients who feel highly anxious, we provide an especially gentle, unhurried approach."
            },
            {
              question: "Why is a microscope necessary for root canal treatment?",
              answer: "Root canal treatment or endodontics under a microscope ensures maximum precision. The doctor sees the finest channel branches and microstructures, preventing infection from remaining and ensuring a successful long-term result."
            }
          ];
        case 'estetika':
          return [
            {
              question: "How long do porcelain veneers last?",
              answer: "Porcelain veneers last an average of 10 to 15 years and even longer if good oral hygiene is maintained and a hygienist is visited regularly. They are resistant to staining (from coffee, tea, etc.) and retain their natural shine."
            },
            {
              question: "Do teeth have to be heavily ground before placing veneers?",
              answer: "Modern technologies allow for extremely gentle and minimally invasive micro-grinding of tooth enamel (only 0.2 - 0.5 mm). In some cases, depending on the tooth shape, veneers can be placed without grinding at all."
            },
            {
              question: "What is involved in the Digital Smile Design (DSD) process?",
              answer: "It is a visual and digital smile planning. High-resolution photographs and scans are taken of each patient to create an ideal model of smile proportions in a computer program. You can see and approve the result before the procedure starts."
            }
          ];
        case 'higiena':
          return [
            {
              question: "How often do I need to visit a dental hygienist?",
              answer: "It is recommended to visit a dental hygienist once every six months. If you are prone to increased tartar formation, gum problems, or wear orthodontic appliances, visits should ideally be planned every 3 to 4 months."
            },
            {
              question: "How does the Air-Flow tooth cleaning method work?",
              answer: "Air-Flow is a painless method using a gentle pressure spray consisting of water, air, and very fine calcium or bicarbonate pearls. It effectively and gently cleans dark pigment and plaque from hard-to-reach places."
            },
            {
              question: "Does professional teeth whitening damage tooth enamel?",
              answer: "Systemic whitening performed in the clinic is completely safe for enamel because certified, gentle gel formulas are used that do not cause overheating or dehydration. The procedure is supervised by an experienced specialist."
            }
          ];
        case 'kirurgija':
          return [
            {
              question: "What are the benefits of dental implants compared to bridges?",
              answer: "An implant fully replaces the tooth root and prevents atrophy of the surrounding bone. Most importantly, implantation does not require grinding or devitalizing adjacent healthy teeth, as is the case with dental bridges."
            },
            {
              question: "Is dental implant surgery painful?",
              answer: "Pain is not felt during the procedure because high-quality local anesthesia is performed. Patients usually describe the surgery itself as easier than a regular tooth extraction. Postoperative discomfort is minimal."
            },
            {
              question: "Why are Straumann implants used?",
              answer: "At DENTAMIC clinic, we trust only the world's leading premium brands because they guarantee the highest biocompatibility, maximum speed of integration (>98%), and provide a lifetime warranty on the implant."
            }
          ];
        case 'ortodontija':
          return [
            {
              question: "What are the advantages of invisible aligners compared to braces?",
              answer: "Aligners are almost completely transparent and unnoticeable. They are easily removable during eating, which provides maximum convenience and simple teeth cleaning. They also do not rub or injure the oral mucosa."
            },
            {
              question: "How many hours a day do I need to wear orthodontic aligners?",
              answer: "Aligners must be worn 20 to 22 hours a day. They are removed only during eating and brushing. Each pair of aligners makes a micro-movement and is replaced with the next every 1-2 weeks."
            },
            {
              question: "Is orthodontic treatment effective for adults too?",
              answer: "Absolutely! Teeth can be successfully straightened at any age. Modern technologies and invisible aligners provide an excellent and fast result without the need to change daily habits."
            }
          ];
        default:
          return [
            {
              question: "How to book a visit at DENTAMIC clinic?",
              answer: "You can easily book a visit online by clicking the 'Book an Appointment' button, or by contacting our administration by phone."
            },
            {
              question: "Is a detailed plan agreed upon before treatment?",
              answer: "Yes, we provide full transparency. Before any treatment, the doctor will create an individual treatment plan and agree on a cost estimate without any hidden fees."
            }
          ];
      }
    } else {
      switch (serviceId) {
        case 'terapija':
          return [
            {
              question: "Cik bieži būtu jāveic diagnostika un profilaktiskā apskate?",
              answer: "Mēs rekomendējam veikt profilaktisko vizīti pie zobārsta un higiēnista reizi 6-12 mēnešos. Tas ļauj diagnosticēt kariesu un citas problēmas agrīnā stadijā, kad ārstēšana ir ātra, vienkārša un pilnībā nesāpīga."
            },
            {
              question: "Vai kariesa ārstēšana un plombēšana ir pilnībā nesāpīga?",
              answer: "Jā, procedūras laikā tiek piemērota iedarbīga lokālā anestēzija, izmantojot īpaši smalkas adatas. Pacientiem, kuri jūtas izteikti satraukti, mēs nodrošinām īpaši iejūtīgu, nesteidzīgu pieeju."
            },
            {
              question: "Kāpēc zobu sakņu kanālu ārstēšanai nepieciešams mikroskops?",
              answer: "Kanālu ārstēšana jeb endodontija zem mikroskopa nodrošina maksimālu precizitāti. Ārsts redz vissmalkākos kanālu atzarojumus un mikrostruktūras, novērstot infekcijas palikšanu un nodrošinot veiksmīgu rezultātu ilgtermiņā."
            }
          ];
        case 'estetika':
          return [
            {
              question: "Cik ilgs ir porcelāna laminātu kalpošanas laiks?",
              answer: "Porcelāna lamināti kalpo vidēji 10 līdz 15 gadus un pat ilgāk, ja tiek ievērota laba mutes higiēna un regulāri apmeklēts higiēnists. Tie ir noturīgi pret iekrāsošanos (no kafijas, tējas u.c.) un saglabā savu dabisko spīdumu."
            },
            {
              question: "Vai pirms laminātu uzlikšanas ir stipri jāslīpē zobi?",
              answer: "Mūsdienu tehnoloģijas ļauj veikt maksimāli saudzīgu un minimāli invazīvu zobu emaljas mikro-slīpēšanu (tikai 0.2 - 0.5 mm). Dažos gadījumos, atkarībā no zobu formas, laminātus ir iespējams uzstādīt pat bez slīpēšanas."
            },
            {
              question: "Kas ietilpst Digital Smile Design (DSD) procesā?",
              answer: "Tā ieklauj vizuālu un digitālu smaida plānošanu. Katram pacientam tiek veiktas augstas izšķirtspējas fotogrāfijas un skenēšana, lai datorprogrammā izveidotu ideālo smaida proporciju modeli. Jūs varat redzēt un saskaņot rezultātu pirms procedūras sākuma."
            }
          ];
        case 'higiena':
          return [
            {
              question: "Cik bieži ir nepieciešams apmeklēt zobu higiēnistu?",
              answer: "Zobu higiēnistu ieteicams apmeklēt reizi pusgadā. Ja Jums ir nosliece uz pastiprinātu zobakmens veidošanos, smaganu problēmām vai nēsājat ortodontiskās ierīces, vizītes ieteicams plānot reizi 3 līdz 4 mēnešos."
            },
            {
              question: "Kā darbojas Air-Flow zobu tīrīšanas metode?",
              answer: "Air-Flow ir nesāpīga metode, kurā izmanto saudzīgu spiediena strūklu, kas sastāv no ūdens, gaisa un ļoti smalkām kalcija vai bikarbonāta pērlītēm. Tā efektīvi un maigi notīra tumšo pigmentu un aplikumu no grūti sasniedzamām vietām."
            },
            {
              question: "Vai profesionālā zobu balināšana nebojā zoba emalju?",
              answer: "Klīnikā veiktā sistēmiskā balināšana ir pilnīgi droša emaljai, jo tiek izmantotas sertificētas, saudzīgas gēla formulas, kas neizraisa pārkaršanu vai dehidratāciju. Procedūra norit pieredzējuša speciālista kontrolē."
            }
          ];
        case 'kirurgija':
          return [
            {
              question: "Kādas ir priekšrocības zobu implantācijai, salīdzinot ar tiltiem?",
              answer: "Implants pilnībā aizstāj zoba sakni un novērš apkārtējā kaula atrofiju. Svarīgākais – implantācija neprasa blakus esošo veselo zobu slīpēšanu vai pārvilkšanu, kā tas ir zobu tiltu gadījumā."
            },
            {
              question: "Vai zobu implantācijas operācija ir sāpīga?",
              answer: "Sāpes procedūras laikā nav jūtamas, jo tiek veikta augstākās kvalitātes lokālā anestēzija. Pašu operāciju pacienti parasti raksturo kā vieglāku nekā parastu zoba raušanu. Pēcoperācijas periodā diskomforts ir minimāls."
            },
            {
              question: "Kādēļ tiek izmantoti Straumann implanti?",
              answer: "DENTAMIC klīnikā mēs uzticamies tikai pasaulē vadošajiem premium zīmoliem, jo tie garantē visaugstāko bioloģisko saderību, maksimāli ātru ieaugšanu (>98%) un nodrošina mūža garantiju implantam."
            }
          ];
        case 'ortodontija':
          return [
            {
              question: "Kādas ir priekšrocības neredzamajām kapēm salīdzinot ar breketēm?",
              answer: "Kapes jeb aligneri ir gandrīz pilnīgi caurspīdīgas un nemanāmas. Tās ir viegli izņemamas ēšanas laikā, kas sniedz maksimāli ērtu un vienkāršu zobu kopšanu. Tās arī neberž un netraumē mutes gļotādu."
            },
            {
              question: "Cik stundas diennaktī ir jānēsā ortodontiskās kapes?",
              answer: "Kapes ir jānēsā 20 līdz 22 stundas diennaktī. Tās tiek izņemtas tikai ēšanas laikā un tīrot zobus. Katrs kapju pāris veic mikro-pārvietojumu un tiek nomainīts pret nākamo ik pēc 1-2 nedēļām."
            },
            {
              question: "Vai ortodontiskā ārstēšana ir efektīva arī pieaugušajiem?",
              answer: "Pilnīgi noteikti! Zobus var veiksmīgi taisnot jebkurā vecumā. Mūsdienu tehnoloģijas un neredzamās kapes nodrošina lielisku un ātru rezultātu bez nepieciešamības mainīt ikdienas paradumus."
            }
          ];
        default:
          return [
            {
              question: "Kā pieteikties vizītei klīnikā DENTAMIC?",
              answer: "Jūs varat ērti pieteikties vizītei tiešsaistē, spiežot pogu 'Pieteikties uz vizīti', vai sazinoties ar mūsu administrāciju pa tālruni."
            },
            {
              question: "Vai pirms ārstēšanas tiek saskaņots detalizēts plāns?",
              answer: "Jā, mēs nodrošinām pilnīgu caurspīdību. Pirms jebkuras ārstēšanas ārsts izveidos individuālu ārstēšanas plānu un saskaņos izmaksu tāmi bez jebkādiem slēptiem maksājumiem."
            }
          ];
      }
    }
  };

  const faqs = getServiceFAQs(service.id);

  const t = {
    back: isEn ? 'Back to Services' : 'Atpakaļ uz pakalpojumiem',
    tag: isEn ? 'Services' : 'Pakalpojumi',
    aboutProcedure: isEn ? 'About the Procedure & Results' : 'Par procedūru un rezultātu',
    introText: isEn 
      ? 'At our clinic, each service is provided by specialists of outstanding competence, who combine modern clinical precision and constantly renew their skills at international seminars in Switzerland and Germany.'
      : 'Mūsu klīnikā katru pakalpojumu sniedz speciālisti ar izcilu kompetenci, kuri apvieno mūsdienīgu klīnisko precizitāti un pastāvīgi atjauno savas prasmes starptautiskos semināros Šveicē un Vācijā.',
    processTitle: isEn ? 'Procedure Flow & Technologies' : 'Procedūras norise un tehnoloģijas',
    noteDisclaimer: isEn
      ? '* Before each procedure, our specialists will perform a full examination of the oral cavity and bite, agree on an individual treatment plan, and ensure complete transparency of estimates and costs with no hidden fees.'
      : '* Pirms katras procedūras mūsu speciālisti veiks pilnu mutes dobuma un sakodiena izpēti, saskaņos individuālo ārstēšanas plānu un nodrošinās tāmju un izmaksu pilnīgu skaidrību bez slēptiem maksājumiem.',
    clinicalStandards: isEn ? 'DENTAMIC Clinical Standards' : 'DENTAMIC klīniskie standarti',
    standard1Title: isEn ? 'Certified materials' : 'Sertificēti materiāli',
    standard1Desc: isEn ? 'We use only Swiss and German premium leading brands.' : 'Izmantojam tikai Šveices un Vācijas premium klases vadošos zīmolus.',
    standard2Title: isEn ? '3D X-ray diagnostics' : '3D Rentgendiagnostika',
    standard2Desc: isEn ? 'High-resolution digital planning for precise and predictable results.' : 'Augstas izšķirtspējas digitālā plānošana precīzam un prognozējamam rezultātam.',
    standard3Title: isEn ? 'Painless care' : 'Pilnīga nesāpība',
    standard3Desc: isEn ? 'Comfortable local anesthesia ensures a calm procedure flow.' : 'Komfortabla lokālā anestēzija nodrošina mierīgu procedūras norisi.',
    standard4Title: isEn ? 'Warranty' : 'Darba garantija',
    standard4Desc: isEn ? 'We provide a reliable warranty on all services and materials.' : 'Sniegtajiem pakalpojumiem un materiāliem nodrošinām uzticamu garantiju.',
    visitDuration: isEn ? 'Visit Duration & Details' : 'Vizītes ilgums un detaļas',
    durationDesc: isEn
      ? `The planned booking duration for this visit is approximately \${service.duration}. This ensures an unhurried consultation, preparation, and high-quality execution in a peaceful atmosphere.`
      : `Plānotais rezervācijas ilgums šai vizītei ir aptuveni \${service.duration}. Tas nodrošina nesteidzīgu konsultāciju, sagatavošanos un kvalitatīvu tās izpildi mierpilnā atmosfēra.`,
    arrivalAlert: isEn ? 'Please arrive 10 minutes before your scheduled appointment.' : 'Lūdzam ierasties 10 minūtes pirms plānotā vizītes laika.',
    ctaTitle: isEn ? 'Would you like to schedule a consultation or book a visit?' : 'Vēlaties saņemt konsultāciju vai pieteikt vizīti?',
    ctaDesc: isEn ? 'Please book your time online – booking takes less than a minute.' : 'Lūdzu rezervējiet laiku elektroniski – pieteikšanās aizņem mazāk par minūti.',
    bookBtn: isEn ? 'Book an Appointment' : 'Pieteikties uz vizīti',
    faqTag: isEn ? 'FAQ' : 'Biežāk uzdotie jautājumi',
    faqTitle: isEn ? 'Frequently Asked Questions about the Treatment' : 'Biežāk uzdotie jautājumi par procedūru',
    faqSub: isEn ? 'Everything you need to know before visiting our exceptional specialists.' : 'Viss, kas Jums jāzina, pirms dodies uz vizīti pie mūsu izcilajiem speciālistiem.'
  };

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
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="py-16 md:py-24 max-w-7xl mx-auto px-6"
      id={`service-detail-page-${service.id}`}
    >
      <button 
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[#6a5b5e] hover:text-[#400112] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
        {t.back}
      </button>

      {/* Centered Page Header */}
      <motion.div 
        variants={fadeUpVariants}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block">
          {t.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#400112] tracking-tight">
          {service.title}
        </h2>
        <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
          {service.description}
        </p>
      </motion.div>

      {/* 2. Main Left-Aligned Two-Column Content Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start text-left">
        
        {/* Left Column: Descriptions & Detailed Info Box */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f2dde1]/35 border border-[#d9c1c2]/20 flex items-center justify-center shrink-0">
              {getServiceIconLarge(service.iconName)}
            </div>
            <h3 className="text-lg font-serif font-bold text-[#400112] tracking-tight">
              {t.aboutProcedure}
            </h3>
          </div>

          <div className="text-sm sm:text-base leading-relaxed space-y-5 font-normal text-slate-800">
            <p>
              {t.introText}
            </p>
            
            <div className="p-6 bg-white border border-[#efedec] rounded-2xl shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#400112] mb-3 flex items-center gap-1.5 border-b border-[#efedec]/60 pb-2">
                <Sparkles className="w-4 h-4 text-[#de7c8a]" />
                {t.processTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#6a5b5e] leading-relaxed">
                {service.detailedInfo}
              </p>
            </div>

            <p className="text-xs text-[#6a5b5e] leading-relaxed italic">
              {t.noteDisclaimer}
            </p>
          </div>
        </motion.div>

        {/* Right Column: Standards Checklists & Visit Information */}
        <motion.div variants={fadeUpVariants} className="space-y-6">
          {/* Standards Box */}
          <div className="bg-white border border-[#efedec] rounded-3xl p-6 md:p-8 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#400112] mb-5 flex items-center gap-1.5 border-b border-[#efedec]/65 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#de7c8a]" />
              {t.clinicalStandards}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs text-[#6a5b5e]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {t.standard1Title}
                  </span>
                  <span>
                    {t.standard1Desc}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#6a5b5e]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {t.standard2Title}
                  </span>
                  <span>
                    {t.standard2Desc}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#6a5b5e]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {t.standard3Title}
                  </span>
                  <span>
                    {t.standard3Desc}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#6a5b5e]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {t.standard4Title}
                  </span>
                  <span>
                    {t.standard4Desc}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time & Duration Info Card */}
          <div className="bg-[#fbf9f8] border border-[#efedec] rounded-3xl p-6 md:p-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#400112] mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#de7c8a]" />
              {t.visitDuration}
            </h4>
            <p className="text-xs text-[#6a5b5e] leading-relaxed mb-4">
              {isEn 
                ? `The planned booking duration for this visit is approximately ${service.duration}. This ensures an unhurried consultation, preparation, and high-quality execution in a peaceful atmosphere.`
                : `Plānotais rezervācijas ilgums šai vizītei ir aptuveni ${service.duration}. Tas nodrošina nesteidzīgu konsultāciju, sagatavošanos un kvalitatīvu tās izpildi mierpilnā atmosfērā.`
              }
            </p>
            <div className="text-[11px] bg-white border border-[#efedec]/65 px-4 py-3 rounded-xl text-[#de7c8a] font-bold">
              {t.arrivalAlert}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Main Full-Width CTA Section centered below detail block */}
      <motion.div 
        variants={fadeUpVariants}
        className="mt-12 pt-8 border-t border-[#efedec]/65 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-bold text-[#400112]">
            {t.ctaTitle}
          </h4>
          <p className="text-xs text-[#6a5b5e] mt-1">
            {t.ctaDesc}
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={onBookService}
            className="btn flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#400112] hover:bg-[#5d1726] active:scale-[0.98] transition-all text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg shadow-[#400112]/20 cursor-pointer"
            id={`book-specific-service-${service.id}`}
          >
            <CalendarDays className="w-4 h-4" />
            {t.bookBtn}
          </button>
        </div>
      </motion.div>

      {/* 3. FAQ Section */}
      <motion.div variants={fadeUpVariants} className="mt-16 md:mt-24 pt-12 border-t border-[#efedec]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-2.5 block">
              {t.faqTag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#400112] tracking-tight">
              {t.faqTitle}
            </h3>
            <p className="text-xs text-[#6a5b5e] mt-2 font-medium">
              {t.faqSub}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-[#efedec] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-[#400112] tracking-tight group-hover:text-[#de7c8a] transition-colors pr-4">
                      {faq.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-[#fbf9f8] border border-[#efedec] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#f2dde1]/30 border-[#d9c1c2]/30 text-[#de7c8a]' : 'text-slate-400'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6a5b5e] leading-relaxed border-t border-[#efedec]/40 bg-[#fbf9f8]/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
