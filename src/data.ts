import { Doctor, Service, Clinic, BlogPost } from './types';

// ==========================================
// LATVIAN STATIC DATA
// ==========================================

export const DOCTORS_LV: Doctor[] = [
  {
    id: 'dr-anna-berzina',
    name: 'Dr. Anna Bērziņa',
    title: 'Dr. Anna Bērziņa',
    category: 'SPECIĀLISTE',
    role: 'ZOBĀRSTE',
    description: 'Dr. Bērziņa ir vadošā speciāliste estētiskajā zobārstniecībā ar vairāk nekā 10 gadu pieredzi. Viņas pieeja balstās uz minimāli invazīvām metodēm, nodrošinot pacientiem mierpilnu un nesāpīgu ārstēšanas procesu.',
    fullBio: 'Dr. Anna Bērziņa absolvējusi Rīgas Stradiņa universitātes Zobārstniecības fakultāti un regulāri papildina zināšanas starptautiskos kongresos Vācijā un Šveicē. Viņa specializējas augstākās sarežģītības pakāpes estētisko rekonstrukciju un protezēšanas darbos, izmantojot modernākās laminātu un bezmetāla keramikas tehnoloģijas. Viņas mērķis ir radīt dabisku un harmonisku smaidu, maksimāli saglabājot zobu veselos audus. Pacienti viņu raksturo kā izcili iejūtīgu, nepārspējami precīzu un dabiski nomierinošu speciālisti.',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Estētiskā zobu restaurācija',
      'Zobārstniecības lamināti (Veneers)',
      'Smile Design (digitālā smaidu plānošana)',
      'Bezmetāla keramika un kroņi'
    ],
    education: [
      'Rīgas Stradiņa universitāte, Zobārstniecības maģistra grāds (2012)',
      'Starptautiskais estētiskās restaurācijas kurss, Heidelberga, Vācija (2015)',
      'Advanced Smile Makeover masterclass, Cīrihe, Šveice (2018)'
    ],
    languages: ['Latviešu', 'Angļu', 'Krievu']
  },
  {
    id: 'dr-janis-kalnins',
    name: 'Dr. Jānis Kalniņš',
    title: 'Dr. Jānis Kalniņš',
    category: 'ĶIRURGS',
    role: 'ZOBĀRSTS, ĶIRURGS',
    description: 'Sertificēts mutes, sejas un žokļu ķirurgs, specializējies sarežģītās implantācijas un kaula augmentācijas procedūrās. Dr. Kalniņš izmanto jaunākās 3D plānošanas tehnoloģijas precīzam rezultātam.',
    fullBio: 'Dr. Jānis Kalniņš ir augsti sertificēts mutes, sejas un žokļu ķirurgs ar plašu akadēmisko un praktisko pieredzi vadošajās Latvijas slimnīcās un privātklīnikās. Viņš nodarbojas ar zobu implantāciju, sarežģītu gudrības zobu ķirurģiju, kā arī žokļa kaula rekonstrukcijas un augmentācijas operācijām. Dr. Kalniņš strādā ar vadošajām Šveices un Zviedrijas implantācijas sistēmām. Viņa ķirurģiskā precizitāte savienojumā ar digitālo 3D diagnostiku nodrošina minimāli invazīvu ārstēšanu un īpaši ātru, nesāpīgu atveseļošanās periodu.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Zobu implantācija',
      'Kaula augmentācija (atjaunošana)',
      'Sinus-lift operācijas',
      'Sarežģīta zobu ekstrakcija',
      'Mutes gļotādas plastiskā ķirurģija'
    ],
    education: [
      'RSU Medicīnas fakultāte un rezidentūra Sejas-žokļu ķirurģijā (2010)',
      'Implantoloģijas tālākizglītība, Gēteborga, Zviedrija (2013)',
      'ITI (International Team for Implantology) biedrs kopš 2014. gada'
    ],
    languages: ['Latviešu', 'Angļu', 'Krievu', 'Vācu']
  },
  {
    id: 'dr-liga-ozolina',
    name: 'Dr. Līga Ozoliņa',
    title: 'Dr. Līga Ozoliņa',
    category: 'ORTODONTE',
    role: 'ZOBĀRSTE, ORTODONTE',
    description: 'Eksperte sakodiena korekcijā gan bērniem, gan pieaugušajiem. Strādā ar klasiskajām brekešu sistēmām, kā arī modernajām neredzamajām kapēm (aligners), radot pārliecinošus un veselīgus smaidus.',
    fullBio: 'Dr. Līga Ozoliņa ir smaidu māksliniece, kas specializējas modernajā un funkcionālajā ortodontijā. Viņa tic, ka taisns sakodiens ir ne tikai vizuāli pievilcīgs, bet arī kritiski svarīgs visas mutes dobuma un stājas veselībai. Dr. Ozoliņa ir sertificēta darbam ar vadošajām neredzamo kapu (aligners) sistēmām un regulāri pilnveidojas Eiropas Ortodontu asociācijas kursos. Viņa izstrādā individuālus plānus pacientiem jebkurā vecumā, palīdzot iegūt harmonisku smaidu vieglā, patīkamā un nesāpīgā veidā.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Neredzamās ortodontiskās kapes (Aligners)',
      'Metāla, safīra un keramikas brekešu sistēmas',
      'Bērnu un pusaudžu žokļu ortopēdija',
      'Sarežģītu sakodienu starpdisciplināra sakārtošana'
    ],
    education: [
      'Rīgas Stradiņa universitāte, Zobārstniecības maģistrs un ortodontijas sertifikāts (2014)',
      'Sertificēta Aligners (Invisalign & Spark) praktizētāja (2016)',
      'Eiropas Ortodontu asociācijas (EOS) aktīva biedre'
    ],
    languages: ['Latviešu', 'Angļu']
  },
  {
    id: 'dr-janis-berzins',
    name: 'Dr. Jānis Bērziņš',
    title: 'Dr. Jānis Bērziņš',
    category: 'VADOŠAIS SPECIĀLISTS',
    role: 'KLĪNIKAS VADĪTĀJS UN VADOŠAIS SPECIĀLISTS',
    description: 'Mūsu klīnikas filozofija balstās uz izcilību katrā detaļā un dziļu cieņu pret pacienta labsajūtu. Mēs ne tikai ārstējam, bet radām vidi, kurā modernākās tehnoloģijas satiekas ar patiesu rūpību.',
    fullBio: 'Dr. Jānis Bērziņš ir klīnikas Dentamic dibinātājs un medicīniskais direktors. Viņš ir viens no cienījamākajiem zobārstniecības rekonstruktīvās medicīnas un implantoloģijas ekspertiem Latvijā ar vairāk nekā 20 gadu klīnisko pieredzi. Viņa pacietība, vizionārais darba veids un augstākās klases tehnoloģiju ieviešana ir radījusi jaunus zobārstniecības standartus Latvijā. Dr. Bērziņš personīgi pārrauga un koordinē sarežģītāko starpdisciplināro pacientu ārstēšanas plānus, nodrošinot augstākās klases aprūpi.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Vispārējā zobārstniecības vadība',
      'Rekonstruktīvā implantoloģija & protezēšana',
      'Pilnas mutes sakodiena rekonstrukcija',
      'Mikroskopa asistēta precīzā mikro-zobārstniecība'
    ],
    education: [
      'Rīgas Stradiņa universitāte, Zobārstniecības grāds (2001)',
      'Doktora grāds zobārstniecībā, RSU (2006)',
      'Zobārstniecības lāzeru un augsto tehnoloģiju sertifikāts, Vīne, Austrija (2009)'
    ],
    languages: ['Latviešu', 'Angļu', 'Vācu', 'Krievu']
  }
];

export const SERVICES_LV: Service[] = [
  {
    id: 'terapija',
    title: 'Terapeitiskā zobārstniecība',
    description: 'Kariesa ārstēšana, augstākās klases anatomiskās plombas un zobu sakņu kanālu ārstēšana mikroskopa kontrolē.',
    detailedInfo: 'Mūsdienīga terapeitiskā ārstēšana klīnikā Dentamic ļauj droši un maksimāli saglabāt zobu dabisko struktūru. Izmantojam bioloģiski saderīgus, augstākās klases kompozītmateriālus ar augstu nodilumizturību. Veicam augstas sarežģītības zobu sakņu kanālu ārstēšanu (endodontiju) jaudīga mikroskopa kontrolē, kas ļauj ieraudzīt pat vissmalkākās anatomiskās nianses un novērst infekcijas atkārtošanos.',
    priceRange: 'no 60 €',
    duration: '30 - 60 min',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'estetika',
    title: 'Estētiskā zobārstniecība & Lamināti',
    description: 'Smaida pilnveidošana ar plāniem, gaismu caurlaidīgiem porcelāna laminātiem un digitālo smaidu dizainu.',
    detailedInfo: 'Mākslas un zobārstniecības sintēze. Izmantojot Digital Smile Design (DSD) tehnoloģiju, pacients var redzēt savu topošo smaidu vēl pirms procedūras uzsākšanas. Īpaši plānie porcelāna lamināti (veneers) tiek izgatavoti individuāli laboratorijā un tiek fiksēti uz zobu priekšējās virsmas, koriģējot formu, nelielas spraugas un emaljas krāsas defektus ar minimālu zoba apstrādi.',
    priceRange: 'no 450 € / zobs',
    duration: '60 - 90 min',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1516062423079-7ca13cca775f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'higiena',
    title: 'Zobu higiēna un balināšana',
    description: 'Profesionāla higiēna ar saudzīgu Air-Flow sistēmu un efektīva, nesāpīga zobu balināšana ar emaljai drošu gēlu.',
    detailedInfo: 'Sistemātiska mutes higiēna ir jebkuras ārstēšanas pamats. Mūsu higiēnisti rūpīgi un nesāpīgi noņem zobu aplikumu un zobakmeni, izmantojot ultraskaņu un maigo Air-Flow pērļu strūklu. Balināšanā izmantojam pasaulē atzītas klīniskās sistēmas, kas aktivizējas bez pārmērīga karstuma, pasargājot zoba nervu un sniedzot izcilu, žilbinošu rezultātu līdz pat 8 toņiem.',
    priceRange: '80 € - 250 €',
    duration: '45 - 60 min',
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'kirurgija',
    title: 'Implantācija un Ķirurģija',
    description: 'Zaudēta viena vai vairāku zobu aizstāšana ar premium titāna implantiem un pilnībā nesāpīga ķirurģija.',
    detailedInfo: 'Klīnikā izmantojam tikai starptautiski atzītus premium ražotāju implantus (Straumann un Nobel Biocare) ar izcili augstu ieaugšanas rādītāju (>98%). Ķirurģiskās manipulācijas tiek plānotas digitāli pēc 3D datortomogrāfijas datiem, izmantojot speciālus ķirurģiskos gidus. Šī pieeja nodrošina maksimālu rezultāta prognozējamību, minimāli invazīvu iejaukšanos un ārkārtīgi ātru un komfortablu atlabšanu.',
    priceRange: 'no 700 €',
    duration: '45 - 90 min',
    iconName: 'Scissors',
    image: 'https://images.unsplash.com/photo-1579684385131-abef076dfdd7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ortodontija',
    title: 'Ortodontija & Neredzamās kapes',
    description: 'Neredzama, ērta un ātra sakodiena un zobu rindas līdzināšana jebkurā vecumā ar modernajiem aligneriem.',
    detailedInfo: 'Neredzamās kapes (aligners) ir revolucionāra alternatīva tradicionālajām breketēm. Tās ir pilnīgi caurspīdīgas, viegli noņemamas ēšanas un higiēnas laikā un nerada berzi mutes dobumā. Digitālā vizualizācija ļauj precīzi redzēt katru zoba kustības posmu un prognozēt gala rezultātu. Strādājam arī ar visu veidu modernajām brekšu sistēmām sekmīgam jebkuras sarežģītības gadījuma atrisinājumam.',
    priceRange: 'no 1500 € / kurss',
    duration: 'Individuāli',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800'
  }
];

export const CLINICS_LV: Clinic[] = [
  {
    id: 'riga',
    name: 'Dentamic Rīga',
    address: 'Brīvības iela 100, Rīga, LV-1001',
    phone: '+371 29 459 999',
    email: 'riga@dentamic.lv',
    workHours: {
      weekdays: 'P. - Pk.: 09:00 - 19:00',
      saturday: 'S.: 10:00 - 15:00',
      sunday: 'Sv.: Slēgts'
    },
    gmapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2175.4339994646274!2d24.129202577239032!3d56.95856407349781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eed2e2d93e5071%3A0x6bfe76e974e3feaf!2sBr%C4%ABv%C4%ABbas%20iela%20100%2C%20Centra%20rajons%2C%20R%C4%ABga%2C%20LV-1013!5e0!3m2!1slv!2slv!4v1716310000000!5m2!1slv!2slv',
    gmapsLink: 'https://www.google.com/maps/search/?api=1&query=56.9585641%2C24.1313913',
    waze: 'https://www.waze.com/live-map/directions?to=ll.56.9585641%2C24.1313913'
  },
  {
    id: 'adazi',
    name: 'Dentamic Ādaži',
    address: 'Rīgas gatve 5, Ādaži, LV-2164',
    phone: '+371 29 111 222',
    email: 'adazi@dentamic.lv',
    workHours: {
      weekdays: 'P. - Pk.: 09:00 - 18:00',
      saturday: 'S.: Slēgts',
      sunday: 'Sv.: Slēgts'
    },
    gmapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2165.71960133221!2d24.32356507724911!3d57.07254507316499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eec6ec98c199d7%3A0xe53be0ce8676cff!2zUsSrZ2FzIGdhdHZlIDUsIMSubGHEvmksIEzEgWdhbmUgcGFnYXN0cywgTFYtMjE2NA!5e0!3m2!1slv!2slv!4v1716311000000!5m2!1slv!2slv',
    gmapsLink: 'https://www.google.com/maps/search/?api=1&query=57.0725451%2C24.3257538',
    waze: 'https://www.waze.com/live-map/directions?to=ll.57.0725451%2C24.3257538'
  }
];

export const BLOG_POSTS_LV: BlogPost[] = [
  {
    id: 'mutes-higiena',
    title: 'Kāpēc regulāra mutes higiēna ir labākā investīcija veselībā?',
    category: 'MUTES HIGIĒNA',
    description: 'Bieži vien mēs mutes higiēnu uztveram kā kosmētisku procedūru, taču tās ietekme uz vispārējo organismu ir daudz dziļāka. Uzziniet, kā pareiza aprūpe novērš nopietnas saslimšanas.',
    detailedContent: [
      'Mutes dobums ir vārti uz visu mūsu organismu. Pētījumi rāda, ka hronisks smaganu iekaisums jeb periodontīts ir tieši saistīts ar palielinātu sirds un asinsvadu slimību, diabēta un pat locītavu problēmu risku. Patogēnās baktērijas no mutes dobuma caur asinsriti var ceļot pa visu ķermeni, radot mikroskopiskus iekaisuma raksturus.',
      'Profesionāla higiēna reizi pusgadā palīdz likvidēt cieto zobakmeni un mikrobiālo aplikumu vietās, kuras ar parasto zobu birsti un zobu diegu nav iespējams sasniegt. Dentamic klīnikā mēs izmantojam saudzīgo un novatorisko Air-Flow tehnoloģiju, kas pilnībā attīra zobu virsmu no kafijas vai tējas radītā pigmenta, neradot nepatīkamas sajūtas.',
      'Atrunājoties ar faktu, ka "nekas nesāp", pacienti bieži vien palaiž garām pirmos smaganu asiņošanas un gingivīta signālus. Atcerieties – veselas smaganas neasiņo! Regulāri higiēnista apmeklējumi ir vismazāk tērējošā un visefektīvākā investīcija veselā smaidā un labā pašsajūtā.'
    ],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    date: '18. Maijs, 2026',
    author: 'Dr. Līga Ozoliņa',
    readTime: '4 MIN'
  },
  {
    id: 'neredzamas-kapes',
    title: 'Neredzamās kapes pret breketēm – ko izvēlēties modernam smaidam?',
    category: 'ORTODONTIJA',
    description: 'Ortodontiskā ārstēšana vairs nav saistīta tikai ar neērtām metāla stieplēm. Salīdzināsim caurspīdīgās kapes ar tradicionālajām brekšu sistēmām, lai palīdzētu Jums izdarīt izvēli.',
    detailedContent: [
      'Mūsdienās skaists un taisns sakodiens ir ne tikai estētikas, bet arī funkcionālas veselības pamats. Pareizs zobu novietojums atvieglo to tīrīšanu un vienmērīgi sadala košļāšanas slodzi, pasargājot locītavu un zobu emalju no pāragras nodilšanas.',
      'Neredzamās kapes (aligners) ir kļuvušas par pirmo izvēli pieaugušajiem un pusaudžiem, pateicoties to nepārspējamajai ērtībai un estētikai. Tās izgatavo no īpaši izturīga, medicīniski sertificēta polimēra, kas ir pilnīgi caurspīdīgs un praktiski neuzkrītošs uz zobiem. Galvenā priekšrocība ir iespēja tās noņemt ēšanas un mutes higiēnas laikā, ļaujot bez bažām baudīt mīļākos ēdienus un nevainojami iztīrīt zobus.',
      'Lai gan abas metodes spēj sasniegt izcilu rezultātu, kapes parasti prasa īsāku kopējo ārstēšanas laiku un mazāk steidzamu vizīšu klīnikā. Mūsu speciālisti Dentamic klāstā veiks detalizētu 3D skenēšanu, lai jau pirmajā vizītē parādītu Jūsu nākotnes smaida digitālo modeli un izplānotu visprecīzāko ārstēšanas gaitu.'
    ],
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
    date: '10. Maijs, 2026',
    author: 'Dr. Jānis Kalniņš',
    readTime: '5 MIN'
  },
  {
    id: 'porcelana-laminati',
    title: 'Porcelāna lamināti (veneers) – ātrs ceļš uz Holivudas smaidu',
    category: 'ESTĒTIKA',
    description: 'Vēlaties koriģēt zobu formu, krāsu vai aizvērt spraugas starp zobiem? Porcelāna plāksnītes sniedz fantastisku, ilgmūžīgu rezultātu ar minimālu zobu sagatavošanu.',
    detailedContent: [
      'Estētiskā zobārstniecība pēdējos gados ir piedzīvojusi milzīgu lēcienu uz priekšu. Porcelāna lamināti jeb venīri ir īpaši plānas, pēc pasūtījuma veidotas porcelāna plāksnītes, ko fiksē pie zobu priekšējās virsmas. Tie ļauj pilnībā transformēt smaida harmoniju īsā laikā.',
      'Atšķirībā no kroņiem, laminātu uzlikšanai nepieciešama tikai minimāla un saudzīga zobu priekšējās emaljas sagatavošana (dažkārt mazāk par pusmilimetru), bet atsevišķos gadījumos tā nav vajadzīga vispār. Porcelānam piemīt tādas pašas gaismas caurlaidības un atstarošanas īpašības kā dabiskajai zoba emaljai, radot pilnīgi dabisku, nepārspētu vizuālo rezultātu.',
      'Turklāt modernā Digital Smile Design (DSD) tehnoloģija Dentamic klīnikā ļauj Jums piedalīties sava topošā smaida dizaina izveidē. Mēs kopīgi piemeklējam ideālo zobu formu, līniju un baltuma toni, lai tie perfekti saskanētu ar Jūsu sejas pantiem, lūpām un mīmiku. Tā ir ilgtermiņa investīcija – porcelāns nemaina krāsu un nekrāsojas no pārtikas vai dzērieniem, priecējot Jūs daudzu gadu garumā.'
    ],
    image: 'https://images.unsplash.com/photo-1513223564055-2005be73a3aa?auto=format&fit=crop&q=80&w=800',
    date: '1. Maijs, 2026',
    author: 'Dr. Anna Bērziņa',
    readTime: '6 MIN'
  }
];

// ==========================================
// ENGLISH STATIC DATA
// ==========================================

export const DOCTORS_EN: Doctor[] = [
  {
    id: 'dr-anna-berzina',
    name: 'Dr. Anna Berzina',
    title: 'Dr. Anna Berzina',
    category: 'SPECIALIST',
    role: 'DENTIST',
    description: 'Dr. Berzina is a leading specialist in aesthetic dentistry with over 10 years of experience. Her approach is based on minimally invasive methods, ensuring a peaceful and painless treatment process.',
    fullBio: 'Dr. Anna Berzina graduated from the Faculty of Dentistry at Riga Stradins University and regularly refines her knowledge at international congresses in Germany and Switzerland. She specializes in highly complex aesthetic restorations and prosthetics, utilizing state-of-the-art veneers and metal-free ceramic technologies. Her goal is to create a natural and harmonious smile while preserving maximum healthy tooth structure. Patients describe her as highly empathetic, exceptionally precise, and naturally calming.',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Aesthetic tooth restoration',
      'Dental veneers',
      'Smile Design (digital smile planning)',
      'Metal-free ceramics and crowns'
    ],
    education: [
      'Riga Stradins University, Master\'s Degree in Dentistry (2012)',
      'International Course in Aesthetic Restoration, Heidelberg, Germany (2015)',
      'Advanced Smile Makeover masterclass, Zurich, Switzerland (2018)'
    ],
    languages: ['Latvian', 'English', 'Russian']
  },
  {
    id: 'dr-janis-kalnins',
    name: 'Dr. Janis Kalnins',
    title: 'Dr. Janis Kalnins',
    category: 'SURGEON',
    role: 'DENTIST, SURGEON',
    description: 'Certified oral, facial, and maxillofacial surgeon, specialized in complex implantology and bone augmentation procedures. Dr. Kalnins utilizes the latest 3D planning technologies for precise results.',
    fullBio: 'Dr. Janis Kalnins is a highly certified oral, facial, and maxillofacial surgeon with extensive academic and practical experience in leading Latvian hospitals and private clinics. He performs dental implantations, complex wisdom tooth surgeries, as well as jawbone reconstructions and augmentation surgeries. Dr. Kalnins works with leading Swiss and Swedish implant systems. His surgical precision combined with digital 3D diagnostics ensures minimally invasive treatment and an exceptionally fast, painless recovery period.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Dental implants',
      'Bone augmentation (reconstruction)',
      'Sinus lift operations',
      'Complex tooth extraction',
      'Oral mucosal plastic surgery'
    ],
    education: [
      'RSU Faculty of Medicine and Residency in Maxillofacial Surgery (2010)',
      'Further education in Implantology, Gothenburg, Sweden (2013)',
      'ITI (International Team for Implantology) member since 2014'
    ],
    languages: ['Latvian', 'English', 'Russian', 'German']
  },
  {
    id: 'dr-liga-ozolina',
    name: 'Dr. Liga Ozolina',
    title: 'Dr. Liga Ozolina',
    category: 'ORTHODONTIST',
    role: 'DENTIST, ORTHODONTIST',
    description: 'Expert in bite correction for both children and adults. Works with classic brace systems as well as modern clear aligners, creating confident and healthy smiles.',
    fullBio: 'Dr. Liga Ozolina is a smile artist specializing in modern and functional orthodontics. She believes a straight bite is not only visually appealing but also critical for overall oral health and posture. Dr. Ozolina is certified to work with leading clear aligner systems and regularly improves her skills at courses of the European Orthodontic Society. She develops customized plans for patients of any age, helping them achieve a harmonious smile in an easy, pleasant, and painless way.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'Clear orthodontic aligners (Aligners)',
      'Metal, sapphire, and ceramic brace systems',
      'Children and youth jaw orthopedics',
      'Multidisciplinary treatment of complex bite issues'
    ],
    education: [
      'Riga Stradins University, Master in Dentistry and Orthodontics Certificate (2014)',
      'Certified Aligners (Invisalign & Spark) practitioner (2016)',
      'Active member of the European Orthodontic Society (EOS)'
    ],
    languages: ['Latvian', 'English']
  },
  {
    id: 'dr-janis-berzins',
    name: 'Dr. Janis Berzins',
    title: 'Dr. Janis Berzins',
    category: 'LEADING SPECIALIST',
    role: 'CLINIC DIRECTOR & LEADING SPECIALIST',
    description: 'Our clinic\'s philosophy is built on excellence in every detail and deep respect for the patient\'s well-being. We do not just treat; we create an environment where modern technology meets genuine care.',
    fullBio: 'Dr. Janis Berzins is the founder and medical director of Dentamic Clinic. He is one of the most respected experts in reconstructive dental medicine and implantology in Latvia, with over 20 years of clinical experience. His patience, visionary approach, and implementation of high-end technologies have set new standards for dentistry in Latvia. Dr. Berzins personally oversees and coordinates the treatment plans of complex multidisciplinary patients, ensuring top-tier care.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    specializations: [
      'General dental management',
      'Reconstructive implantology & prosthetics',
      'Full mouth bite reconstruction',
      'Microscope-assisted precision micro-dentistry'
    ],
    education: [
      'Riga Stradins University, Degree in Dentistry (2001)',
      'Doctoral degree in Dentistry, RSU (2006)',
      'Dental lasers and high technology certificate, Vienna, Austria (2009)'
    ],
    languages: ['Latvian', 'English', 'German', 'Russian']
  }
];

export const SERVICES_EN: Service[] = [
  {
    id: 'terapija',
    title: 'Therapeutic Dentistry',
    description: 'Caries treatment, premium anatomical fillings, and root canal treatment under microscope control.',
    detailedInfo: 'Modern therapeutic treatment at Dentamic clinic allows safe and maximal preservation of natural tooth structure. We use biocompatible, premium composite materials with high wear resistance. We perform highly complex root canal treatments (endodontics) under the control of a powerful microscope, which allows us to see even the finest anatomical details and prevent recurrent infections.',
    priceRange: 'from 60 €',
    duration: '30 - 60 min',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'estetika',
    title: 'Aesthetic Dentistry & Veneers',
    description: 'Smile enhancement with thin, light-transmitting porcelain veneers and digital smile design.',
    detailedInfo: 'A synthesis of art and dentistry. Using Digital Smile Design (DSD) technology, the patient can see their future smile before starting the procedure. Ultra-thin porcelain veneers are custom-made in the laboratory and bonded to the front surface of the teeth, correcting shape, minor gaps, and enamel color defects with minimal tooth preparation.',
    priceRange: 'from 450 € / tooth',
    duration: '60 - 90 min',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1516062423079-7ca13cca775f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'higiena',
    title: 'Dental Hygiene & Teeth Whitening',
    description: 'Professional hygiene with a gentle Air-Flow system and effective, painless teeth whitening with enamel-safe gel.',
    detailedInfo: 'Systematic oral hygiene is the foundation of any treatment. Our hygienists carefully and painlessly remove plaque and tartar using ultrasound and the gentle Air-Flow pearl jet. For whitening, we use internationally recognized clinical systems that activate without excessive heat, protecting the tooth nerve and providing an outstanding, dazzling result of up to 8 shades.',
    priceRange: '80 € - 250 €',
    duration: '45 - 60 min',
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'kirurgija',
    title: 'Implantology & Surgery',
    description: 'Replacement of one or more missing teeth with premium titanium implants and completely painless surgery.',
    detailedInfo: 'At our clinic, we use only internationally recognized implants from premium manufacturers (Straumann and Nobel Biocare) with an exceptionally high integration rate (>98%). Surgical procedures are planned digitally using 3D computed tomography data and custom surgical guides. This approach ensures maximum predictability of the outcome, minimally invasive intervention, and extremely fast, comfortable recovery.',
    priceRange: 'from 700 €',
    duration: '45 - 90 min',
    iconName: 'Scissors',
    image: 'https://images.unsplash.com/photo-1579684385131-abef076dfdd7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ortodontija',
    title: 'Orthodontics & Clear Aligners',
    description: 'Invisible, comfortable, and fast bite and tooth alignment at any age with modern clear aligners.',
    detailedInfo: 'Clear aligners are a revolutionary alternative to traditional braces. They are completely transparent, easily removable during eating and hygiene, and do not cause friction in the oral cavity. Digital visualization allows you to see every step of the tooth movement and predict the final result. We also work with all types of modern brace systems for the successful resolution of any orthodontic case complexity.',
    priceRange: 'from 1500 € / course',
    duration: 'Individual',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800'
  }
];

export const CLINICS_EN: Clinic[] = [
  {
    id: 'riga',
    name: 'Dentamic Riga',
    address: '100 Brivibas Street, Riga, LV-1001',
    phone: '+371 29 459 999',
    email: 'riga@dentamic.lv',
    workHours: {
      weekdays: 'Mon. - Fri.: 09:00 - 19:00',
      saturday: 'Sat.: 10:00 - 15:00',
      sunday: 'Sun.: Closed'
    },
    gmapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2175.4339994646274!2d24.129202577239032!3d56.95856407349781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eed2e2d93e5071%3A0x6bfe76e974e3feaf!2sBr%C4%ABv%C4%ABbas%20iela%20100%2C%20Centra%20rajons%2C%20R%C4%ABga%2C%20LV-1013!5e0!3m2!1slv!2slv!4v1716310000000!5m2!1slv!2slv',
    gmapsLink: 'https://www.google.com/maps/search/?api=1&query=56.9585641%2C24.1313913',
    waze: 'https://www.waze.com/live-map/directions?to=ll.56.9585641%2C24.1313913'
  },
  {
    id: 'adazi',
    name: 'Dentamic Adazi',
    address: '5 Rigas gatve, Adazi, LV-2164',
    phone: '+371 29 111 222',
    email: 'adazi@dentamic.lv',
    workHours: {
      weekdays: 'Mon. - Fri.: 09:00 - 18:00',
      saturday: 'Sat.: Closed',
      sunday: 'Sun.: Closed'
    },
    gmapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2165.71960133221!2d24.32356507724911!3d57.07254507316499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eec6ec98c199d7%3A0xe53be0ce8676cff!2zUsSrZ2FzIGdhdHZlIDUsIMSubGHEvmksIEzEgWdhbmUgcGFnYXN0cywgTFYtMjE2NA!5e0!3m2!1slv!2slv!4v1716311000000!5m2!1slv!2slv',
    gmapsLink: 'https://www.google.com/maps/search/?api=1&query=57.0725451%2C24.3257538',
    waze: 'https://www.waze.com/live-map/directions?to=ll.57.0725451%2C24.3257538'
  }
];

export const BLOG_POSTS_EN: BlogPost[] = [
  {
    id: 'mutes-higiena',
    title: 'Why regular oral hygiene is the best investment in your health',
    category: 'ORAL HYGIENE',
    description: 'We often view oral hygiene as a cosmetic procedure, but its impact on the general body is much deeper. Learn how proper care prevents serious illnesses.',
    detailedContent: [
      'The mouth is the gateway to our entire body. Research shows that chronic gum inflammation, or periodontitis, is directly linked to an increased risk of cardiovascular disease, diabetes, and even joint problems. Pathogenic bacteria from the mouth can travel through the bloodstream throughout the body, causing micro-inflammations.',
      'Professional hygiene once a year or every six months helps eliminate hard tartar and microbial plaque in areas that cannot be reached with a regular toothbrush and dental floss. At Dentamic clinic, we use the gentle and innovative Air-Flow technology, which thoroughly cleans the tooth surface from coffee or tea stains without causing discomfort.',
      'Using the excuse that "nothing hurts", patients often miss the first signs of bleeding gums and gingivitis. Remember - healthy gums do not bleed! Regular visits to a hygienist are the most cost-effective and efficient investment in a healthy smile and good well-being.'
    ],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    date: '18 May, 2026',
    author: 'Dr. Liga Ozolina',
    readTime: '4 MIN'
  },
  {
    id: 'neredzamas-kapes',
    title: 'Clear aligners vs braces - which one to choose for a modern smile?',
    category: 'ORTHODONTICS',
    description: 'Orthodontic treatment is no longer just about uncomfortable metal wires. Let\'s compare clear aligners with traditional brace systems to help you choose.',
    detailedContent: [
      'Nowadays, a beautiful and straight bite is the foundation of both aesthetics and functional health. Correct tooth placement makes them easier to clean and evenly distributes chewing forces, protecting the joints and enamel from premature wear.',
      'Clear aligners have become the first choice for adults and teenagers due to their unmatched convenience and aesthetics. They are made from an extremely durable, medically certified polymer that is completely transparent and practically invisible on the teeth. The main advantage is the ability to remove them during meals and oral hygiene, allowing you to enjoy your favorite foods and clean your teeth perfectly.',
      'Although both methods can achieve excellent results, aligners usually require shorter treatment times and fewer emergency clinic visits. Our specialists at Dentamic will perform a detailed 3D scan to show you a digital model of your future smile and plan the most precise treatment right at your first visit.'
    ],
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
    date: '10 May, 2026',
    author: 'Dr. Janis Kalnins',
    readTime: '5 MIN'
  },
  {
    id: 'porcelana-laminati',
    title: 'Porcelain veneers - a fast path to a Hollywood smile',
    category: 'AESTHETICS',
    description: 'Do you want to correct the shape, color of your teeth, or close gaps? Porcelain veneers offer a fantastic, long-lasting result with minimal tooth preparation.',
    detailedContent: [
      'Aesthetic dentistry has taken a huge leap forward in recent years. Porcelain veneers are ultra-thin, custom-made porcelain shells bonded to the front surface of the teeth, allowing you to fully transform the harmony of your smile in a short time.',
      'Unlike crowns, veneers require only minimal and gentle preparation of the front tooth enamel (sometimes less than half a millimeter), and in some cases, none at all. Porcelain has light transmission and reflection properties identical to natural enamel, creating a completely natural, unsurpassed visual result.',
      'Furthermore, modern Digital Smile Design (DSD) technology at Dentamic clinic allows you to participate in creating your future smile design. We together select the ideal tooth shape, alignment, and shade of whiteness to perfectly match your facial features, lips, and expressions. This is a long-term investment - porcelain does not change color or stain from food or drinks, bringing you joy for many years.'
    ],
    image: 'https://images.unsplash.com/photo-1513223564055-2005be73a3aa?auto=format&fit=crop&q=80&w=800',
    date: '1 May, 2026',
    author: 'Dr. Anna Berzina',
    readTime: '6 MIN'
  }
];

// ==========================================
// REGULAR EXPORTS
// ==========================================

export const DOCTORS = DOCTORS_LV;
export const SERVICES = SERVICES_LV;
export const CLINICS = CLINICS_LV;
export const BLOG_POSTS = BLOG_POSTS_LV;

// ==========================================
// LOCALE HELPERS
// ==========================================

export function getDoctors(lang: string): Doctor[] {
  return lang === 'en-us' ? DOCTORS_EN : DOCTORS_LV;
}

export function getServices(lang: string): Service[] {
  return lang === 'en-us' ? SERVICES_EN : SERVICES_LV;
}

export function getClinics(lang: string): Clinic[] {
  return lang === 'en-us' ? CLINICS_EN : CLINICS_LV;
}

export function getBlogPosts(lang: string): BlogPost[] {
  return lang === 'en-us' ? BLOG_POSTS_EN : BLOG_POSTS_LV;
}
