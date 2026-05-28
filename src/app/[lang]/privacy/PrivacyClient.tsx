'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PrivacyClient() {
  const params = useParams();
  const langList = params?.lang;
  const isEn = langList === 'en' || (Array.isArray(langList) && langList[0] === 'en');
  const langPrefix = isEn ? '/en' : '';

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'tween', ease: 'easeOut', duration: 0.45 }
    }
  } as const;

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  } as const;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="py-16 md:py-24 max-w-7xl mx-auto px-6"
    >
      {/* Header Metadata block */}
      <motion.div variants={fadeUpVariants} className="text-center w-full mb-12 animate-fade-in">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#de7c8a] mb-3 block text-center">
          {isEn ? 'Privacy Policy' : 'Privātuma politika'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#511B29] tracking-tight leading-tight mb-6 text-center w-full">
          {isEn
            ? 'Personal Data Privacy Policy'
            : 'Klientu personas datu privātuma politika'}
        </h2>
      </motion.div>

      {/* Article Content */}
      <motion.div variants={fadeUpVariants} className="space-y-6">
        <div className="text-base leading-relaxed text-slate-800 space-y-6 font-normal">
          {isEn ? (
            <>
              <p className="text-[#511B29] font-serif text-lg leading-relaxed border-l-2 border-[#de7c8a] pl-4 font-medium">
                At SIA "Dentamix" (hereinafter – "the Dental Clinic"), we value your privacy. This Privacy Policy has been developed to transparently inform you of your rights and obligations related to the processing of personal data at the Dental Clinic.
              </p>
              <p>
                This Privacy Policy applies to the following natural persons (data subjects, also referred to as "You"):
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Patients of the Dental Clinic (including potential, former and current);</li>
                <li>Visitors of the Dental Clinic, regardless of the reason for the visit.</li>
              </ul>
              <p>
                The purpose of this Privacy Policy is to provide information about the purpose, legal basis, scope and retention period of personal data processing carried out by the Dental Clinic as the data controller.
              </p>
              <p>
                This Privacy Policy has been developed in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data (hereinafter – "the GDPR"), the Latvian Personal Data Processing Law, the Patient Rights Law and other applicable legal acts. As the Dental Clinic continuously develops, we may from time to time amend and supplement this Privacy Policy.
              </p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">1. Information about the Controller</h3>
              <p>The personal data controller specified in this Privacy Policy is SIA "Dentamix" (hereinafter also "the Dental Clinic" and/or "we"), registration number 40103225875, legal address: Brīvības iela 97 - 5, Rīga, LV-1001.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">2. Contact Information for Data Processing Matters</h3>
              <p>You can contact us by phone +371 29 419 999 or by email at info@dentamix.lv.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">3. How You Will Be Informed About the Processing of Your Data</h3>
              <p>To promote transparent data processing, the Dental Clinic informs and explains in this Privacy Policy what personal data is necessary for receiving services and how it will be used. Information may also be provided verbally by the Dental Clinic's staff, or by requesting that you familiarise yourself with the information specified in certain documents (including by confirming such familiarisation with your signature).</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">4. Types of Personal Data Processed by the Dental Clinic</h3>

              <h4 className="font-serif font-bold text-[#511B29]">4.1. Information required for unambiguous identification of the patient and provision of dental services and communication:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name, surname;</li>
                <li>Personal identification number (or an equivalent identification number);</li>
                <li>Residential address;</li>
                <li>Phone number and/or email.</li>
              </ul>
              <p>To enable the staff to verify your identity, you must, upon request, present an identity document – a passport or identification card. This obligation is also stipulated by Article 15(4) of the Patient Rights Law.</p>
              <p>Parents or legal guardians of children (up to 14 years of age) must present a document certifying their right to represent the child's (patient's) interests. Parents must present the child's birth certificate indicating the parent's name. Other persons (sister, brother, grandparents and other relatives) must also present a notarised power of attorney to represent the child's legal rights and interests.</p>

              <h4 className="font-serif font-bold text-[#511B29]">4.2. Within the provision of services, the Dental Clinic may obtain additional information necessary for high-quality and safe service provision, such as:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Information specified in the referral (e.g., health condition, including disease diagnosis);</li>
                <li>Information essential for service provision (e.g., regarding disability, previous medical treatments, illnesses and injuries, allergies, recently or regularly used medications);</li>
                <li>Information obtained within the specific service provision;</li>
                <li>In certain cases, to provide a quality and appropriate service (only in specific situations), it is necessary to take facial and jaw photographs of the client and submit them to the dental technical laboratory. In such cases, the client is always informed in advance.</li>
              </ul>
              <p>The list is not exhaustive, as the specific scope of information depends on the nature of the relevant service and the applicable legal acts governing the terms of service provision.</p>

              <h4 className="font-serif font-bold text-[#511B29]">4.3. Other information not directly related to the service provided, but which may arise or be necessary in connection therewith, e.g.:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Information related to payment administration (including, for example, insurance information);</li>
                <li>For the review of objections and quality control.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">4.4. Information in connection with mutual communication, e.g.:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Information submitted by you in writing (questions, thanks, complaints, suggestions, etc.);</li>
                <li>Our responses to you.</li>
              </ul>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">5. Purposes and Legal Basis for Personal Data Processing</h3>

              <h4 className="font-serif font-bold text-[#511B29]">5.1. Provision and administration of dental services:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>For making patient appointments (including reminders of scheduled visits to specialists);</li>
                <li>For patient identification;</li>
                <li>For conducting consultations and medical procedures;</li>
                <li>For preparing patient medical documentation in accordance with legal requirements.</li>
              </ul>
              <p className="font-medium text-[#511B29]">Legal basis for processing for this purpose:</p>
              <p>Data processing for the purpose of providing healthcare services is carried out based on Article 6(1)(c) of the GDPR (compliance with a legal obligation applicable to the Dental Clinic) and Article 9(2)(h) of the GDPR (data processing for medical treatment purposes). Certain data processing activities are carried out to ensure the legitimate interests of the Dental Clinic or third parties (e.g., organising the service provision process, including reminders of scheduled visits) based on Article 6(1)(f) of the GDPR.</p>
              <p className="font-medium text-[#511B29]">Retention period for this purpose:</p>
              <p>The Dental Clinic stores and processes patient personal data for as long as at least one of the following criteria exists:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>As long as the patient is receiving healthcare services;</li>
                <li>As long as it is possible that the Dental Clinic will need to prove proper fulfilment of its obligations (in accordance with the general limitation period for obligations – no longer than 10 years);</li>
                <li>As long as the Dental Clinic has a legal obligation to retain the relevant data (e.g., the outpatient medical record is kept for 10 years after the last entry).</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.2. Administration of payments for services provided by the Dental Clinic.</h4>
              <p className="font-medium text-[#511B29]">Legal basis:</p>
              <p>Legitimate interests of the Dental Clinic (Article 6(1)(f) of the GDPR) or contract performance (Article 6(1)(b) of the GDPR).</p>
              <p className="font-medium text-[#511B29]">Retention period:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Until payment obligations are fully fulfilled;</li>
                <li>As long as the Dental Clinic has a legal obligation to retain the relevant data. According to the Accounting Law, supporting document information must be kept for 5 years.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.3. Review of patient and visitor objections and quality control.</h4>
              <p className="font-medium text-[#511B29]">Legal basis:</p>
              <p>Legitimate interests of the Dental Clinic (Article 6(1)(f) of the GDPR). In certain cases, the legal basis is also Article 6(1)(c) of the GDPR (compliance with a legal obligation applicable to the Dental Clinic). Where processing is necessary for the establishment, exercise or defence of legal claims, the legal basis for special categories of personal data is Article 9(2)(f) of the GDPR.</p>
              <p className="font-medium text-[#511B29]">Retention period:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Until the relevant issue is fully resolved;</li>
                <li>As long as it is possible that the Dental Clinic will need to prove proper fulfilment of its obligations (in accordance with the general limitation period – no longer than 10 years);</li>
                <li>As long as the Dental Clinic has a legal obligation to retain the relevant data.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.4. Communication and record-keeping.</h4>
              <p>When you contact the Dental Clinic via available communication channels (email, mail), the Dental Clinic saves and records incoming and outgoing correspondence to ensure the fulfilment of obligations applicable to the Dental Clinic and to safeguard the legitimate interests of the Dental Clinic.</p>
              <p className="font-medium text-[#511B29]">Legal basis:</p>
              <p>Retention of information about the fact and content of communication is carried out based on Article 6(1)(c) and (f) of the GDPR. Where you have submitted a complaint or request that creates an obligation for the Dental Clinic to review your request, the legal basis is this legal obligation, while for safeguarding the legitimate interests of the Dental Clinic and third parties (e.g., to investigate cases where complaints about service quality have been received, and to secure evidence against possible claims), the legal basis is the legitimate interests of the Dental Clinic.</p>
              <p className="font-medium text-[#511B29]">Retention period:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Until the relevant issue is fully resolved;</li>
                <li>As long as the Dental Clinic has a legal obligation to retain the relevant data.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.5. Promotion of the Dental Clinic's recognition and popularity.</h4>
              <p>Reflection of the Dental Clinic's professional activities or organised events on the Dental Clinic's website, social networks, premises, etc.</p>
              <p className="font-medium text-[#511B29]">Legal basis:</p>
              <p>Legitimate interests of the Dental Clinic (Article 6(1)(f) of the GDPR). In certain cases also your consent (Article 6(1)(a) of the GDPR).</p>
              <p className="font-medium text-[#511B29]">Retention period:</p>
              <p>The Dental Clinic plans to keep the obtained data indefinitely. To comply with the principle of fair processing, the Dental Clinic explains that, given that the purpose of such data processing is to publicise information about events organised by or involving the Dental Clinic, the obtained materials will be publicly available and any third party may access them.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">6. Possible Recipients of Personal Data</h3>
              <p>The Dental Clinic implements internal control procedures to reduce and prevent the probability of security incidents, such as your personal data falling into the hands of persons not entitled to receive it.</p>
              <p>Accordingly, data transfer to other persons (other individuals, companies or state and local government institutions) is carried out by the Dental Clinic in accordance with strict internal rules developed in compliance with the requirements of the GDPR and the Patient Rights Law. The Dental Clinic does not send your personal data outside the European Union (EU) or the European Economic Area (EEA).</p>
              <p>Personal data processing is performed by authorised employees of the Dental Clinic and processors of the Dental Clinic (natural or legal persons who process personal data on behalf of the Dental Clinic, e.g., a company that processes the Dental Clinic's accounting data). Information may be transferred by the Dental Clinic in cases and to the extent specified in the Patient Rights Law or other laws to other medical institutions – for the achievement of medical purposes; as well as to other institutions, such as the Data State Inspectorate, the Centre for Disease Prevention and Control, the State Agency of Medicines, the Health Inspectorate, the National Health Service or insurance companies.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">7. Your Rights</h3>
              <p className="font-medium">7.1. You have the right to request access to your personal data from the Dental Clinic and to receive clarifying information about what personal data the Dental Clinic holds about you, for what purposes the Dental Clinic processes this personal data, the categories of recipients (persons to whom the personal data has been or will be disclosed, unless legal acts in a specific case allow the Dental Clinic to provide such information – for example, we cannot provide you with information about relevant state institutions that are criminal prosecution authorities, operational activities subjects or other institutions about which legal acts prohibit disclosing such information), information about the period for which the personal data will be stored, or the criteria used to determine that period.</p>
              <p className="font-medium">7.2. If you believe that the information held by the Dental Clinic is outdated, inaccurate or incorrect, you have the right to request the correction of your personal data.</p>
              <p className="font-medium">7.3. You have the right to request the erasure of your personal data, or to object to processing, if you believe that the personal data has been processed unlawfully, or it is no longer necessary in relation to the purposes for which it was collected and/or processed (exercising the "right to be forgotten").</p>
              <p className="font-medium">7.4. Your personal data cannot be deleted if the processing of personal data is necessary for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The Dental Clinic to protect your or another natural person's vital interests, including life and health;</li>
                <li>The Dental Clinic or a third party to establish, exercise or defend its legitimate (legal) interests;</li>
                <li>Data processing is required in accordance with legal acts binding on the Dental Clinic.</li>
              </ul>
              <p className="font-medium">7.5. You have the right to request that the Dental Clinic restrict the processing of your personal data if one of the following circumstances applies:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You contest the accuracy of the personal data – for a period enabling the Dental Clinic to verify the accuracy of the personal data;</li>
                <li>The processing is unlawful and you oppose the erasure of the personal data and request the restriction of their use instead;</li>
                <li>The Dental Clinic no longer needs the personal data for processing, but they are required by you for the establishment, exercise or defence of legal claims;</li>
                <li>You have objected to processing pending the verification whether the legitimate grounds of the Dental Clinic override your legitimate interests.</li>
              </ul>
              <p className="font-medium">7.6. You have the right to withdraw your consent to data processing at any time in the same manner as it was given. In such case, further data processing based on previously given consent for the specific purpose will not be carried out. Withdrawal of consent does not affect data processing carried out during the period when your consent was in effect. Withdrawal of consent cannot interrupt data processing carried out on other legal grounds (e.g., in accordance with external laws or a contract).</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">8. Procedure for Exercising Rights</h3>
              <p className="font-medium">8.1. You may submit a request for the exercise of your rights:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>In writing in person at the Dental Clinic, presenting an identity document;</li>
                <li>By sending an email signed with a secure electronic signature to the Dental Clinic's email address;</li>
                <li>By sending a letter to the Dental Clinic by mail.</li>
              </ul>
              <p className="font-medium">8.2. You are obliged to specify as precisely as possible in your request the date, time, place and other circumstances that would help fulfil this request.</p>
              <p className="font-medium">8.3. After receiving a written request for the exercise of your rights, the Dental Clinic shall:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Verify your identity;</li>
                <li>Evaluate the request and act as follows:
                  <ul className="list-circle pl-6 space-y-1">
                    <li>If the request can be fulfilled, fulfil it as soon as possible;</li>
                    <li>If additional information is needed to identify you or fulfil the request, the Dental Clinic may request additional information to correctly fulfil the request; if the information has been deleted or the person requesting the information is not identified or identifiable, the Dental Clinic may refuse the request.</li>
                  </ul>
                </li>
              </ul>
              <p className="font-medium">8.4. You have the right to submit a complaint to the Data State Inspectorate if you believe that the Dental Clinic has processed your personal data unlawfully.</p>

              <div className="border-t border-[#efedec] pt-6 mt-8">
                <p className="font-medium text-[#511B29]">
                  Confirmed by:
                </p>
                <p>
                  SIA "Dentamix"<br />
                  Board Member<br />
                  Ineta Majore<br />
                  January 9, 2026
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-[#511B29] font-serif text-lg leading-relaxed border-l-2 border-[#de7c8a] pl-4 font-medium">
                Zobārstniecībai "Dentamix" (turpmāk – Zobārstniecība) ir svarīgs savu pacientu privātums, tādēļ ir izstrādāta šī klientu personas datu privātuma politika (turpmāk – Privātuma politika), lai pārredzamā veidā informētu par tiesībām un pienākumiem saistībā ar personas datu apstrādi Zobārstniecībā.
              </p>
              <p>
                Privātuma politiku piemēro attiecībā uz šādām fiziskajām personām - datu subjektiem (citur tekstā arī Jūs):
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Zobārstniecības pacientiem (tajā skaitā, potenciālajiem, bijušajiem un esošajiem);</li>
                <li>Zobārstniecības apmeklētājiem, neatkarīgi no Zobārstniecības apmeklējuma iemesla;</li>
              </ul>
              <p>Privātuma politikas mērķis ir sniegt informāciju par personas datu apstrādes nolūku, tiesisko pamatu, apstrādes apjomu un apstrādes termiņu Zobārstniecības kā personas datu apstrādes pārziņa veiktajām datu apstrādēm.</p>
              <p>Privātuma politika izstrādāta, ņemot vērā Eiropas Parlamenta un padomes 2016. gada 27. aprīļa Regulu 2016/679 par fizisku personu aizsardzību attiecībā uz personas datu apstrādi un šādu datu brīvu apriti (turpmāk – Regula), Fizisko personas datu apstrādes likumu, Pacientu tiesību likumu un citus piemērojamos normatīvos aktus. Ņemot vērā, ka Zobārstniecība pastāvīgi pilnveidojās, mēs laiku pa laikam varam mainīt un papildināt šo Privātuma politiku.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">1. Informācija par pārzini</h3>
              <p>Šajā Privātuma politikā noteiktais personas datu apstrādes pārzinis ir SIA "Dentamix" (citur tekstā arī Zobārstniecība un/vai mēs), reģistrācijas numurs 40103225875, juridiskā adrese Brīvības iela 97 - 5, Rīga, LV-1001.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">2. Kontaktinformācija ar personas datu apstrādi saistītos jautājumos</h3>
              <p>Ar mums var sazināties pa tālruni +371 29 419 999 vai rakstot uz elektroniskā pasta adresi info@dentamix.lv.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">3. Kā Jūs tiksiet informēts par savu datu apstrādi</h3>
              <p>Lai veicinātu pārskatāmu datu apstrādi, Zobārstniecība šajā Privātuma politikā informē un izskaidro, kādi personas dati ir nepieciešami pakalpojumu saņemšanai un kā tie tiks izmantoti. Informāciju Jums var sniegt arī Zobārstniecības personāls, to izskaidrojot mutiski, vai lūdzot iepazīties ar noteiktos dokumentos norādītu informāciju (tai skaitā, lūdzot apliecināt iepazīšanos ar parakstu).</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">4. Personas datu veidi, ko Zobārstniecība apstrādā</h3>

              <h4 className="font-serif font-bold text-[#511B29]">4.1. Informācija, kas nepieciešama pacienta nepārprotamai identifikācijai un zobārstniecības pakalpojumu sniegšanai un saziņas nodrošināšanai:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>vārds uzvārds;</li>
                <li>personas kods (vai cits tam pielīdzināms identifikācijas numurs);</li>
                <li>dzīvesvietas adrese;</li>
                <li>telefona numurs un/ vai e-pasts;</li>
              </ul>
              <p>Lai Zobārstniecības personāls varētu pārliecināties par Jūsu identitāti, Jums pēc Zobārstniecības personāla lūguma ir nepieciešams uzrādīt personu apliecinošu dokumentu - pasi vai identifikācijas apliecību. Šādu pienākumu Jums nosaka arī Pacientu tiesību likuma 15.panta 4.daļa.</p>
              <p>Bērnu (līdz 14 gadu vecumam) vecākiem vai likumīgajiem aizbildņiem jāuzrāda dokuments, kas apliecina tiesības pārstāvēt bērna (pacienta) intereses. Vecākiem jāuzrāda bērna dzimšanas apliecība, kurā norādīts vecāka vārds. Citām personām (māsai, brālim, vecvecākiem un citiem tuviniekiem) jāuzrāda arī notariāli apstiprināta pilnvara pārstāvēt bērna likumiskās tiesības un intereses.</p>

              <h4 className="font-serif font-bold text-[#511B29]">4.2. Pakalpojumu sniegšanas ietvaros Zobārstniecība var iegūt papildus informāciju, kas nepieciešama kvalitatīvai un drošai pakalpojuma sniegšanai, piemēram:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>informācija, kas norādīta nosūtījumā (piemēram: veselības stāvoklis, tai skaitā slimības diagnoze);</li>
                <li>informācija, kas ir būtiska pakalpojuma sniegšanai (piemēram, par invaliditāti, iepriekšējiem ārstniecības gadījumiem, pārciestās slimības un traumas, alerģijām, nesen vai regulāri lietotajiem medikamentiem);</li>
                <li>informāciju, kas tiek iegūta konkrētās pakalpojuma sniegšanas ietvaros;</li>
                <li>atsevišķos gadījumos, lai sniegtu kvalitatīvu un atbilstošu pakalpojumu (tikai specifiskās situācijās), ir nepieciešams veikt klienta sejas un žokļa fotogrāfijas, un iesniegt tās zobu tehniskajai laboratorijai. Šādos gadījumos klients vienmēr tiek iepriekš informēts.</li>
              </ul>
              <p>Uzskaitījums nav izsmeļošs, jo konkrēts informācijas apjoms ir atkarīgs no attiecīgā sniedzamā pakalpojuma specifikas un spēkā esošajiem normatīvajiem aktiem, kuri reglamentē pakalpojuma sniegšanas nosacījumus.</p>

              <h4 className="font-serif font-bold text-[#511B29]">4.3. Cita informācija, kas nav tieši saistīta ar sniegto pakalpojumu, bet var veidoties vai būt nepieciešama saistībā ar to, piemēram:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>informācija, kas saistīta ar norēķinu administrēšanu (tai skaitā, piemēram, informācija par apdrošināšanu);</li>
                <li>personas iebildumu izskatīšanai un kvalitātes kontrolei.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">4.4. Informācijas saistībā ar savstarpējo komunikāciju, piemēram:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Jūsu rakstveidā iesniegtā informācija (jautājumi, pateicības, sūdzības, ierosinājumi u.tml.);</li>
                <li>mūsu sniegtās atbildes Jums.</li>
              </ul>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">5. Personas datu apstrādes nolūki un tiesiskais pamats</h3>

              <h4 className="font-serif font-bold text-[#511B29]">5.1. Zobārstniecības pakalpojumu sniegšanai un administrēšanai:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>pacientu pierakstu noformēšanai (tai skaitā atgādinājumiem par paredzēto vizīti pie speciālistiem);</li>
                <li>pacientu identificēšanai;</li>
                <li>ārstu konsultāciju un medicīnisko manipulāciju veikšanai;</li>
                <li>pacienta medicīniskās dokumentācijas noformēšanai saskaņā ar normatīvajos aktos noteiktajām prasībām.</li>
              </ul>
              <p className="font-medium text-[#511B29]">Datu apstrādes tiesiskais pamats minētajam nolūkam:</p>
              <p>Datu apstrāde ar mērķi nodrošināt veselības aprūpes pakalpojumus tiek veikta pamatojoties uz Regulas 6.panta 1.punkta c) apakšpunktu (uz Zobārstniecību attiecināma juridiska pienākuma izpilde), kā arī Regulas 9.panta 2.punkta h) apakšpunktu (ārstēšanas nolūkā veikta datu apstrāde). Atsevišķas datu apstrādes darbības tiek veiktas, lai nodrošinātu Zobārstniecības vai trešo personu leģitīmās intereses (piemēram, zobārstniecības pakalpojumu sniegšanas procesa organizēšana, tai skaitā atgādinājumiem par paredzēto vizīti) pamatojoties uz Regulas 6.panta 1.punkta f) apakšpunktu.</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes glabāšanas laiks minētajam nolūkam:</p>
              <p>Zobārstniecība glabā un apstrādā pacientu personas datus, kamēr pastāv vismaz viens no šādiem kritērijiem:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>kamēr pacientam tiek sniegts veselības aprūpes pakalpojums;</li>
                <li>kamēr pastāv iespēja, ka Zobārstniecībai būs nepieciešams pierādīt savu saistību pienācīgu izpildi (atbilstoši vispārējo saistību tiesību noilguma termiņam ne ilgāk kā 10 gadus);</li>
                <li>kamēr Zobārstniecībai pastāv normatīvajos aktos noteikts pienākums glabāt attiecīgos datus (piemēram, Zobārstniecības pacienta ambulatorā pacienta karti glabā 10 gadus pēc pēdējā ieraksta).</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.2. Zobārstniecības sniegto pakalpojumu apmaksas administrēšana.</h4>
              <p className="font-medium text-[#511B29]">Datu apstrādes tiesiskais pamats minētajam nolūkam:</p>
              <p>Zobārstniecības leģitīmo interešu ievērošana (Vispārīgās datu aizsardzības regulas 6. panta 1. punkta f) apakšpunkts) vai līguma izpilde (Vispārīgās datu aizsardzības regulas 6. panta 1. punkta b) apakšpunkts).</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes glabāšanas laiks minētajam nolūkam:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>kamēr tiek pilnībā izpildītas maksājuma saistības;</li>
                <li>kamēr Zobārstniecībai pastāv normatīvajos aktos noteikts pienākums glabāt attiecīgos datus. Saskaņā ar Likumu par grāmatvedību, informācija par attaisnojuma dokumentiem glabājama 5 gadus.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.3. Pacientu un apmeklētāju iebildumu izskatīšanai un kvalitātes kontrolei.</h4>
              <p className="font-medium text-[#511B29]">Datu apstrādes tiesiskais pamats minētajam nolūkam:</p>
              <p>Zobārstniecības leģitīmo interešu ievērošana (Vispārīgās datu aizsardzības Regulas 6. panta 1. punkta f) apakšpunkts). Atsevišķos gadījumos šādas datu apstrādes tiesiskais pamats ir arī Regulas 6. panta 1. punkta c) apakšpunkts (uz Zobārstniecību attiecināma juridiska pienākuma izpilde). Gadījumos, kad apstrāde ir vajadzīga, lai īstenotu vai aizstāvētu Zobārstniecības likumīgās intereses tiesā, datu apstrādes tiesiskais pamats īpašu kategoriju personas datiem ir Regulas 9. panta otrās daļas f) punkts.</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes glabāšanas laiks minētajam nolūkam:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>kamēr tiek pilnībā atrisināts attiecīgais jautājums;</li>
                <li>kamēr pastāv iespēja, ka Zobārstniecībai būs nepieciešams pierādīt savu saistību pienācīgu izpildi (atbilstoši vispārējo saistību tiesību noilguma termiņam – ne ilgāk kā 10 gadus);</li>
                <li>kamēr Zobārstniecībai pastāv normatīvajos aktos noteikts pienākums glabāt attiecīgos datus.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.4. Komunikācija un lietvedības uzskaite.</h4>
              <p>Kad Jūs sazināties ar Zobārstniecību, izmantojot pieejamos saziņas kanālus (e-pastu, pastu), Zobārstniecība veic ienākošās un izejošās korespondences saglabāšanu un uzskaiti, lai nodrošinātu uz Zobārstniecību attiecināmu pienākumu izpildi un Zobārstniecības leģitīmo interešu nodrošināšanu.</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes tiesiskais pamats minētajam nolūkam:</p>
              <p>Informācijas saglabāšana par komunikācijas faktu un saturu tiek veikta, pamatojoties uz Regulas 6.panta 1.punkta c) un f) apakšpunktu, t.i. gadījumos, kad Jūs esat iesnieguši pretenziju vai pieprasījumu, no kura izriet Zobārstniecības pienākums izskatīt Jūsu pieprasījumu, datu apstrādes tiesiskais pamats ir šis tiesiskais pienākums, savukārt Zobārstniecības un trešo personu leģitīmo interešu nodrošināšanai (piemēram, lai izmeklētu gadījumus, kad ir saņemtas sūdzības par klientu apkalpošanas kvalitāti kā arī, lai nodrošinātos ar pierādījumiem pret iespējamām pretenzijām), datu apstrādes tiesiskais pamats ir Zobārstniecības leģitīmās intereses.</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes glabāšanas laiks minētajam nolūkam:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>kamēr tiek pilnībā atrisināts attiecīgais jautājums;</li>
                <li>kamēr Zobārstniecībai pastāv normatīvajos aktos noteikts pienākums glabāt attiecīgos datus.</li>
              </ul>

              <h4 className="font-serif font-bold text-[#511B29]">5.5. Zobārstniecības tēla atpazīstamības un popularitātes veicināšanai.</h4>
              <p>Zobārstniecības profesionālās darbības vai organizēto pasākumu norises atspoguļošana Zobārstniecības mājaslapā, sociālajos tīklos, Zobārstniecības telpās u.tml.</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes tiesiskais pamats minētajam nolūkam:</p>
              <p>Zobārstniecības leģitīmo interešu nodrošināšana (Vispārīgās datu aizsardzības Regulas 6. panta 1. punkta f) apakšpunkts). Atsevišķos gadījumos arī Jūsu piekrišana (Vispārīgās datu aizsardzības Regulas 6. panta 1. punkta a) apakšpunkts).</p>
              <p className="font-medium text-[#511B29]">Datu apstrādes glabāšanas laiks minētajam nolūkam:</p>
              <p>Zobārstniecība plāno glabāt iegūtos datus patstāvīgi. Lai izpildītu godprātīgas datu apstrādes principu Zobārstniecība paskaidro, ka, ievērojot apstākli, ka minētās datu apstrādes mērķis ir publiskot informāciju par Zobārstniecības organizētajiem pasākumiem vai pasākumiem, kuros Zobārstniecība ņem dalību, iegūtie materiāli būs publiski pieejami un jebkura trešā persona varēs tiem piekļūt.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">6. Iespējamie personas datu saņēmēji</h3>
              <p>Zobārstniecība īsteno iekšējās kontroles procedūras, lai samazinātu un novērstu drošības incidentu iestāšanās varbūtību, piemēram, Jūsu personas datu nokļūšanu pie personām, kam nav tiesību to saņemt.</p>
              <p>Attiecīgi, datu nodošanu citām personām (citiem cilvēkiem, uzņēmumiem vai valsts un pašvaldības iestādēm) Zobārstniecība īsteno, ievērojot stingrus iekšējos noteikumus, kas izstrādāti saskaņā ar Regulas un Pacientu tiesību likuma prasībām. Zobārstniecība Jūsu personas datus nenosūta ārpus Eiropas Savienības (ES) vai Eiropas Ekonomiskās zonas (EEZ) valstīm.</p>
              <p>Personas datu apstrādi veic Zobārstniecības pilnvaroti darbinieki un Zobārstniecības apstrādātāji (fiziskas vai juridiskas personas, kas personas datus apstrādā Zobārstniecības uzdevumā, piemēram, uzņēmums, kas apstrādā Zobārstniecības grāmatvedības datus). Informāciju par Pacientu tiesību likumā vai citos likumos noteiktajos gadījumos un apjomā Zobārstniecība var nodot citām ārstniecības iestādēm — ārstniecības mērķu sasniegšanai; kā arī citām institūcijām, piemēram, Datu valsts inspekcijai, Slimību profilakses un kontroles centram, Zāļu valsts aģentūrai, Veselības inspekcijai, Nacionālajam veselības dienestam vai apdrošināšanas sabiedrībām.</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">7. Jūsu tiesības</h3>
              <p className="font-medium">7.1. Jums ir tiesības pieprasīt Zobārstniecībai piekļuvi saviem personas datiem un saņemt precizējošu informāciju par to, kādi personas dati par Jums ir Zobārstniecības rīcībā, kādiem nolūkiem Zobārstniecība apstrādā šos personas datus, personas datu saņēmēju kategorijas (personas, kam personas dati ir izpausti vai kam tos paredzēts izpaust, ja vien normatīvie akti konkrētā gadījumā atļauj Zobārstniecībai šādu informāciju sniegt (piemēram, mēs nevaram sniegt Jums informāciju par attiecīgām valsts institūcijām, kuras ir kriminālprocesa virzītāji, operatīvas darbības subjekti vai citas institūcijas, par kurām normatīvie akti aizliedz šādas ziņas izpaust), informāciju par laikposmu, cik ilgi personas dati tiks glabāti, vai kritēriji, ko izmanto minētā laikposma noteikšanai.</p>
              <p className="font-medium">7.2. Ja Jūs uzskatāt, ka Zobārstniecības rīcībā esošā informācija ir novecojusi, neprecīza vai nepareiza, Jums ir tiesības prasīt savu personas datu labošanu.</p>
              <p className="font-medium">7.3. Jums ir tiesības prasīt savu personas datu dzēšanu, vai iebilst pret apstrādi, ja Jūs uzskatāt, ka personas dati ir apstrādāti nelikumīgi, vai tie vairs nav nepieciešami saistībā ar nolūkiem, kādiem tie tika vākti un/vai apstrādāti (īstenojot principu - tiesības "tikt aizmirstam").</p>
              <p className="font-medium">7.4. Jūsu personas dati nevar tikt dzēsti, ja personas datu apstrāde ir nepieciešama:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>lai Zobārstniecība aizsargātu Jūsu vai citas fiziskas personas vitāli svarīgas intereses, tajā skaitā, dzīvību un veselību;</li>
                <li>lai Zobārstniecība vai trešā persona celtu, īstenotu vai aizstāvētu savas likumīgās (tiesiskās) intereses;</li>
                <li>datu apstrāde nepieciešama saskaņā ar Zobārstniecībai saistošiem normatīvajiem aktiem.</li>
              </ul>
              <p className="font-medium">7.5. Jums ir tiesības prasīt, lai Zobārstniecība ierobežotu Jūsu personas datu apstrādi, ja ir viens no šādiem apstākļiem:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Jūs apstrīdat personas datu precizitāti – uz laiku, kurā Zobārstniecība var pārbaudīt personas datu precizitāti;</li>
                <li>apstrāde ir nelikumīga, un Jūs iebilstat pret personas datu dzēšanu un tās vietā pieprasāt datu izmantošanas ierobežošanu;</li>
                <li>Zobārstniecībai personas dati apstrādei vairs nav vajadzīgi, taču tie ir nepieciešami Jums, lai celtu, īstenotu vai aizstāvētu likumīgas prasības;</li>
                <li>Jūs esat iebildis pret apstrādi, kamēr nav pārbaudīts, vai Zobārstniecības leģitīmie iemesli nav svarīgāki par Jūsu leģitīmajiem interesēm.</li>
              </ul>
              <p className="font-medium">7.6. Jums ir tiesības jebkurā brīdī atsaukt datu apstrādei doto piekrišanu tādā pat veidā, kādā tā dota. Šādā gadījumā turpmāka datu apstrāde, kas balstīta uz iepriekš doto piekrišanu konkrētajam nolūkam turpmāk netiks veikta. Piekrišanas atsaukums neietekmē datu apstrādes, kuras veiktas tajā laikā, kad Jūsu piekrišana bija spēkā. Atsaucot piekrišanu, nevar tikt pārtraukta datu apstrāde, kuru veic, pamatojoties uz citiem tiesiskajiem pamatiem (piemēram, saskaņā ar ārējiem normatīvajiem aktiem vai līgumu).</p>

              <h3 className="text-lg font-serif font-bold text-[#511B29] pt-4">8. Tiesību īstenošanas kārtība</h3>
              <p className="font-medium">8.1. Jūs varat iesniegt pieprasījumu par savu tiesību īstenošanu:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>rakstveida formā klātienē Zobārstniecībā, uzrādot personu apliecinošu dokumentu:</li>
                <li>nosūtot pa elektronisko pastu, parakstot vēstuli ar drošu elektronisko parakstu un nosūtot uz Zobārstniecības e-pasta adresi;</li>
                <li>nosūtot Zobārstniecībai vēstuli pa pastu.</li>
              </ul>
              <p className="font-medium">8.2. Jums ir pienākums cik vien iespējams savā pieprasījumā precizēt datumu, laiku, vietu un citus apstākļus, kas palīdzētu izpildīt šo pieprasījumu.</p>
              <p className="font-medium">8.3. Pēc rakstveida pieprasījuma saņemšanas par savu tiesību īstenošanu Zobārstniecība:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>pārliecinās par personas identitāti;</li>
                <li>izvērtē pieprasījumu un rīkojas šādi;</li>
                <li>ja var nodrošināt pieprasījumu, pēc iespējas īsākā laikā izpilda to;</li>
                <li>ja ir nepieciešama papildus informācija, lai Jūs identificētu vai izpildītu pieprasījumu, tad Zobārstniecība var lūgt Jums papildus informāciju, lai spētu korekti izpildīt pieprasījumu; ja informācija ir dzēsta vai persona, kas pieprasa informāciju nav cita vai persona nav identificējamam, tad Zobārstniecība var noraidīt pieprasījumu.</li>
              </ul>
              <p className="font-medium">8.4. Jums ir tiesības iesniegt sūdzību Datu valsts inspekcijai, ja uzskatāt, ka Zobārstniecība Jūsu personas datus ir apstrādājusi prettiesiski.</p>

              <div className="border-t border-[#efedec] pt-6 mt-8">
                <p className="font-medium text-[#511B29]">
                  Apstiprinu:
                </p>
                <p>
                  SIA "Dentamix"<br />
                  valdes locekle<br />
                  Ineta Majore<br />
                  2026. gada 9. janvārī.
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <Link
          href={langPrefix || '/'}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6a5b5e] hover:text-[#511B29] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#de7c8a]" />
          {isEn ? 'Back to Home' : 'Atpakaļ uz sākumu'}
        </Link>
      </div>
    </motion.div>
  );
}