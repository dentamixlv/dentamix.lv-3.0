import { Doctor } from '../types';

export const DOCTORS_LV: Doctor[] = [
  {
    id: 'dr-anna-berzina',
    name: 'Dr. Anna Bērziņa',
    title: 'Dr. Anna Bērziņa',
    category: 'SPECIĀLISTE',
    role: 'ZOBĀRSTE',
    description: 'Dr. Bērziņa ir vadošā speciāliste estētiskajā zobārstniecībā ar vairāk nekā 10 gadu pieredzi. Viņas pieeja balstās uz minimāli invazīvām metodēm, nodrošinot pacientiem mierpilnu un nesāpīgu ārstēšanas procesu.',
    fullBio: 'Dr. Anna Bērziņa absolvējusi Rīgas Stradiņa universitātes Zobārstniecības fakultāti un regulāri papildina zināšanas starptautiskos kongresos Vācijā un Šveicē. Viņa specializējas augstākās sarežģītības pakāpes estētisko rekonstrukciju un protezēšanas darbos, izmantojot modernākās laminātu un bezmetāla keramikas tehnoloģijas. Viņas mērķis ir radīt dabisku un harmonisku smaidu, maksimāli saglabājot zobu veselos audus. Pacienti viņu raksturo kā izcili iejūtīgu, nepārspējami precīzu un dabiski nomierinošu speciālisti.',
    image: 'https://images.prismic.io/dentamix-v30/ahXHyrK9tuLqEKMT_01.png',
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

export const DOCTORS_EN: Doctor[] = [
  {
    id: 'dr-anna-berzina',
    name: 'Dr. Anna Berzina',
    title: 'Dr. Anna Berzina',
    category: 'SPECIALIST',
    role: 'DENTIST',
    description: 'Dr. Berzina is a leading specialist in aesthetic dentistry with over 10 years of experience. Her approach is based on minimally invasive methods, ensuring a peaceful and painless treatment process.',
    fullBio: 'Dr. Anna Berzina graduated from the Faculty of Dentistry at Riga Stradins University and regularly refines her knowledge at international congresses in Germany and Switzerland. She specializes in highly complex aesthetic restorations and prosthetics, utilizing state-of-the-art veneers and metal-free ceramic technologies. Her goal is to create a natural and harmonious smile while preserving maximum healthy tooth structure. Patients describe her as highly empathetic, exceptionally precise, and naturally calming.',
    image: 'https://images.prismic.io/dentamix-v30/ahXHyrK9tuLqEKMT_01.png',
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
