from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import PackagingBatch, ProcessingLot, User
from ..schemas import PackagingCreate, PackagingResponse
from ..blockchain import log_supply_chain_event
from ..dependencies import get_optional_current_user

router = APIRouter(
    prefix="/packaging",
    tags=["Packaging"]
)


@router.post("", response_model=PackagingResponse, status_code=status.HTTP_201_CREATED)
def create_packaging(
    pkg_in: PackagingCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    proc = db.query(ProcessingLot).filter(ProcessingLot.id == pkg_in.processing_lot_id).first()
    if not proc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Processing lot with id {pkg_in.processing_lot_id} not found"
        )

    existing = db.query(PackagingBatch).filter(PackagingBatch.package_code == pkg_in.package_code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Package code '{pkg_in.package_code}' already exists"
        )

    # Generate QR identifier if not specified
    qr_identifier = pkg_in.qr_code or f"HC-QR-{pkg_in.package_code}"

    pkg = PackagingBatch(
        processing_lot_id=pkg_in.processing_lot_id,
        package_code=pkg_in.package_code,
        product_name=pkg_in.product_name,
        quantity=pkg_in.quantity,
        unit=pkg_in.unit or "kg",
        qr_code=qr_identifier,
        packaged_at=datetime.utcnow()
    )
    db.add(pkg)
    db.commit()
    db.refresh(pkg)

    # Log PACKAGE_CREATED event with SHA-256 hash
    log_supply_chain_event(
        db=db,
        event_type="PACKAGE_CREATED",
        entity_type="PackagingBatch",
        entity_id=pkg.id,
        description=(
            f"Packaging Batch {pkg.package_code} ('{pkg.product_name}') created from "
            f"Processing Lot {proc.processing_code}. Quantity: {pkg.quantity:.2f} {pkg.unit}, QR: {pkg.qr_code}."
        ),
        payload={
            "package_code": pkg.package_code,
            "product_name": pkg.product_name,
            "processing_code": proc.processing_code,
            "quantity": pkg.quantity,
            "unit": pkg.unit,
            "qr_code": pkg.qr_code
        },
        user_id=current_user.id if current_user else None
    )

    return pkg


@router.get("", response_model=List[PackagingResponse])
def list_packaging_batches(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(PackagingBatch).order_by(PackagingBatch.id.desc()).offset(skip).limit(limit).all()


@router.get("/{package_id}", response_model=PackagingResponse)
def get_packaging(
    package_id: int,
    db: Session = Depends(get_db)
):
    pkg = db.query(PackagingBatch).filter(PackagingBatch.id == package_id).first()
    if not pkg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Packaging batch with id {package_id} not found"
        )
    return pkg