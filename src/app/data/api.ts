/**
 * API service layer — fetches data from the FastAPI backend.
 * Falls back to mockData when the API is unavailable (dev mode with Vite only).
 */

import type { Product, Category, BlogPost, JobOpening, Project } from './mockData';
import {
  categories as mockCategories,
  products as mockProducts,
  blogPosts as mockBlogPosts,
  jobOpenings as mockJobOpenings,
  projects as mockProjects,
  testimonials as mockTestimonials,
  certifications as mockCertifications,
  clients as mockClients,
} from './mockData';

const API_BASE = '/api';

async function fetchJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch {
    // API unavailable (e.g. running Vite dev server only) — use mock data
    console.warn(`[api] ${path} failed, using fallback data`);
    return fallback;
  }
}

// ── Categories ──────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  return fetchJSON('/categories', mockCategories);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | undefined> {
  const cat = await fetchJSON<Category | null>(`/categories/${slug}`, null);
  return cat ?? mockCategories.find(c => c.slug === slug);
}

export async function fetchCategoryProducts(slug: string): Promise<Product[]> {
  return fetchJSON(`/categories/${slug}/products`, mockProducts.filter(p => p.categorySlug === slug));
}

// ── Products ────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  return fetchJSON('/products', mockProducts);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return fetchJSON('/products/featured', mockProducts.filter(p => p.featured));
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const p = await fetchJSON<Product | null>(`/products/${slug}`, null);
  return p ?? mockProducts.find(pr => pr.slug === slug);
}

// ── Blog ────────────────────────────────────────────

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return fetchJSON('/blog-posts', mockBlogPosts);
}

// ── Jobs ────────────────────────────────────────────

export async function fetchJobOpenings(): Promise<JobOpening[]> {
  return fetchJSON('/job-openings', mockJobOpenings);
}

// ── Projects ────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  return fetchJSON('/projects', mockProjects);
}

// ── Testimonials ────────────────────────────────────

export interface Testimonial {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return fetchJSON('/testimonials', mockTestimonials);
}

// ── Static data (not in DB, kept as-is) ─────────────

export const certifications = mockCertifications;
export const clients = mockClients;
