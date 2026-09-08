from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import CollectionLot, HarvestLot, Discrepancy, User
from ..schemas import CollectionCreate, CollectionResponse, DiscrepancyInfo
from ..reconciliation import reconcile_collection_quantity
from ..blockchain import log_supply_chain_event
from ..dependencies import get_optional_current_user

router = APIRouter(
    prefix="/collections",
    tags=["Collection"]
)


@router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
def create_collection(
    collection_in: CollectionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    harvest = db.query(HarvestLot).filter(HarvestLot.id == collection_in.harvest_lot_id).first()
    if not harvest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Harvest lot with id {collection_in.harvest_lot_id} not found"
        )

    existing_coll = db.query(CollectionLot).filter(CollectionLot.collection_code == collection_in.collection_code).first()
    if existing_coll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Collection code '{collection_in.collection_code}' already exists"
        )

    # 1. Preserve BOTH declared and measured quantities
    declared_qty = harvest.declared_quantity
    measured_qty = collection_in.measured_quantity

    # 2. Reconcile differences
    reconciliation = reconcile_collection_quantity(
        declared_qty=declared_qty,
        measured_qty=measured_qty
    )

    # 3. Create Collection Lot (preserves declared quantity in harvest_lot, stores measured in collection_lot)
    collection = CollectionLot(
        harvest_lot_id=collection_in.harvest_lot_id,
        collection_code=collection_in.collection_code,
        measured_quantity=measured_qty,
        unit=collection_in.unit or "kg",
        collection_center=collection_in.collection_center
    )
    db.add(collection)
    db.commit()
    db.refresh(collection)

    # 4. Handle Discrepancy if threshold exceeded
    discrepancy_obj = None
    if reconciliation["is_discrepant"]:
        discrepancy = Discrepancy(
            entity_type="CollectionLot",
            entity_id=collection.id,
            declared_quantity=declared_qty,
            measured_quantity=measured_qty,
            difference=reconciliation["difference"],
            status="open",
            explanation=reconciliation["explanation"]
        )
        db.add(discrepancy)
        db.commit()
        db.refresh(discrepancy)

        # Log discrepancy event on blockchain hash audit
        log_supply_chain_event(
            db=db,
            event_type="DISCREPANCY_CREATED",
            entity_type="Discrepancy",
            entity_id=discrepancy.id,
            description=f"Quantity discrepancy detected for Collection {collection.collection_code}: {reconciliation['explanation']}",
            payload={
                "collection_code": collection.collection_code,
                "harvest_lot_code": harvest.lot_code,
                "declared_quantity": declared_qty,
                "measured_quantity": measured_qty,
                "difference": reconciliation["difference"],
                "percentage_difference": reconciliation["percentage_difference"]
            },
            user_id=current_user.id if current_user else None
        )

        discrepancy_obj = DiscrepancyInfo(
            difference=reconciliation["difference"],
            percentage_difference=reconciliation["percentage_difference"],
            is_discrepant=True,
            status="open",
            explanation=reconciliation["explanation"]
        )
    else:
        discrepancy_obj = DiscrepancyInfo(
            difference=reconciliation["difference"],
            percentage_difference=reconciliation["percentage_difference"],
            is_discrepant=False,
            status="verified",
            explanation=reconciliation["explanation"]
        )

    # 5. Log COLLECTION_RECORDED cryptographic event
    log_supply_chain_event(
        db=db,
        event_type="COLLECTION_RECORDED",
        entity_type="CollectionLot",
        entity_id=collection.id,
        description=(
            f"Collection centre '{collection.collection_center}' recorded physical measurement of "
            f"{collection.measured_quantity:.2f} {collection.unit} for Lot {harvest.lot_code} "
            f"(Declared: {declared_qty:.2f} {harvest.unit})."
        ),
        payload={
            "collection_code": collection.collection_code,
            "harvest_lot_code": harvest.lot_code,
            "measured_quantity": measured_qty,
            "declared_quantity": declared_qty,
            "difference": reconciliation["difference"],
            "collection_center": collection.collection_center
        },
        user_id=current_user.id if current_user else None
    )

    return CollectionResponse(
        id=collection.id,
        harvest_lot_id=collection.harvest_lot_id,
        collection_code=collection.collection_code,
        measured_quantity=collection.measured_quantity,
        unit=collection.unit,
        collection_center=collection.collection_center,
        collected_at=collection.collected_at,
        declared_quantity=declared_qty,
        discrepancy=discrepancy_obj
    )


@router.get("", response_model=List[CollectionResponse])
def list_collections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    collections = db.query(CollectionLot).order_by(CollectionLot.id.desc()).offset(skip).limit(limit).all()
    out = []
    for c in collections:
        declared = c.harvest_lot.declared_quantity if c.harvest_lot else None
        disc = None
        if declared is not None:
            recon = reconcile_collection_quantity(declared, c.measured_quantity)
            disc = DiscrepancyInfo(
                difference=recon["difference"],
                percentage_difference=recon["percentage_difference"],
                is_discrepant=recon["is_discrepant"],
                status="open" if recon["is_discrepant"] else "verified",
                explanation=recon["explanation"]
            )
        out.append(CollectionResponse(
            id=c.id,
            harvest_lot_id=c.harvest_lot_id,
            collection_code=c.collection_code,
            measured_quantity=c.measured_quantity,
            unit=c.unit,
            collection_center=c.collection_center,
            collected_at=c.collected_at,
            declared_quantity=declared,
            discrepancy=disc
        ))
    return out


@router.get("/{collection_id}", response_model=CollectionResponse)
def get_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):
    collection = db.query(CollectionLot).filter(CollectionLot.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection lot with id {collection_id} not found"
        )

    declared = collection.harvest_lot.declared_quantity if collection.harvest_lot else None
    disc = None
    if declared is not None:
        recon = reconcile_collection_quantity(declared, collection.measured_quantity)
        disc = DiscrepancyInfo(
            difference=recon["difference"],
            percentage_difference=recon["percentage_difference"],
            is_discrepant=recon["is_discrepant"],
            status="open" if recon["is_discrepant"] else "verified",
            explanation=recon["explanation"]
        )

    return CollectionResponse(
        id=collection.id,
        harvest_lot_id=collection.harvest_lot_id,
        collection_code=collection.collection_code,
        measured_quantity=collection.measured_quantity,
        unit=collection.unit,
        collection_center=collection.collection_center,
        collected_at=collection.collected_at,
        declared_quantity=declared,
        discrepancy=disc
    )