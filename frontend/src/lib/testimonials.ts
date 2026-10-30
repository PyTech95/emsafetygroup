import { useEffect, useState } from 'react';
import API from './api';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number | null;
  photo_url: string | null;
  featured: boolean;
  order: number;
  created_at: string;
}

export interface AdminTestimonial extends Testimonial {
  published: boolean;
  photo_path: string | null;
}

/** Testimonianze pubblicate (in evidenza per prime). `null` mentre carica. */
export function useTestimonials(): Testimonial[] | null {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  useEffect(() => {
    API.get('/testimonials').then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);
  return items;
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}
