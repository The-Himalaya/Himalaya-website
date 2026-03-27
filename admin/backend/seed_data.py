"""Seed the database with initial data from the website's mockData."""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import (
    Base, Admin, Category, Product, BlogPost, JobOpening,
    ProjectShowcase, Testimonial, SiteSetting,
)
from auth import get_password_hash
from config import settings


def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # --- Admin user ---
    if not db.query(Admin).first():
        db.add(Admin(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
        ))
        db.commit()
        print(f"Admin created: {settings.ADMIN_USERNAME} / {settings.ADMIN_PASSWORD}")

    # --- Categories ---
    if not db.query(Category).first():
        cats = [
            Category(
                name="FRP/GRP Products", slug="frp-grp-products",
                description="Glass Fiber Reinforced Plastic manhole covers and access covers",
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                advantages=["Corrosion-free composite material", "70% lighter than cast iron",
                             "Load class tested & certified", "Anti-theft (zero scrap value)"],
                product_count=15,
            ),
            Category(
                name="RCC Covers", slug="rcc-covers",
                description="Reinforced Cement Concrete manhole covers",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                advantages=["High compressive strength", "Durable concrete construction",
                             "Cost-effective solution", "Weather-resistant finish"],
                product_count=12,
            ),
            Category(
                name="Cover Blocks", slug="cover-blocks",
                description="Concrete cover blocks for reinforcement protection",
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                advantages=["Uniform spacing maintained", "Prevents steel corrosion",
                             "Various sizes available", "Easy to install"],
                product_count=8,
            ),
            Category(
                name="Hume Pipes", slug="hume-pipes",
                description="RCC Hume pipes for drainage and sewerage",
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                advantages=["High load-bearing capacity", "Leak-proof joints",
                             "Long service life", "IS certified quality"],
                product_count=10,
            ),
        ]
        db.add_all(cats)
        db.commit()
        print("Categories seeded")

    # --- Products ---
    if not db.query(Product).first():
        frp = db.query(Category).filter(Category.slug == "frp-grp-products").first()
        rcc = db.query(Category).filter(Category.slug == "rcc-covers").first()
        blocks = db.query(Category).filter(Category.slug == "cover-blocks").first()
        pipes = db.query(Category).filter(Category.slug == "hume-pipes").first()

        prods = [
            Product(
                name="Round Manhole Cover D400", slug="round-manhole-d400",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="D400", standard="IS:12592:2012", featured=True,
                image="https://images.unsplash.com/photo-1767618339628-cc19fb911bd3",
                description="Premium FRP/GRP round manhole cover designed for heavy-duty applications in highways and industrial areas.",
                specs={"diameter": "600mm", "thickness": "50mm", "weight": "18kg",
                       "loadCapacity": "40 tons", "material": "Glass Fiber Reinforced Plastic",
                       "finish": "Anti-skid textured surface"},
                applications=["Highway roads and streets", "Urban drainage systems",
                               "Municipal infrastructure", "Industrial facilities", "Parking areas"],
                installation=["Ensure frame is level and properly seated",
                               "Clean contact surfaces before installation",
                               "Apply sealant around frame perimeter",
                               "Secure cover with provided locking mechanism",
                               "Test load-bearing capacity post-installation"],
            ),
            Product(
                name="Square Manhole Cover D400", slug="square-manhole-d400",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="D400", standard="IS:12592:2012",
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Square profile FRP manhole cover for modern infrastructure projects.",
                specs={"dimensions": "600x600mm", "thickness": "50mm", "weight": "20kg",
                       "loadCapacity": "40 tons", "material": "Glass Fiber Reinforced Plastic",
                       "finish": "Diamond pattern anti-skid"},
                applications=["Smart city projects", "Metro railway systems",
                               "Commercial complexes", "Industrial parks"],
            ),
            Product(
                name="Round Manhole Cover C250", slug="round-manhole-c250",
                category_id=frp.id, category_name=frp.name, category_slug=frp.slug,
                load_class="C250", standard="IS:12592:2012", featured=True,
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="Medium-duty FRP manhole cover suitable for pedestrian and light traffic areas.",
                specs={"diameter": "600mm", "thickness": "40mm", "weight": "15kg",
                       "loadCapacity": "25 tons", "material": "Glass Fiber Reinforced Plastic",
                       "finish": "Anti-skid textured"},
                applications=["Pedestrian walkways", "Residential areas",
                               "Light traffic zones", "Parks and gardens"],
            ),
            Product(
                name="Heavy Duty RCC Cover", slug="rcc-heavy-duty",
                category_id=rcc.id, category_name=rcc.name, category_slug=rcc.slug,
                load_class="D400",
                image="https://images.unsplash.com/photo-1666537072264-57045bdc6149",
                description="Reinforced concrete manhole cover for maximum load capacity.",
                specs={"dimensions": "600x600mm", "thickness": "80mm", "weight": "65kg",
                       "loadCapacity": "40 tons", "material": "Reinforced Cement Concrete",
                       "finish": "Smooth concrete finish"},
                applications=["Highways and expressways", "Heavy industrial areas",
                               "Cargo terminals", "Freight zones"],
            ),
            Product(
                name="Concrete Cover Block 25mm", slug="cover-block-25mm",
                category_id=blocks.id, category_name=blocks.name, category_slug=blocks.slug,
                image="https://images.unsplash.com/photo-1716037999044-98a8e85dfa1a",
                description="Standard 25mm cover blocks for reinforcement spacing.",
                specs={"size": "25mm", "material": "High-strength concrete",
                       "quantity": "100 pcs/bag", "application": "Slab reinforcement"},
                applications=["Building construction", "Slab reinforcement",
                               "Beam works", "Foundation works"],
            ),
            Product(
                name="RCC Hume Pipe 600mm", slug="hume-pipe-600",
                category_id=pipes.id, category_name=pipes.name, category_slug=pipes.slug,
                image="https://images.unsplash.com/photo-1770827569418-4d54b07a5f9d",
                description="600mm diameter RCC hume pipe for drainage systems.",
                specs={"diameter": "600mm", "length": "2.5m", "thickness": "75mm",
                       "loadClass": "NP3", "material": "Reinforced Cement Concrete"},
                applications=["Storm water drainage", "Sewage systems",
                               "Culvert construction", "Underground drainage"],
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
