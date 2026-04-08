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
    description: "Glass Fiber Reinforced Plastic manhole covers and access covers — IS:12592:2012 certified, load classes A15 to D400",
    productCount: 7,
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    advantages: [
      "Corrosion-free composite — zero maintenance",
      "70% lighter than cast iron",
      "IS:12592:2012 load-tested & BIS certified",
      "Anti-theft by design (zero scrap value)",
    ],
  },
  {
    id: "rcc",
    name: "RCC Covers",
    slug: "rcc-covers",
    description: "Reinforced Cement Concrete manhole covers for roads, highways, and municipal drainage",
    productCount: 3,
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    advantages: [
      "High compressive strength (M35–M40 grade)",
      "Cost-effective for large-scale projects",
      "Weather and UV resistant",
      "IS:12592:2012 certified",
    ],
  },
  {
    id: "blocks",
    name: "Cover Blocks",
    slug: "cover-blocks",
    description: "Precast concrete cover blocks for reinforcement protection — 20mm to 75mm sizes per IS:456",
    productCount: 5,
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    advantages: [
      "Uniform cover spacing maintained",
      "Prevents steel corrosion and carbonation",
      "5 standard sizes: 20mm to 75mm",
      "High compressive strength ≥ 25 N/mm²",
    ],
  },
  {
    id: "pipes",
    name: "Hume Pipes",
    slug: "hume-pipes",
    description: "IS:458 certified RCC Hume pipes for drainage, sewerage, and culvert construction",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    advantages: [
      "High load-bearing capacity (NP2–NP3 class)",
      "Smooth interior for optimal flow",
      "Leak-proof spigot-and-socket joints",
      "Long service life (50+ years)",
    ],
  },
];

const _frpInstall = [
  "Ensure the frame is level and properly bedded in mortar",
  "Clean all contact surfaces before seating the cover",
  "Apply sealant around the frame perimeter",
  "Secure the cover with the provided anti-theft locking mechanism",
  "Test load-bearing capacity and flush alignment after installation",
];

const _rccInstall = [
  "Prepare the frame bed with M20 mortar",
  "Seat the frame level and allow to cure for 24 hours",
  "Lower the RCC cover carefully using lifting hooks",
  "Check flush alignment with surrounding road surface",
  "Allow full cure before opening to traffic",
];

export const products: Product[] = [
  // ── FRP/GRP Products ──────────────────────────────────
  {
    id: "frp-round-d400",
    name: "Round FRP Cover D400",
    slug: "frp-round-d400",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "D400",
    standard: "IS:12592:2012",
    featured: true,
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "Heavy-duty FRP/GRP round manhole cover rated for 40-ton loads. Ideal for national highways, expressways, and high-traffic urban roads. Corrosion-free and anti-theft by design.",
    specs: {
      shape: "Round",
      diameter: "600 mm",
      thickness: "50 mm",
      weight: "18 kg",
      loadCapacity: "400 kN (40 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid diamond pattern",
    },
    applications: [
      "National highways and expressways",
      "Urban arterial roads",
      "Municipal drainage systems",
      "Industrial estates and cargo terminals",
      "Smart city infrastructure",
    ],
    installation: _frpInstall,
  },
  {
    id: "frp-square-d400",
    name: "Square FRP Cover D400",
    slug: "frp-square-d400",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "D400",
    standard: "IS:12592:2012",
    featured: true,
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Square-profile heavy-duty FRP cover for modern infrastructure projects requiring high load ratings and a flush, aesthetic finish.",
    specs: {
      shape: "Square",
      dimensions: "600 × 600 mm",
      thickness: "50 mm",
      weight: "20 kg",
      loadCapacity: "400 kN (40 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid ribbed pattern",
    },
    applications: [
      "Metro railway stations",
      "Smart city and AMRUT projects",
      "Commercial complexes and malls",
      "Industrial parks",
      "Airport aprons and taxiways",
    ],
    installation: _frpInstall,
  },
  {
    id: "frp-round-c250",
    name: "Round FRP Cover C250",
    slug: "frp-round-c250",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "C250",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "Medium-duty FRP manhole cover rated 25 tons, designed for slow-moving vehicles, residential roads, and light-commercial applications.",
    specs: {
      shape: "Round",
      diameter: "600 mm",
      thickness: "40 mm",
      weight: "15 kg",
      loadCapacity: "250 kN (25 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid textured",
    },
    applications: [
      "Residential layouts and colonies",
      "Housing board projects",
      "Light commercial zones",
      "Municipality water supply networks",
    ],
    installation: _frpInstall,
  },
  {
    id: "frp-square-c250",
    name: "Square FRP Cover C250",
    slug: "frp-square-c250",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "C250",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    description: "Square medium-duty FRP cover for residential streets and utility access points requiring 25-ton load rating.",
    specs: {
      shape: "Square",
      dimensions: "600 × 600 mm",
      thickness: "40 mm",
      weight: "17 kg",
      loadCapacity: "250 kN (25 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid ribbed pattern",
    },
    applications: [
      "Residential roads",
      "Colony drainage networks",
      "Campus utility access",
      "Low-traffic commercial areas",
    ],
    installation: _frpInstall,
  },
  {
    id: "frp-round-b125",
    name: "Round FRP Cover B125",
    slug: "frp-round-b125",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "B125",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "Light-duty FRP cover rated 12.5 tons for footways, car parks, and pedestrian zones. Extremely lightweight at under 10 kg.",
    specs: {
      shape: "Round",
      diameter: "600 mm",
      thickness: "30 mm",
      weight: "9 kg",
      loadCapacity: "125 kN (12.5 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid textured",
    },
    applications: [
      "Footpaths and pedestrian zones",
      "Multi-level car parks",
      "Gardens and parks",
      "Utility inspection covers",
    ],
    installation: _frpInstall,
  },
  {
    id: "frp-round-a15",
    name: "Round FRP Cover A15",
    slug: "frp-round-a15",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "A15",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "Pedestrian-rated FRP cover for foot-traffic-only areas. Lightest option in the range, ideal for parks, plazas, and indoor utility access.",
    specs: {
      shape: "Round",
      diameter: "450 mm",
      thickness: "25 mm",
      weight: "5 kg",
      loadCapacity: "15 kN (1.5 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Smooth anti-skid",
    },
    applications: [
      "Pedestrian plazas and footpaths",
      "Public parks",
      "Indoor utility access",
      "Landscaped areas",
    ],
    installation: _frpInstall,
  },
  {
    id: "frp-rect-d400",
    name: "Rectangular FRP Cover D400",
    slug: "frp-rect-d400",
    category: "FRP/GRP Products",
    categorySlug: "frp-grp-products",
    loadClass: "D400",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Rectangular heavy-duty FRP cover for elongated access chambers and cable duct openings in highway and metro applications.",
    specs: {
      shape: "Rectangular",
      dimensions: "600 × 450 mm",
      thickness: "50 mm",
      weight: "16 kg",
      loadCapacity: "400 kN (40 tons)",
      material: "Glass Fiber Reinforced Plastic",
      finish: "Anti-skid diamond pattern",
    },
    applications: [
      "Cable duct access points",
      "Telecom and utility chambers",
      "Metro rail cable corridors",
      "Industrial plant access",
    ],
    installation: _frpInstall,
  },

  // ── RCC Covers ────────────────────────────────────────
  {
    id: "rcc-round-d400",
    name: "Round RCC Cover D400",
    slug: "rcc-round-d400",
    category: "RCC Covers",
    categorySlug: "rcc-covers",
    loadClass: "D400",
    standard: "IS:12592:2012",
    featured: true,
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    description: "Heavy-duty reinforced concrete round manhole cover for high-traffic roads and industrial areas. Proven durability with steel reinforcement.",
    specs: {
      shape: "Round",
      diameter: "600 mm",
      thickness: "80 mm",
      weight: "60 kg",
      loadCapacity: "400 kN (40 tons)",
      material: "Reinforced Cement Concrete (M40)",
      finish: "Smooth concrete finish",
    },
    applications: [
      "Highways and expressways",
      "Heavy industrial areas",
      "Cargo terminals and freight zones",
      "Municipal road networks",
    ],
    installation: _rccInstall,
  },
  {
    id: "rcc-square-d400",
    name: "Square RCC Cover D400",
    slug: "rcc-square-d400",
    category: "RCC Covers",
    categorySlug: "rcc-covers",
    loadClass: "D400",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "Square heavy-duty RCC manhole cover, economical choice for road projects with high load requirements.",
    specs: {
      shape: "Square",
      dimensions: "600 × 600 mm",
      thickness: "80 mm",
      weight: "70 kg",
      loadCapacity: "400 kN (40 tons)",
      material: "Reinforced Cement Concrete (M40)",
      finish: "Smooth with anti-slip groove",
    },
    applications: [
      "Urban road infrastructure",
      "State highway projects",
      "Drainage chamber access",
      "Stormwater network",
    ],
    installation: _rccInstall,
  },
  {
    id: "rcc-round-c250",
    name: "Round RCC Cover C250",
    slug: "rcc-round-c250",
    category: "RCC Covers",
    categorySlug: "rcc-covers",
    loadClass: "C250",
    standard: "IS:12592:2012",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Medium-duty RCC round manhole cover for residential roads, colony streets, and municipal drainage networks.",
    specs: {
      shape: "Round",
      diameter: "600 mm",
      thickness: "65 mm",
      weight: "48 kg",
      loadCapacity: "250 kN (25 tons)",
      material: "Reinforced Cement Concrete (M35)",
      finish: "Smooth concrete finish",
    },
    applications: [
      "Residential colony roads",
      "Municipal water supply manholes",
      "Light commercial streets",
      "Housing board projects",
    ],
    installation: _rccInstall,
  },

  // ── Cover Blocks ──────────────────────────────────────
  {
    id: "cover-block-20mm",
    name: "Concrete Cover Block 20mm",
    slug: "cover-block-20mm",
    category: "Cover Blocks",
    categorySlug: "cover-blocks",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "20mm precast concrete cover block for thin slabs and wall reinforcement where minimum cover is required.",
    specs: {
      size: "20 mm",
      shape: "Cube / Cylindrical",
      material: "High-strength concrete (M25)",
      compressiveStrength: "≥ 25 N/mm²",
      quantity: "100 pcs / bag",
    },
    applications: ["Thin RCC slabs", "Wall reinforcement cover", "Precast panels"],
  },
  {
    id: "cover-block-25mm",
    name: "Concrete Cover Block 25mm",
    slug: "cover-block-25mm",
    category: "Cover Blocks",
    categorySlug: "cover-blocks",
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "Standard 25mm cover block — the most commonly specified size for slab and beam reinforcement protection per IS:456.",
    specs: {
      size: "25 mm",
      shape: "Cube / Cylindrical",
      material: "High-strength concrete (M25)",
      compressiveStrength: "≥ 25 N/mm²",
      quantity: "100 pcs / bag",
    },
    applications: [
      "RCC roof and floor slabs",
      "Beam reinforcement",
      "Column stirrups",
      "Foundation works",
    ],
  },
  {
    id: "cover-block-40mm",
    name: "Concrete Cover Block 40mm",
    slug: "cover-block-40mm",
    category: "Cover Blocks",
    categorySlug: "cover-blocks",
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "40mm cover block for columns, beams, and foundations where moderate concrete cover is specified per IS:456.",
    specs: {
      size: "40 mm",
      shape: "Cube / Cylindrical",
      material: "High-strength concrete (M25)",
      compressiveStrength: "≥ 25 N/mm²",
      quantity: "50 pcs / bag",
    },
    applications: ["RCC columns", "Beam bottom bars", "Raft foundations", "Retaining walls"],
  },
  {
    id: "cover-block-50mm",
    name: "Concrete Cover Block 50mm",
    slug: "cover-block-50mm",
    category: "Cover Blocks",
    categorySlug: "cover-blocks",
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    description: "50mm cover block for footings, pile caps, and structures in aggressive soil or marine environments as per IS:456.",
    specs: {
      size: "50 mm",
      shape: "Cube / Cylindrical",
      material: "High-strength concrete (M30)",
      compressiveStrength: "≥ 30 N/mm²",
      quantity: "50 pcs / bag",
    },
    applications: [
      "Isolated footings",
      "Pile caps",
      "Basement walls",
      "Structures in aggressive environments",
    ],
  },
  {
    id: "cover-block-75mm",
    name: "Concrete Cover Block 75mm",
    slug: "cover-block-75mm",
    category: "Cover Blocks",
    categorySlug: "cover-blocks",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "75mm cover block for marine structures, bridge piers, and infrastructure exposed to severe corrosion risk.",
    specs: {
      size: "75 mm",
      shape: "Cube / Cylindrical",
      material: "High-strength concrete (M35)",
      compressiveStrength: "≥ 35 N/mm²",
      quantity: "25 pcs / bag",
    },
    applications: [
      "Bridge decks and piers",
      "Marine and coastal structures",
      "Sewage treatment plants",
      "Industrial foundations",
    ],
  },

  // ── Hume Pipes ────────────────────────────────────────
  {
    id: "hume-pipe-300-np2",
    name: "RCC Hume Pipe 300mm NP2",
    slug: "hume-pipe-300-np2",
    category: "Hume Pipes",
    categorySlug: "hume-pipes",
    image: "https://images.unsplash.com/photo-1666537072264-57045bdc6149",
    description: "300mm diameter NP2 class RCC hume pipe for residential drainage and small culverts.",
    specs: {
      internalDiameter: "300 mm",
      length: "2.5 m",
      wallThickness: "35 mm",
      loadClass: "NP2",
      material: "Reinforced Cement Concrete",
      standard: "IS:458:2003",
    },
    applications: ["Residential stormwater drainage", "Small culverts", "Agricultural irrigation channels"],
  },
  {
    id: "hume-pipe-450-np2",
    name: "RCC Hume Pipe 450mm NP2",
    slug: "hume-pipe-450-np2",
    category: "Hume Pipes",
    categorySlug: "hume-pipes",
    image: "https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
    description: "450mm NP2 RCC hume pipe for medium drainage networks and road culverts.",
    specs: {
      internalDiameter: "450 mm",
      length: "2.5 m",
      wallThickness: "50 mm",
      loadClass: "NP2",
      material: "Reinforced Cement Concrete",
      standard: "IS:458:2003",
    },
    applications: ["Colony drainage networks", "Road side drains", "Culvert construction"],
  },
  {
    id: "hume-pipe-600-np3",
    name: "RCC Hume Pipe 600mm NP3",
    slug: "hume-pipe-600-np3",
    category: "Hume Pipes",
    categorySlug: "hume-pipes",
    featured: true,
    image: "https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
    description: "600mm NP3 class RCC hume pipe for main trunk drainage lines, sewerage systems, and highway culverts.",
    specs: {
      internalDiameter: "600 mm",
      length: "2.5 m",
      wallThickness: "75 mm",
      loadClass: "NP3",
      material: "Reinforced Cement Concrete",
      standard: "IS:458:2003",
    },
    applications: [
      "Main trunk sewer lines",
      "Storm water trunk drains",
      "Highway culverts",
      "Underground drainage corridors",
    ],
  },
  {
    id: "hume-pipe-900-np3",
    name: "RCC Hume Pipe 900mm NP3",
    slug: "hume-pipe-900-np3",
    category: "Hume Pipes",
    categorySlug: "hume-pipes",
    image: "https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
    description: "Large-diameter 900mm NP3 hume pipe for major drainage trunk lines, flood channels, and large culverts.",
    specs: {
      internalDiameter: "900 mm",
      length: "2.5 m",
      wallThickness: "100 mm",
      loadClass: "NP3",
      material: "Reinforced Cement Concrete",
      standard: "IS:458:2003",
    },
    applications: [
      "City-level trunk sewers",
      "Flood relief channels",
      "Large highway culverts",
      "Irrigation and canal lining",
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