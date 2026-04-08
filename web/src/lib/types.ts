export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  loadClass?: string;
  image: string;
  images?: string[];
  datasheet?: string;
  specs: string;
  applications: string[];
  installation?: string[];
  description: string;
  standard?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
  advantages: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date?: string;
  createdAt?: string;
  image: string;
  images?: string[];
  featured?: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type?: string;
  jobType?: string;
  experience: string;
  description: string;
  requirements: string[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  year: number;
  products?: string[];
  productsUsed?: string[];
  quantity: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
}

export interface Certification {
  name: string;
  fullName: string;
  description: string;
  issuer: string;
}
