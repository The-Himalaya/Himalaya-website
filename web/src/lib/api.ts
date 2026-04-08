import type { Category, Product, BlogPost, JobOpening, Project, Testimonial } from './types';

// Import mock data as fallback for when API is unavailable
import { categories as mockCategories, products as mockProducts, blogPosts as mockBlogPosts, jobOpenings as mockJobOpenings, projects as mockProjects, testimonials as mockTestimonials } from './mockData';
export { certifications, clients } from './mockData';

const API_BASE = process.env.INTERNAL_API_URL || 'http://localhost:8000';
// Client-side fetches use a relative URL so Next.js proxy rewrites handle routing.
// Never use an absolute host here — it bypasses rewrites and triggers CORS failures.
const CLIENT_API_BASE = '';

async function serverFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch {
    console.warn(`[api] ${path} failed, using fallback data`);
    return fallback;
  }
}

// Client-side fetch (used in 'use client' components)
export async function clientFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${CLIENT_API_BASE}${path}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch {
    console.warn(`[api] ${path} failed, using fallback data`);
    return fallback;
  }
}

// Categories
export const fetchCategories = () => serverFetch<Category[]>('/api/categories', mockCategories);
export const fetchCategoryBySlug = (slug: string) =>
  serverFetch<Category | null>(`/api/categories/${slug}`, mockCategories.find((c) => c.slug === slug) || null);
export const fetchCategoryProducts = (slug: string) =>
  serverFetch<Product[]>(`/api/categories/${slug}/products`, mockProducts.filter((p) => p.categorySlug === slug));

// Products
export const fetchProducts = () => serverFetch<Product[]>('/api/products', mockProducts);
export const fetchFeaturedProducts = () =>
  serverFetch<Product[]>('/api/products/featured', mockProducts.filter((p) => p.featured));
export const fetchProductBySlug = (slug: string) =>
  serverFetch<Product | null>(`/api/products/${slug}`, mockProducts.find((p) => p.slug === slug) || null);

// Blog
export const fetchBlogPosts = () => serverFetch<BlogPost[]>('/api/blog-posts', mockBlogPosts);
export const fetchBlogPostBySlug = (slug: string) =>
  serverFetch<BlogPost | null>(`/api/blog-posts/${slug}`, mockBlogPosts.find((p) => p.slug === slug) || null);

// Jobs
export const fetchJobOpenings = () => serverFetch<JobOpening[]>('/api/job-openings', mockJobOpenings);

// Projects
export const fetchProjects = () => serverFetch<Project[]>('/api/projects', mockProjects);

// Testimonials
export const fetchTestimonials = () => serverFetch<Testimonial[]>('/api/testimonials', mockTestimonials);
