# The Himalaya - Infrastructure Products Website

A world-class, technically authoritative website for The Himalaya, an Ahmedabad-based manufacturer of FRP/GRP manhole covers, RCC covers, cover blocks, hume pipes, and infrastructure products since 2004.

## 🏗️ Project Overview

This is a complete redesign featuring:
- **Dark industrial aesthetic** with deep charcoal, midnight navy, crimson accent, and warm gold
- **3D interactive product viewers** using Three.js/@react-three/fiber
- **Motion-based animations** with purposeful, weight-based transitions
- **9 fully functional pages** with unique layouts
- **Comprehensive component library** for easy customization
- **Mobile-responsive design** optimized for all devices

## 🎨 Design Philosophy

> **"Built to Last. Built for India."**

The design reflects the strength, durability, and precision of The Himalaya's infrastructure products. Every animation feels HEAVY like the products themselves - covers don't flutter, they LAND.

## 📦 Tech Stack

- **Framework**: React with TypeScript
- **Routing**: React Router (Data Mode)
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Animation**: Motion (formerly Framer Motion)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives

## 🌐 Site Structure

### Pages (9 Total)

1. **Home (`/`)** - Hero with 3D viewer, stats counters, product categories, project showcase
2. **About (`/about`)** - Company timeline, manufacturing process, comparison table
3. **Products Overview (`/products`)** - All products with category filtering
4. **Product Category (`/products/[category]`)** - Category-specific product listings
5. **Product Detail (`/product/[slug]`)** - 3D viewer, full specs, applications, installation
6. **Bulk Order (`/bulk-order`)** - Multi-step wizard form for large orders
7. **Blog (`/blog`)** - Magazine-style layout with category filtering
8. **Careers (`/career`)** - Job openings with accordion UI + application form
9. **Contact (`/contact`)** - Contact form + Google Maps integration

### Global Components

- **Header** - Transparent → solid on scroll, mega menu for products
- **Footer** - Complete sitemap with social links
- **WhatsApp Button** - Floating button with pulse animation
- **Request Quote Modal** - Accessible floating CTA with form
- **Cookie Consent** - GDPR-compliant banner

### Shared Components

- `ThreeDViewer` - Interactive 3D product viewer with WebGL fallback
- `StatCounter` - Animated counter with scroll trigger
- `ProductCard` - Product display with hover effects
- `CategoryCard` - Category overview with 3D tilt
- `ClientLogoMarquee` - Infinite scrolling client logos
- `CertBadge` - Certification display with glow effects
- `ProcessStep` - Manufacturing step visualization

## 🎨 Brand Colors

```css
--himalaya-black:   #0d0d0d;   /* Background */
--himalaya-navy:    #0d1b2a;   /* Section background variant */
--himalaya-red:     #e84545;   /* Primary accent, CTAs */
--himalaya-gold:    #f0a500;   /* Trust badges, certifications */
--himalaya-ice:     #a8dadc;   /* Secondary accent, links */
--himalaya-white:   #f5f5f0;   /* Body text */
--himalaya-smoke:   #9a9a9a;   /* Secondary text */
--himalaya-card:    #141424;   /* Card backgrounds */
```

## 🔤 Typography

- **Display Headlines**: Bebas Neue / Oswald (authoritative, engineering feel)
- **Body Text**: DM Sans (readable, modern)

## 📊 Mock Data Structure

Located in `/src/app/data/mockData.ts`:

- **Products** - FRP/GRP covers, RCC covers, cover blocks, hume pipes
- **Categories** - 4 main product categories with advantages
- **Certifications** - IS:12592, BIS, ISO 9001:2015
- **Clients** - Major infrastructure companies
- **Projects** - Mumbai Metro, Surat Smart City, Ahmedabad Ring Road
- **Blog Posts** - Technical guides, industry news, project spotlights
- **Job Openings** - Current career opportunities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Package manager (npm/pnpm/yarn)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The project uses Vite for fast development and hot module replacement. All pages are fully functional with mock data.

## 📁 Project Structure

```
/src
  /app
    /components
      /figma          # System components (ImageWithFallback)
      /global         # Global components (Header, Footer, etc.)
      /layout         # Layout components
      /shared         # Reusable shared components
      /ui             # Radix UI primitives
    /data             # Mock data (mockData.ts)
    /pages            # All 9 pages
    App.tsx           # Main app component
    Root.tsx          # Root layout wrapper
    routes.ts         # React Router configuration
  /styles
    fonts.css         # Google Fonts imports
    index.css         # Global styles
    tailwind.css      # Tailwind base
    theme.css         # Brand colors & tokens
```

## 🎯 Key Features

### 3D Product Viewer
- Interactive Three.js manhole cover model
- Mouse drag to rotate 360°
- Scroll to zoom
- Graceful fallback to static image if WebGL unavailable
- Keyboard navigation support

### Animations
- Scroll-triggered stat counters
- Page transitions with Motion
- Parallax hero sections
- Staggered list animations
- Purposeful, weight-based motion philosophy

### Forms
- Multi-step bulk order wizard with progress tracking
- Comprehensive validation using Zod schemas
- Error handling and success states
- File upload placeholder for careers

### Accessibility
- ARIA labels on all interactive elements
- Keyboard-navigable product viewer
- Respects `prefers-reduced-motion`
- Semantic HTML structure

### Performance
- Lazy-loaded 3D canvases with IntersectionObserver
- Optimized images with loading states
- Code splitting by route
- Motion animations with GPU acceleration

## 🎨 Customization Guide

### Adding New Products

1. Edit `/src/app/data/mockData.ts`
2. Add product to `products` array
3. Include all required fields (name, slug, category, specs, etc.)

### Modifying Colors

1. Edit `/src/styles/theme.css`
2. Update CSS variables in `:root`
3. Colors automatically propagate throughout the app

### Adding New Pages

1. Create page component in `/src/app/pages/`
2. Add route in `/src/app/routes.ts`
3. Update navigation in Header component

## 📱 Responsive Design

- **Mobile**: Hamburger menu, vertical stacking, touch-optimized
- **Tablet**: Adjusted grid layouts, optimized spacing
- **Desktop**: Full navigation, multi-column layouts, hover effects

## 🔐 SEO Considerations

- Semantic HTML structure
- Meta tags ready for customization
- Clean URL structure
- Breadcrumb navigation
- Image alt texts
- Structured data ready (Product, Organization schemas)

## 🌟 Production Deployment

For deployment to Vercel or similar platforms:

1. Ensure all environment variables are set
2. Run `npm run build`
3. Deploy the `dist` folder
4. Configure redirects for client-side routing

## 📞 Support & Contact

For questions or customization requests:
- Email: info@thehimalaya.co.in
- Phone: +91 98765 43210
- WhatsApp: Available via floating button

## 📄 License

This project is proprietary and confidential. © 2026 The Himalaya Infrastructure Products.

---

**Built with ❤️ for The Himalaya | Est. 2004 | Built to Last. Built for India.**
