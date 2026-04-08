import type { Category, Product, BlogPost, JobOpening, Project, Testimonial } from './types';

export { certifications, clients } from './mockData';

// On the server, use the absolute backend URL. On the client, use a relative URL
// so Next.js rewrite proxy forwards to the backend (avoids CORS and missing env vars).
function getApiBase() {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://localhost:8000';
  }
  return '';
}

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch {
    console.warn(`[api] ${path} failed`);
    return fallback;
  }
}

// Categories
export const fetchCategories = () => apiFetch<Category[]>('/api/categories', []);
export const fetchCategoryBySlug = (slug: string) =>
  apiFetch<Category | null>(`/api/categories/${slug}`, null);
export const fetchCategoryProducts = (slug: string) =>
  apiFetch<Product[]>(`/api/categories/${slug}/products`, []);

// Products
export const fetchProducts = () => apiFetch<Product[]>('/api/products', []);
export const fetchFeaturedProducts = () => apiFetch<Product[]>('/api/products/featured', []);
export const fetchProductBySlug = (slug: string) =>
  apiFetch<Product | null>(`/api/products/${slug}`, null);

// Blog
export const fetchBlogPosts = () => apiFetch<BlogPost[]>('/api/blog-posts', []);
export const fetchBlogPostBySlug = (slug: string) =>
  apiFetch<BlogPost | null>(`/api/blog-posts/${slug}`, null);

// Jobs
export const fetchJobOpenings = () => apiFetch<JobOpening[]>('/api/job-openings', []);

// Projects
export const fetchProjects = () => apiFetch<Project[]>('/api/projects', []);

// Testimonials
export const fetchTestimonials = () => apiFetch<Testimonial[]>('/api/testimonials', []);
