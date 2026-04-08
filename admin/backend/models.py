import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, default="")
    image = Column(String(500), default="")
    advantages = Column(JSON, default=list)
    product_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    products = relationship("Product", back_populates="category_rel", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category_name = Column(String(100), default="")
    category_slug = Column(String(100), default="")
    load_class = Column(String(50), default="")
    standard = Column(String(100), default="")
    image = Column(String(500), default="")   # primary image (= images[0])
    images = Column(JSON, default=list)
    model_3d = Column(String(500), default="")
    datasheet = Column(String(500), default="")
    description = Column(Text, default="")
    specs = Column(Text, default="")
    applications = Column(JSON, default=list)
    installation = Column(JSON, default=list)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    category_rel = relationship("Category", back_populates="products")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    slug = Column(String(300), unique=True, index=True, nullable=False)
    excerpt = Column(Text, default="")
    content = Column(Text, default="")
    category = Column(String(100), default="")
    author = Column(String(100), default="")
    image = Column(String(500), default="")   # kept for compat (= images[0])
    images = Column(JSON, default=list)
    videos = Column(JSON, default=list)
    featured = Column(Boolean, default=False)
    published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class JobOpening(Base):
    __tablename__ = "job_openings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    department = Column(String(100), default="")
    location = Column(String(200), default="")
    job_type = Column(String(50), default="Full-time")
    experience = Column(String(50), default="")
    description = Column(Text, default="")
    requirements = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ProjectShowcase(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    client = Column(String(200), default="")
    location = Column(String(200), default="")
    year = Column(Integer, default=2026)
    products_used = Column(JSON, default=list)
    quantity = Column(String(100), default="")
    image = Column(String(500), default="")   # kept for compat (= images[0])
    images = Column(JSON, default=list)
    videos = Column(JSON, default=list)
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    position = Column(String(100), default="")
    company = Column(String(100), default="")
    content = Column(Text, default="")
    rating = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), default="")
    phone = Column(String(20), default="")
    company = Column(String(200), default="")
    message = Column(Text, default="")
    status = Column(String(20), default="new")  # new, read, responded
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class BulkOrderInquiry(Base):
    __tablename__ = "bulk_orders"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(200), default="")
    quantity = Column(String(50), default="")
    name = Column(String(100), nullable=False)
    email = Column(String(100), default="")
    phone = Column(String(20), default="")
    company = Column(String(200), default="")
    state = Column(String(100), default="")
    city = Column(String(100), default="")
    pincode = Column(String(10), default="")
    notes = Column(Text, default="")
    status = Column(String(20), default="new")  # new, contacted, quoted, closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text, default="")
    description = Column(String(200), default="")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    issuer = Column(String(200), default="")
    issue_date = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    certificate_number = Column(String(100), default="")
    description = Column(Text, default="")
    image = Column(String(500), default="")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
