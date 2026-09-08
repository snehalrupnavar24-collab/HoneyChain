from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import HarvestLot, Hive, User
from ..schemas import HarvestCreate, HarvestResponse
from ..blockchain import log_supply_chain_event
from ..dependencies import get_optional_current_user

router = APIRouter(
    prefix="/harvests",
    tags=["Harvest"]
)


@router.post("", response_model=HarvestResponse, status_code=status.HTTP_201_CREATED)
def create_harvest(
    harvest_in: HarvestCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    hive = db.query(Hive).filter(Hive.id == harvest_in.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hive with id {harvest_in.hive_id} not found"
        )

    existing_lot = db.query(HarvestLot).filter(HarvestLot.lot_code == harvest_in.lot_code).first()
    if existing_lot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Harvest lot code '{harvest_in.lot_code}' already exists"
        )

    harvest = HarvestLot(
        hive_id=harvest_in.hive_id,
        lot_code=harvest_in.lot_code,
        harvest_date=harvest_in.harvest_date,
        declared_quantity=harvest_in.declared_quantity,
        unit=harvest_in.unit or "kg",
        notes=harvest_in.notes
    )
    db.add(harvest)
    db.commit()
    db.refresh(harvest)

    # Cryptographic supply chain event logging
    log_supply_chain_event(
        db=db,
        event_type="HARVEST_CREATED",
        entity_type="HarvestLot",
        entity_id=harvest.id,
        description=(
            f"Beekeeper declared harvest of {harvest.declared_quantity:.2f} {harvest.unit} "
            f"from Hive {hive.hive_code} under Lot {harvest.lot_code}."
        ),
        payload={
            "lot_code": harvest.lot_code,
            "hive_code": hive.hive_code,
            "declared_quantity": harvest.declared_quantity,
            "unit": harvest.unit,
            "harvest_date": harvest.harvest_date.isoformat()
        },
        user_id=current_user.id if current_user else None
    )

    return harvest


@router.get("", response_model=List[HarvestResponse])
def list_harvests(
    hive_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(HarvestLot)
    if hive_id:
        query = query.filter(HarvestLot.hive_id == hive_id)
    return query.order_by(HarvestLot.id.desc()).offset(skip).limit(limit).all()


@router.get("/{harvest_id}", response_model=HarvestResponse)
def get_harvest(
    harvest_id: int,
    db: Session = Depends(get_db)
):
    harvest = db.query(HarvestLot).filter(HarvestLot.id == harvest_id).first()
    if not harvest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Harvest lot with id {harvest_id} not found"
        )
    return harvest