from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ProcessingLot, CollectionLot, Discrepancy, User
from ..schemas import ProcessingCreate, ProcessingResponse
from ..reconciliation import reconcile_processing_mass_balance
from ..blockchain import log_supply_chain_event
from ..dependencies import get_optional_current_user

router = APIRouter(
    prefix="/processing",
    tags=["Processing"]
)


@router.post("", response_model=ProcessingResponse, status_code=status.HTTP_201_CREATED)
def create_processing(
    proc_in: ProcessingCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    collection = db.query(CollectionLot).filter(CollectionLot.id == proc_in.collection_lot_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection lot with id {proc_in.collection_lot_id} not found"
        )

    existing_proc = db.query(ProcessingLot).filter(ProcessingLot.processing_code == proc_in.processing_code).first()
    if existing_proc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Processing code '{proc_in.processing_code}' already exists"
        )

    # 1. Mass-balance verification
    reconciliation = reconcile_processing_mass_balance(
        input_qty=proc_in.input_quantity,
        output_qty=proc_in.output_quantity,
        available_collection_qty=collection.measured_quantity
    )

    # 2. Create processing lot record
    proc_lot = ProcessingLot(
        collection_lot_id=proc_in.collection_lot_id,
        processing_code=proc_in.processing_code,
        input_quantity=proc_in.input_quantity,
        output_quantity=proc_in.output_quantity,
        processing_type=proc_in.processing_type
    )
    db.add(proc_lot)
    db.commit()
    db.refresh(proc_lot)

    # 3. Create discrepancy if mass conservation violated
    if reconciliation["is_discrepant"]:
        discrepancy = Discrepancy(
            entity_type="ProcessingLot",
            entity_id=proc_lot.id,
            declared_quantity=proc_in.input_quantity,
            measured_quantity=proc_in.output_quantity,
            difference=round(proc_in.output_quantity - proc_in.input_quantity, 2),
            status="open",
            explanation=reconciliation["explanation"]
        )
        db.add(discrepancy)
        db.commit()
        db.refresh(discrepancy)

        log_supply_chain_event(
            db=db,
            event_type="DISCREPANCY_CREATED",
            entity_type="Discrepancy",
            entity_id=discrepancy.id,
            description=f"Mass balance violation in Processing {proc_lot.processing_code}: {reconciliation['explanation']}",
            payload={
                "processing_code": proc_lot.processing_code,
                "input_quantity": proc_in.input_quantity,
                "output_quantity": proc_in.output_quantity,
                "violations": reconciliation["violations"]
            },
            user_id=current_user.id if current_user else None
        )

    # 4. Log PROCESSING_CREATED event
    log_supply_chain_event(
        db=db,
        event_type="PROCESSING_CREATED",
        entity_type="ProcessingLot",
        entity_id=proc_lot.id,
        description=(
            f"Processing Lot {proc_lot.processing_code} completed. "
            f"Input: {proc_lot.input_quantity:.2f} kg, Output: {proc_lot.output_quantity:.2f} kg "
            f"({proc_lot.processing_type})."
        ),
        payload={
            "processing_code": proc_lot.processing_code,
            "collection_code": collection.collection_code,
            "input_quantity": proc_lot.input_quantity,
            "output_quantity": proc_lot.output_quantity,
            "processing_type": proc_lot.processing_type,
            "mass_balance_ratio": reconciliation["mass_balance_ratio"]
        },
        user_id=current_user.id if current_user else None
    )

    return ProcessingResponse(
        id=proc_lot.id,
        collection_lot_id=proc_lot.collection_lot_id,
        processing_code=proc_lot.processing_code,
        input_quantity=proc_lot.input_quantity,
        output_quantity=proc_lot.output_quantity,
        processing_type=proc_lot.processing_type,
        processed_at=proc_lot.processed_at,
        mass_balance_ratio=reconciliation["mass_balance_ratio"],
        is_discrepant=reconciliation["is_discrepant"]
    )


@router.get("", response_model=List[ProcessingResponse])
def list_processing_lots(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    lots = db.query(ProcessingLot).order_by(ProcessingLot.id.desc()).offset(skip).limit(limit).all()
    out = []
    for p in lots:
        ratio = round(p.output_quantity / p.input_quantity, 4) if p.input_quantity > 0 else 0.0
        out.append(ProcessingResponse(
            id=p.id,
            collection_lot_id=p.collection_lot_id,
            processing_code=p.processing_code,
            input_quantity=p.input_quantity,
            output_quantity=p.output_quantity,
            processing_type=p.processing_type,
            processed_at=p.processed_at,
            mass_balance_ratio=ratio,
            is_discrepant=p.output_quantity > p.input_quantity
        ))
    return out


@router.get("/{processing_id}", response_model=ProcessingResponse)
def get_processing(
    processing_id: int,
    db: Session = Depends(get_db)
):
    p = db.query(ProcessingLot).filter(ProcessingLot.id == processing_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Processing lot with id {processing_id} not found"
        )
    ratio = round(p.output_quantity / p.input_quantity, 4) if p.input_quantity > 0 else 0.0
    return ProcessingResponse(
        id=p.id,
        collection_lot_id=p.collection_lot_id,
        processing_code=p.processing_code,
        input_quantity=p.input_quantity,
        output_quantity=p.output_quantity,
        processing_type=p.processing_type,
        processed_at=p.processed_at,
        mass_balance_ratio=ratio,
        is_discrepant=p.output_quantity > p.input_quantity
    )