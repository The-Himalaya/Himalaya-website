// Mock data for The Himalaya products
// This file simulates what would come from a CMS like Sanity/Contentful

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  loadClass?: string;
  image: string;
  specs: {
    [key: string]: string;
  };
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

export const categories: Category[] = [
  {
    id: "frp-grp",
    name: "FRP/GRP Products",
    slug: "frp-grp-products",
    description: "Glass Fiber Reinforced Plastic manhole covers and access covers",
    productCount: 15,
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    advantages: [
      "Corrosion-free composite material",
      "70% lighter than cast iron",
      "Load class tested & certified",
      "Anti-theft (zero scrap value)",
    ],
  },
  {
    id: "rcc",
    name: "RCC Covers",
    slug: "rcc-covers",
    description: "Reinforced Cement Concrete manhole covers",
    productCount: 12,
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    advantages: [
      "High compressive strength",
      "Durable concrete construction",
      "Cost-effective solution",
      "Weather-resistant finish",
    ],
  },
  {
    id: "blocks",
    name: "Cover Blocks",
    slug: "cover-blocks",
    description: "Concrete cover blocks for reinforcement protection",
    productCount: 8,
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    advantages: [
      "Uniform spacing maintained",
      "Prevents steel corrosion",
      "Various sizes available",
      "Easy to install",
    ],
  },
  {
    id: "pipes",
    name: "Hume Pipes",
    slug: "hume-pipes",
    description: "RCC Hume pipes for drainage and sewerage",
    productCount: 10,
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    advantages: [
      "High load-bearing capacity",
      "Leak-proof joints",
      "Long service life",
      "IS certified quality",
    ],
  },
];

export const products: Product[] = [
  {
    id: "frp-d400-round",
    name: "Round Manhole Cover D400",
    slug: "round-manhole-d400",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "D400",
    standard: "IS:12592:2012",
    featured: true,
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "Premium FRP/GRP round manhole cover designed for heavy-duty applications in highways and industrial areas.",
    specs: {
      diameter: "600mm",
      thickness: "50mm",
      weight: "18kg",
      loadCapacity: "40 tons",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid textured surface",
    },
    applications: [
      "Highway roads and streets",
      "Urban drainage systems",
      "Municipal infrastructure",
      "Industrial facilities",
      "Parking areas",
    ],
    installation: [
      "Ensure frame is level and properly seated",
      "Clean contact surfaces before installation",
      "Apply sealant around frame perimeter",
      "Secure cover with provided locking mechanism",
      "Test load-bearing capacity post-installation",
    ],
  },
  {
    id: "frp-d400-square",
    name: "Square Manhole Cover D400",
    slug: "square-manhole-d400",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "D400",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Square profile FRP manhole cover for modern infrastructure projects.",
    specs: {
      dimensions: "600x600mm",
      thickness: "50mm",
      weight: "20kg",
      loadCapacity: "40 tons",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Diamond pattern anti-skid",
    },
    applications: [
      "Smart city projects",
      "Metro railway systems",
      "Commercial complexes",
      "Industrial parks",
    ],
  },
  {
    id: "frp-c250-round",
    name: "Round Manhole Cover C250",
    slug: "round-manhole-c250",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "C250",
    standard: "IS:12592:2012",
    featured: true,
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "Medium-duty FRP manhole cover suitable for pedestrian and light traffic areas.",
    specs: {
      diameter: "600mm",
      thickness: "40mm",
      weight: "15kg",
      loadCapacity: "25 tons",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid textured",
    },
    applications: [
      "Pedestrian walkways",
      "Residential areas",
      "Light traffic zones",
      "Parks and gardens",
    ],
  },
  {
    id: "rcc-heavy-duty",
    name: "Heavy Duty RCC Cover",
    slug: "rcc-heavy-duty",
    category: "RCC Covers",
    categorySlug: "rcc-covers",
    loadClass: "D400",
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    description: "Reinforced concrete manhole cover for maximum load capacity.",
    specs: {
      dimensions: "600x600mm",
      thickness: "80mm",
      weight: "65kg",
      loadCapacity: "40 tons",
      material: "Reinforced Cement Concrete",
      finish: "Smooth concrete finish",
    },
    applications: [
      "Highways and expressways",
      "Heavy industrial areas",
      "Cargo terminals",
      "Freight zones",
    ],
  },
  {
    id: "cover-block-25mm",
    name: "Concrete Cover Block 25mm",
    slug: "cover-block-25mm",
    category: "Cover Blocks",
    categorySlug: "cover-blocks",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Standard 25mm cover blocks for reinforcement spacing.",
    specs: {
      size: "25mm",
      material: "High-strength concrete",
      quantity: "100 pcs/bag",
      application: "Slab reinforcement",
    },
    applications: [
      "Building construction",
      "Slab reinforcement",
      "Beam works",
      "Foundation works",
    ],
  },
  {
    id: "hume-pipe-600",
    name: "RCC Hume Pipe 600mm",
    slug: "hume-pipe-600",
    category: "Hume Pipes",
    categorySlug: "hume-pipes",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "600mm diameter RCC hume pipe for drainage systems.",
    specs: {
      diameter: "600mm",
      length: "2.5m",
      thickness: "75mm",
      loadClass: "NP3",
      material: "Reinforced Cement Concrete",
    },
    applications: [
      "Storm water drainage",
      "Sewage systems",
      "Culvert construction",
      "Underground drainage",
    ],
  },
];

export const certifications = [
  {
    name: "IS:12592",
    fullName: "IS:12592:2012",
    description: "Indian Standard for Precast Concrete Covers for Manholes and Inspection Chambers",
    issuer: "Bureau of Indian Standards",
  },
  {
    name: "BIS Certified",
    fullName: "BIS License",
    description: "Bureau of Indian Standards Product Certification",
    issuer: "Government of India",
  },
  {
    name: "ISO 9001:2015",
    fullName: "ISO 9001:2015",
    description: "Quality Management System Certification",
    issuer: "International Organization for Standardization",
  },
];

export const clients = [
  "L&T",
  "TATA Projects",
  "Adani Infrastructure",
  "Reliance Infrastructure",
  "Larsen & Toubro",
  "Gujarat Municipal Board",
  "Ahmedabad Municipal Corporation",
  "Gujarat State Road Transport Corporation",
  "Mumbai Metro Rail Corporation",
  "Surat Municipal Corporation",
];

export const testimonials = [
  {
    name: "Rajesh Mehta",
    position: "Project Manager",
    company: "L&T Infrastructure",
    content: "The Himalaya's FRP covers have been exceptional. 5000+ units installed across our projects with zero failures.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    position: "Chief Engineer",
    company: "Mumbai Metro",
    content: "Lightweight, durable, and perfectly compliant with specifications. Outstanding quality control.",
    rating: 5,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

// Blog Posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "frp-vs-cast-iron",
    title: "FRP vs Cast Iron Manhole Covers: A Technical Comparison",
    slug: "frp-vs-cast-iron-technical-comparison",
    excerpt: "Comprehensive analysis of load capacity, durability, and cost-effectiveness between FRP/GRP and traditional cast iron covers.",
    content: "Full article content...",
    category: "Technical Guides",
    author: "Engineering Team",
    date: "2026-02-20",
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    featured: true,
  },
  {
    id: "smart-city-infrastructure",
    title: "Smart City Infrastructure: The Role of Modern Manhole Solutions",
    slug: "smart-city-infrastructure-manhole-solutions",
    excerpt: "How modern FRP/GRP products are enabling smart city developments across India.",
    content: "Full article content...",
    category: "Industry News",
    author: "Rajesh Kumar",
    date: "2026-02-15",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
  },
  {
    id: "mumbai-metro-project",
    title: "Case Study: 5000+ FRP Covers Installed at Mumbai Metro",
    slug: "mumbai-metro-project-case-study",
    excerpt: "Behind the scenes of our largest infrastructure project to date.",
    content: "Full article content...",
    category: "Project Spotlights",
    author: "Project Team",
    date: "2026-02-10",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    featured: true,
  },
];

// Career Openings
export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
}

export const jobOpenings: JobOpening[] = [
  {
    id: "sales-manager",
    title: "Regional Sales Manager",
    department: "Sales & Marketing",
    location: "Ahmedabad, Gujarat",
    type: "Full-time",
    experience: "5-8 years",
    description: "Lead sales operations across Gujarat and surrounding regions. Manage client relationships and drive revenue growth.",
    requirements: [
      "Bachelor's degree in Business or Engineering",
      "5+ years in B2B sales, preferably in construction/infrastructure",
      "Strong network in Gujarat infrastructure sector",
      "Excellent communication and negotiation skills",
      "Willingness to travel extensively",
    ],
  },
  {
    id: "production-engineer",
    title: "Production Engineer",
    department: "Manufacturing",
    location: "Ahmedabad, Gujarat",
    type: "Full-time",
    experience: "2-4 years",
    description: "Oversee FRP/GRP production processes, quality control, and process optimization.",
    requirements: [
      "B.E./B.Tech in Mechanical/Chemical Engineering",
      "Experience in composites manufacturing preferred",
      "Knowledge of quality management systems",
      "Strong problem-solving abilities",
      "Proficiency in production planning",
    ],
  },
];

// Project Showcase
export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  year: number;
  products: string[];
  quantity: string;
  image: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: "mumbai-metro",
    name: "Mumbai Metro Line 3",
    client: "Mumbai Metro Rail Corporation",
    location: "Mumbai, Maharashtra",
    year: 2025,
    products: ["FRP D400 Covers", "RCC Chambers"],
    quantity: "5000+ units",
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "Supplied and installed FRP manhole covers across 33 metro stations.",
  },
  {
    id: "surat-smart-city",
    name: "Surat Smart City Project",
    client: "Surat Municipal Corporation",
    location: "Surat, Gujarat",
    year: 2024,
    products: ["FRP Covers", "Hume Pipes"],
    quantity: "3000+ units",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Infrastructure upgrade with corrosion-free FRP solutions.",
  },
  {
    id: "ahmedabad-ring-road",
    name: "Ahmedabad Ring Road Expansion",
    client: "Gujarat State Highway Authority",
    location: "Ahmedabad, Gujarat",
    year: 2024,
    products: ["RCC Covers", "Cover Blocks"],
    quantity: "2500+ units",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "Heavy-duty RCC covers for high-traffic highway infrastructure.",
  },
];