import { Clinic } from '../types';

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
    waze: 'https://www.waze.com/live-map/directions?to=ll.56.9585641%2C24.1313913',
    accessibilityAlert: 'Klīnika ir pilnībā pieejama cilvēkiem ratiņkrēslos.',
    accessibilityAlertSecond: 'Vides pieejamības pašnovērtējums - atbilst.'
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
    waze: 'https://www.waze.com/live-map/directions?to=ll.57.0725451%2C24.3257538',
    accessibilityAlert: 'Klīnika ir pilnībā pieejama cilvēkiem ratiņkrēslos.',
    accessibilityAlertSecond: 'Vides pieejamības pašnovērtējums - atbilst.'
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
    waze: 'https://www.waze.com/live-map/directions?to=ll.56.9585641%2C24.1313913',
    accessibilityAlert: 'The clinic is fully accessible for wheelchair users.',
    accessibilityAlertSecond: 'Self-assessment of environmental accessibility - compliant.'
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
    waze: 'https://www.waze.com/live-map/directions?to=ll.57.0725451%2C24.3257538',
    accessibilityAlert: 'The clinic is fully accessible for wheelchair users.',
    accessibilityAlertSecond: 'Self-assessment of environmental accessibility - compliant.'
  }
];
