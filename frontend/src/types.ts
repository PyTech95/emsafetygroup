export interface Course {
  id: string;
  title: string;
  category: 'lavoratori' | 'preposti' | 'dirigenti' | 'rspp' | 'emergenza' | 'attrezzature';
  categoryLabel: string;
  mode: ('milano' | 'treviso' | 'fad')[];
  duration: string;
  legalRef: string;
  nextDate: string;
  location: string;
  badge: string;
  badgeType: 'open' | 'urgent' | 'mandatory';
  description: string;
  program: string[];
  prerequisites: string;
  certification: string;
  targetAudience: string;
  hours: number;
}

export interface QuoteFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  notes: string;
  privacy: boolean;
  estimatedStaff?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface OfficeLocation {
  city: string;
  province: string;
  role: string;
  address: string;
  phone: string;
  email: string;
  note: string;
}
