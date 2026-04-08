"""Seed the database with initial data from the website's mockData."""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import (
    Base, Category, Product, BlogPost, JobOpening,
    ProjectShowcase, Testimonial, SiteSetting,
)


def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # --- Categories ---
    if not db.query(Category).first():
        cats = [
            Category(
                name="FRP/GRP Products", slug="frp-grp-products",
                description="Glass Fiber Reinforced Plastic manhole covers and access covers — IS:12592:2012 certified, load classes A15 to D400",
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                advantages=[
                    "Corrosion-free composite — zero maintenance",
                    "70% lighter than cast iron",
                    "IS:12592:2012 load-tested & BIS certified",
                    "Anti-theft by design (zero scrap value)",
                ],
                product_count=7,
            ),
            Category(
                name="RCC Covers", slug="rcc-covers",
                description="Reinforced Cement Concrete manhole covers for roads, highways, and municipal drainage",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                advantages=[
                    "High compressive strength (M35–M40 grade)",
                    "Cost-effective for large-scale projects",
                    "Weather and UV resistant",
                    "IS:12592:2012 certified",
                ],
                product_count=3,
            ),
            Category(
                name="Cover Blocks", slug="cover-blocks",
                description="Precast concrete cover blocks for reinforcement protection — 20mm to 75mm sizes per IS:456",
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                advantages=[
                    "Uniform cover spacing maintained",
                    "Prevents steel corrosion and carbonation",
                    "5 standard sizes: 20mm to 75mm",
                    "High compressive strength ≥ 25 N/mm²",
                ],
                product_count=5,
            ),
            Category(
                name="Hume Pipes", slug="hume-pipes",
                description="IS:458 certified RCC Hume pipes for drainage, sewerage, and culvert construction",
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                advantages=[
                    "High load-bearing capacity (NP2–NP3 class)",
                    "Smooth interior for optimal flow",
                    "Leak-proof spigot-and-socket joints",
                    "Long service life (50+ years)",
                ],
                product_count=4,
            ),
        ]
        db.add_all(cats)
        db.commit()
        print("Categories seeded")

    # --- Products ---
    if not db.query(Product).first():
        frp    = db.query(Category).filter(Category.slug == "frp-grp-products").first()
        rcc    = db.query(Category).filter(Category.slug == "rcc-covers").first()
        blocks = db.query(Category).filter(Category.slug == "cover-blocks").first()
        pipes  = db.query(Category).filter(Category.slug == "hume-pipes").first()

        if not all([frp, rcc, blocks, pipes]):
            print("Skipping product seed — required categories not found. Run seed again after categories are created.")
            db.close()
            return

        _install_steps = [
            "Ensure the frame is level and properly bedded in mortar",
            "Clean all contact surfaces before seating the cover",
            "Apply sealant around the frame perimeter",
            "Secure the cover with the provided anti-theft locking mechanism",
            "Test load-bearing capacity and flush alignment after installation",
        ]

        prods = [
            # ── FRP/GRP Products ──────────────────────────────────
            Product(
                name="Round FRP Cover D400", slug="frp-round-d400",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="D400", standard="IS:12592:2012", featured=True,
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="Heavy-duty FRP/GRP round manhole cover rated for 40-ton loads. Ideal for national highways, expressways, and high-traffic urban roads. Corrosion-free and anti-theft by design.",
                specs={
                    "shape": "Round",
                    "diameter": "600 mm",
                    "thickness": "50 mm",
                    "weight": "18 kg",
                    "loadCapacity": "400 kN (40 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Anti-skid diamond pattern",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "National highways and expressways",
                    "Urban arterial roads",
                    "Municipal drainage systems",
                    "Industrial estates and cargo terminals",
                    "Smart city infrastructure",
                ],
                installation=_install_steps,
            ),
            Product(
                name="Square FRP Cover D400", slug="frp-square-d400",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="D400", standard="IS:12592:2012", featured=True,
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Square-profile heavy-duty FRP cover for modern infrastructure projects requiring high load ratings and a flush, aesthetic finish.",
                specs={
                    "shape": "Square",
                    "dimensions": "600 × 600 mm",
                    "thickness": "50 mm",
                    "weight": "20 kg",
                    "loadCapacity": "400 kN (40 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Anti-skid ribbed pattern",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Metro railway stations",
                    "Smart city and AMRUT projects",
                    "Commercial complexes and malls",
                    "Industrial parks",
                    "Airport aprons and taxiways",
                ],
                installation=_install_steps,
            ),
            Product(
                name="Round FRP Cover C250", slug="frp-round-c250",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="C250", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="Medium-duty FRP manhole cover rated 25 tons, designed for slow-moving vehicles, residential roads, and light-commercial applications.",
                specs={
                    "shape": "Round",
                    "diameter": "600 mm",
                    "thickness": "40 mm",
                    "weight": "15 kg",
                    "loadCapacity": "250 kN (25 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Anti-skid textured",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Residential layouts and colonies",
                    "Housing board projects",
                    "Light commercial zones",
                    "Slow-moving vehicle areas",
                    "Municipality water supply networks",
                ],
                installation=_install_steps,
            ),
            Product(
                name="Square FRP Cover C250", slug="frp-square-c250",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="C250", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                description="Square medium-duty FRP cover for residential streets and utility access points requiring 25-ton load rating.",
                specs={
                    "shape": "Square",
                    "dimensions": "600 × 600 mm",
                    "thickness": "40 mm",
                    "weight": "17 kg",
                    "loadCapacity": "250 kN (25 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Anti-skid ribbed pattern",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Residential roads",
                    "Colony drainage networks",
                    "Campus utility access",
                    "Low-traffic commercial areas",
                ],
                installation=_install_steps,
            ),
            Product(
                name="Round FRP Cover B125", slug="frp-round-b125",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="B125", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="Light-duty FRP cover rated 12.5 tons for footways, car parks, and pedestrian zones. Extremely lightweight at under 10 kg.",
                specs={
                    "shape": "Round",
                    "diameter": "600 mm",
                    "thickness": "30 mm",
                    "weight": "9 kg",
                    "loadCapacity": "125 kN (12.5 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Anti-skid textured",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Footpaths and pedestrian zones",
                    "Multi-level car parks",
                    "Gardens and parks",
                    "Airports (non-operational areas)",
                    "Utility inspection covers",
                ],
                installation=_install_steps,
            ),
            Product(
                name="Round FRP Cover A15", slug="frp-round-a15",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="A15", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="Pedestrian-rated FRP cover for foot-traffic-only areas. Lightest option in the range, ideal for parks, plazas, and indoor utility access.",
                specs={
                    "shape": "Round",
                    "diameter": "450 mm",
                    "thickness": "25 mm",
                    "weight": "5 kg",
                    "loadCapacity": "15 kN (1.5 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Smooth anti-skid",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Pedestrian plazas and footpaths",
                    "Public parks",
                    "Indoor utility access",
                    "Landscaped areas",
                ],
                installation=_install_steps,
            ),
            Product(
                name="Rectangular FRP Cover D400", slug="frp-rect-d400",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="D400", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Rectangular heavy-duty FRP cover for elongated access chambers and cable duct openings in highway and metro applications.",
                specs={
                    "shape": "Rectangular",
                    "dimensions": "600 × 450 mm",
                    "thickness": "50 mm",
                    "weight": "16 kg",
                    "loadCapacity": "400 kN (40 tons)",
                    "material": "Glass Fiber Reinforced Plastic",
                    "finish": "Anti-skid diamond pattern",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Cable duct access points",
                    "Telecom and utility chambers",
                    "Metro rail cable corridors",
                    "Industrial plant access",
                ],
                installation=_install_steps,
            ),

            # ── RCC Covers ────────────────────────────────────────
            Product(
                name="Round RCC Cover D400", slug="rcc-round-d400",
                category_id=rcc.id, category_name=rcc.name, category_slug=rcc.slug,
                load_class="D400", standard="IS:12592:2012", featured=True,
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                description="Heavy-duty reinforced concrete round manhole cover for high-traffic roads and industrial areas. Proven durability with steel reinforcement.",
                specs={
                    "shape": "Round",
                    "diameter": "600 mm",
                    "thickness": "80 mm",
                    "weight": "60 kg",
                    "loadCapacity": "400 kN (40 tons)",
                    "material": "Reinforced Cement Concrete (M40)",
                    "finish": "Smooth concrete finish",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Highways and expressways",
                    "Heavy industrial areas",
                    "Cargo terminals and freight zones",
                    "Municipal road networks",
                ],
                installation=[
                    "Prepare the frame bed with M20 mortar",
                    "Seat the frame level and allow to cure for 24 hours",
                    "Lower the RCC cover carefully using lifting hooks",
                    "Check flush alignment with surrounding road surface",
                    "Allow full cure before opening to traffic",
                ],
            ),
            Product(
                name="Square RCC Cover D400", slug="rcc-square-d400",
                category_id=rcc.id, category_name=rcc.name, category_slug=rcc.slug,
                load_class="D400", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="Square heavy-duty RCC manhole cover, economical choice for road projects with high load requirements.",
                specs={
                    "shape": "Square",
                    "dimensions": "600 × 600 mm",
                    "thickness": "80 mm",
                    "weight": "70 kg",
                    "loadCapacity": "400 kN (40 tons)",
                    "material": "Reinforced Cement Concrete (M40)",
                    "finish": "Smooth with anti-slip groove",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Urban road infrastructure",
                    "State highway projects",
                    "Drainage chamber access",
                    "Stormwater network",
                ],
                installation=[
                    "Prepare the frame bed with M20 mortar",
                    "Seat the frame level and allow to cure for 24 hours",
                    "Lower the RCC cover carefully using lifting hooks",
                    "Check flush alignment with surrounding road surface",
                    "Allow full cure before opening to traffic",
                ],
            ),
            Product(
                name="Round RCC Cover C250", slug="rcc-round-c250",
                category_id=rcc.id, category_name=rcc.name, category_slug=rcc.slug,
                load_class="C250", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Medium-duty RCC round manhole cover for residential roads, colony streets, and municipal drainage networks.",
                specs={
                    "shape": "Round",
                    "diameter": "600 mm",
                    "thickness": "65 mm",
                    "weight": "48 kg",
                    "loadCapacity": "250 kN (25 tons)",
                    "material": "Reinforced Cement Concrete (M35)",
                    "finish": "Smooth concrete finish",
                    "standard": "IS:12592:2012",
                },
                applications=[
                    "Residential colony roads",
                    "Municipal water supply manholes",
                    "Light commercial streets",
                    "Housing board projects",
                ],
                installation=[
                    "Prepare the frame bed with M20 mortar",
                    "Seat the frame level and allow to cure for 24 hours",
                    "Lower the RCC cover carefully using lifting hooks",
                    "Check flush alignment with surrounding road surface",
                    "Allow full cure before opening to traffic",
                ],
            ),

            # ── Cover Blocks ──────────────────────────────────────
            Product(
                name="Concrete Cover Block 20mm", slug="cover-block-20mm",
                category_id=blocks.id, category_name=blocks.name, category_slug=blocks.slug,
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="20mm precast concrete cover block for thin slabs and wall reinforcement where minimum cover is required.",
                specs={
                    "size": "20 mm",
                    "shape": "Cube / Cylindrical",
                    "material": "High-strength concrete (M25)",
                    "compressiveStrength": "≥ 25 N/mm²",
                    "quantity": "100 pcs / bag",
                },
                applications=["Thin RCC slabs", "Wall reinforcement cover", "Precast panels"],
            ),
            Product(
                name="Concrete Cover Block 25mm", slug="cover-block-25mm",
                category_id=blocks.id, category_name=blocks.name, category_slug=blocks.slug,
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Standard 25mm cover block — the most commonly specified size for slab and beam reinforcement protection per IS:456.",
                specs={
                    "size": "25 mm",
                    "shape": "Cube / Cylindrical",
                    "material": "High-strength concrete (M25)",
                    "compressiveStrength": "≥ 25 N/mm²",
                    "quantity": "100 pcs / bag",
                },
                applications=[
                    "RCC roof and floor slabs",
                    "Beam reinforcement",
                    "Column stirrups",
                    "Foundation works",
                ],
            ),
            Product(
                name="Concrete Cover Block 40mm", slug="cover-block-40mm",
                category_id=blocks.id, category_name=blocks.name, category_slug=blocks.slug,
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="40mm cover block for columns, beams, and foundations where moderate concrete cover is specified per IS:456.",
                specs={
                    "size": "40 mm",
                    "shape": "Cube / Cylindrical",
                    "material": "High-strength concrete (M25)",
                    "compressiveStrength": "≥ 25 N/mm²",
                    "quantity": "50 pcs / bag",
                },
                applications=["RCC columns", "Beam bottom bars", "Raft foundations", "Retaining walls"],
            ),
            Product(
                name="Concrete Cover Block 50mm", slug="cover-block-50mm",
                category_id=blocks.id, category_name=blocks.name, category_slug=blocks.slug,
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                description="50mm cover block for footings, pile caps, and structures in aggressive soil or marine environments as per IS:456.",
                specs={
                    "size": "50 mm",
                    "shape": "Cube / Cylindrical",
                    "material": "High-strength concrete (M30)",
                    "compressiveStrength": "≥ 30 N/mm²",
                    "quantity": "50 pcs / bag",
                },
                applications=[
                    "Isolated footings",
                    "Pile caps",
                    "Basement walls",
                    "Structures in aggressive environments",
                ],
            ),
            Product(
                name="Concrete Cover Block 75mm", slug="cover-block-75mm",
                category_id=blocks.id, category_name=blocks.name, category_slug=blocks.slug,
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="75mm cover block for marine structures, bridge piers, and infrastructure exposed to severe corrosion risk.",
                specs={
                    "size": "75 mm",
                    "shape": "Cube / Cylindrical",
                    "material": "High-strength concrete (M35)",
                    "compressiveStrength": "≥ 35 N/mm²",
                    "quantity": "25 pcs / bag",
                },
                applications=[
                    "Bridge decks and piers",
                    "Marine and coastal structures",
                    "Sewage treatment plants",
                    "Industrial foundations",
                ],
            ),

            # ── Hume Pipes ────────────────────────────────────────
            Product(
                name="RCC Hume Pipe 300mm NP2", slug="hume-pipe-300-np2",
                category_id=pipes.id, category_name=pipes.name, category_slug=pipes.slug,
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                description="300mm diameter NP2 class RCC hume pipe for residential drainage and small culverts.",
                specs={
                    "internalDiameter": "300 mm",
                    "length": "2.5 m",
                    "wallThickness": "35 mm",
                    "loadClass": "NP2",
                    "material": "Reinforced Cement Concrete",
                    "standard": "IS:458:2003",
                },
                applications=["Residential stormwater drainage", "Small culverts", "Agricultural irrigation channels"],
            ),
            Product(
                name="RCC Hume Pipe 450mm NP2", slug="hume-pipe-450-np2",
                category_id=pipes.id, category_name=pipes.name, category_slug=pipes.slug,
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="450mm NP2 RCC hume pipe for medium drainage networks and road culverts.",
                specs={
                    "internalDiameter": "450 mm",
                    "length": "2.5 m",
                    "wallThickness": "50 mm",
                    "loadClass": "NP2",
                    "material": "Reinforced Cement Concrete",
                    "standard": "IS:458:2003",
                },
                applications=["Colony drainage networks", "Road side drains", "Culvert construction"],
            ),
            Product(
                name="RCC Hume Pipe 600mm NP3", slug="hume-pipe-600-np3",
                category_id=pipes.id, category_name=pipes.name, category_slug=pipes.slug,
                featured=True,
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="600mm NP3 class RCC hume pipe for main trunk drainage lines, sewerage systems, and highway culverts.",
                specs={
                    "internalDiameter": "600 mm",
                    "length": "2.5 m",
                    "wallThickness": "75 mm",
                    "loadClass": "NP3",
                    "material": "Reinforced Cement Concrete",
                    "standard": "IS:458:2003",
                },
                applications=[
                    "Main trunk sewer lines",
                    "Storm water trunk drains",
                    "Highway culverts",
                    "Underground drainage corridors",
                ],
            ),
            Product(
                name="RCC Hume Pipe 900mm NP3", slug="hume-pipe-900-np3",
                category_id=pipes.id, category_name=pipes.name, category_slug=pipes.slug,
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="Large-diameter 900mm NP3 hume pipe for major drainage trunk lines, flood channels, and large culverts.",
                specs={
                    "internalDiameter": "900 mm",
                    "length": "2.5 m",
                    "wallThickness": "100 mm",
                    "loadClass": "NP3",
                    "material": "Reinforced Cement Concrete",
                    "standard": "IS:458:2003",
                },
                applications=[
                    "City-level trunk sewers",
                    "Flood relief channels",
                    "Large highway culverts",
                    "Irrigation and canal lining",
                ],
            ),
        ]
        db.add_all(prods)
        db.commit()
        print("Products seeded")

    # --- Blog Posts ---
    if not db.query(BlogPost).first():
        posts = [
            BlogPost(
                title="FRP vs Cast Iron Manhole Covers: A Technical Comparison",
                slug="frp-vs-cast-iron-technical-comparison",
                excerpt="Comprehensive analysis of load capacity, durability, and cost-effectiveness between FRP/GRP and traditional cast iron covers.",
                content="Full article content...",
                category="Technical Guides", author="Engineering Team",
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                featured=True, published=True,
            ),
            BlogPost(
                title="Smart City Infrastructure: The Role of Modern Manhole Solutions",
                slug="smart-city-infrastructure-manhole-solutions",
                excerpt="How modern FRP/GRP products are enabling smart city developments across India.",
                content="Full article content...",
                category="Industry News", author="Rajesh Kumar",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                published=True,
            ),
            BlogPost(
                title="Case Study: 5000+ FRP Covers Installed at Mumbai Metro",
                slug="mumbai-metro-project-case-study",
                excerpt="Behind the scenes of our largest infrastructure project to date.",
                content="Full article content...",
                category="Project Spotlights", author="Project Team",
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                featured=True, published=True,
            ),
        ]
        db.add_all(posts)
        db.commit()
        print("Blog posts seeded")

    # --- Job Openings ---
    if not db.query(JobOpening).first():
        jobs = [
            JobOpening(
                title="Regional Sales Manager", department="Sales & Marketing",
                location="Ahmedabad, Gujarat", job_type="Full-time", experience="5-8 years",
                description="Lead sales operations across Gujarat and surrounding regions.",
                requirements=["Bachelor's degree in Business or Engineering",
                               "5+ years in B2B sales", "Strong network in Gujarat infrastructure sector",
                               "Excellent communication and negotiation skills"],
            ),
            JobOpening(
                title="Production Engineer", department="Manufacturing",
                location="Ahmedabad, Gujarat", job_type="Full-time", experience="2-4 years",
                description="Oversee FRP/GRP production processes, quality control, and process optimization.",
                requirements=["B.E./B.Tech in Mechanical/Chemical Engineering",
                               "Experience in composites manufacturing preferred",
                               "Knowledge of quality management systems"],
            ),
        ]
        db.add_all(jobs)
        db.commit()
        print("Job openings seeded")

    # --- Projects ---
    if not db.query(ProjectShowcase).first():
        projects = [
            ProjectShowcase(
                name="Mumbai Metro Line 3", client="Mumbai Metro Rail Corporation",
                location="Mumbai, Maharashtra", year=2025,
                products_used=["FRP D400 Covers", "RCC Chambers"], quantity="5000+ units",
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="Supplied and installed FRP manhole covers across 33 metro stations.",
            ),
            ProjectShowcase(
                name="Surat Smart City Project", client="Surat Municipal Corporation",
                location="Surat, Gujarat", year=2024,
                products_used=["FRP Covers", "Hume Pipes"], quantity="3000+ units",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Infrastructure upgrade with corrosion-free FRP solutions.",
            ),
            ProjectShowcase(
                name="Ahmedabad Ring Road Expansion", client="Gujarat State Highway Authority",
                location="Ahmedabad, Gujarat", year=2024,
                products_used=["RCC Covers", "Cover Blocks"], quantity="2500+ units",
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="Heavy-duty RCC covers for high-traffic highway infrastructure.",
            ),
        ]
        db.add_all(projects)
        db.commit()
        print("Projects seeded")

    # --- Testimonials ---
    if not db.query(Testimonial).first():
        testimonials = [
            Testimonial(
                name="Rajesh Mehta", position="Project Manager", company="L&T Infrastructure",
                content="The Himalaya's FRP covers have been exceptional. 5000+ units installed across our projects with zero failures.",
                rating=5,
            ),
            Testimonial(
                name="Priya Sharma", position="Chief Engineer", company="Mumbai Metro",
                content="Lightweight, durable, and perfectly compliant with specifications. Outstanding quality control.",
                rating=5,
            ),
        ]
        db.add_all(testimonials)
        db.commit()
        print("Testimonials seeded")

    # --- Site Settings ---
    if not db.query(SiteSetting).first():
        defaults = [
            SiteSetting(key="company_name", value="The Himalaya", description="Company name"),
            SiteSetting(key="tagline", value="Built to Last. Built for India.", description="Main tagline"),
            SiteSetting(key="phone", value="+91-79-XXXX-XXXX", description="Contact phone"),
            SiteSetting(key="email", value="info@thehimalaya.com", description="Contact email"),
            SiteSetting(key="whatsapp", value="+919876543210", description="WhatsApp number"),
            SiteSetting(key="address", value="Ahmedabad, Gujarat, India", description="Office address"),
            SiteSetting(key="established_year", value="2004", description="Year established"),
        ]
        db.add_all(defaults)
        db.commit()
        print("Site settings seeded")

    db.close()
    print("Seed complete!")


if __name__ == "__main__":
    seed()
