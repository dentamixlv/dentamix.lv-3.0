export interface Doctor {
  id: string;
  name: string;
  title: string;       // e.g. "Dr. Anna Bērziņa"
  category: string;    // e.g. "SPECIĀLISTE"
  role: string;        // e.g. "ZOBĀRSTE", "ĶIRURGS" etc.
  description: string; // short summary
  fullBio: string;     // long professional bio for detail modal
  image: string;       // generated asset path
  specializations: string[];
  education: string[];
  languages: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  detailedInfo: string;
  priceRange: string;
  duration: string;
  iconName: string; // Lucide icon identifier
  image: string;
}

export interface Booking {
  id: string;
  clinic: 'Rīga' | 'Ādaži';
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  gmapsEmbed?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  description: string;
  detailedContent: string[]; // List of paragraphs for rich display
  image: string;
  date: string;
  author: string;
  readTime: string;
}
