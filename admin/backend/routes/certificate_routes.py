import re
from datetime import datetime
from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import Certificate

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/certificates", response_class=HTMLResponse)
async def list_certificates(request: Request, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    certificates = db.query(Certificate).order_by(Certificate.created_at.desc()).all()
    return templates.TemplateResponse("certificates/list.html", {
        "request": request,
        "admin": admin,
        "certificates": certificates,
        "page_title": "Certificates",
    })


@router.get("/certificates/create", response_class=HTMLResponse)
async def create_certificate_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    return templates.TemplateResponse("certificates/form.html", {
        "request": request,
        "admin": admin,
        "certificate": None,
        "editing": False,
        "page_title": "Add Certificate",
    })


@router.post("/certificates/create")
async def create_certificate(
    request: Request,
    name: str = Form(...),
    issuer: str = Form(""),
    issue_date: str = Form(...),
    expiry_date: str = Form(""),
    certificate_number: str = Form(""),
    description: str = Form(""),
    image: str = Form(""),
    is_active: bool = Form(True),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    # Parse dates
    try:
        issue_dt = datetime.fromisoformat(issue_date)
        expiry_dt = datetime.fromisoformat(expiry_date) if expiry_date else None
    except ValueError:
        # Handle invalid date format
        return RedirectResponse(url="/admin/certificates/create", status_code=303)

    certificate = Certificate(
        name=name,
        issuer=issuer,
        issue_date=issue_dt,
        expiry_date=expiry_dt,
        certificate_number=certificate_number,
        description=description,
        image=image,
        is_active=is_active,
    )
    db.add(certificate)
    db.commit()
    return RedirectResponse(url="/admin/certificates", status_code=303)


@router.get("/certificates/{cert_id}/edit", response_class=HTMLResponse)
async def edit_certificate_form(cert_id: int, request: Request, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    certificate = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not certificate:
        return RedirectResponse(url="/admin/certificates", status_code=303)

    return templates.TemplateResponse("certificates/form.html", {
        "request": request,
        "admin": admin,
        "certificate": certificate,
        "editing": True,
        "page_title": f"Edit: {certificate.name}",
    })


@router.post("/certificates/{cert_id}/edit")
async def update_certificate(
    cert_id: int,
    name: str = Form(...),
    issuer: str = Form(""),
    issue_date: str = Form(...),
    expiry_date: str = Form(""),
    certificate_number: str = Form(""),
    description: str = Form(""),
    image: str = Form(""),
    is_active: bool = Form(True),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    certificate = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not certificate:
        return RedirectResponse(url="/admin/certificates", status_code=303)

    # Parse dates
    try:
        issue_dt = datetime.fromisoformat(issue_date)
        expiry_dt = datetime.fromisoformat(expiry_date) if expiry_date else None
    except ValueError:
        # Handle invalid date format
        return RedirectResponse(url=f"/admin/certificates/{cert_id}/edit", status_code=303)

    certificate.name = name
    certificate.issuer = issuer
    certificate.issue_date = issue_dt
    certificate.expiry_date = expiry_dt
    certificate.certificate_number = certificate_number
    certificate.description = description
    certificate.image = image
    certificate.is_active = is_active
    db.commit()
    return RedirectResponse(url="/admin/certificates", status_code=303)


@router.post("/certificates/{cert_id}/delete")
async def delete_certificate(cert_id: int, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    certificate = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if certificate:
        db.delete(certificate)
        db.commit()
    return RedirectResponse(url="/admin/certificates", status_code=303)