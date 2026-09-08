from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Discrepancy, SupplyChainEvent, AuditRecord, User
from ..schemas import DiscrepancyResponse, SupplyChainEventResponse
from ..blockchain import log_supply_chain_event
from ..dependencies import get_optional_current_user

router = APIRouter(
    prefix="/discrepancies",
    tags=["Discrepancies & Audit"]
)


class DiscrepancyResolveRequest(BaseModel):
    status: str = "resolved"
    resolution_notes: str


@router.get("", response_model=List[DiscrepancyResponse])
def list_discrepancies(
    status_filter: Optional[str] = None,
    entity_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Discrepancy)
    if status_filter:
        query = query.filter(Discrepancy.status == status_filter)
    if entity_type:
        query = query.filter(Discrepancy.entity_type == entity_type)
    return query.order_by(Discrepancy.id.desc()).offset(skip).limit(limit).all()


@router.get("/{discrepancy_id}", response_model=DiscrepancyResponse)
def get_discrepancy(
    discrepancy_id: int,
    db: Session = Depends(get_db)
):
    d = db.query(Discrepancy).filter(Discrepancy.id == discrepancy_id).first()
    if not d:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discrepancy with id {discrepancy_id} not found"
        )
    return d


@router.put("/{discrepancy_id}/resolve", response_model=DiscrepancyResponse)
def resolve_discrepancy(
    discrepancy_id: int,
    req: DiscrepancyResolveRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    d = db.query(Discrepancy).filter(Discrepancy.id == discrepancy_id).first()
    if not d:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Discrepancy with id {discrepancy_id} not found"
        )

    d.status = req.status
    if req.resolution_notes:
        d.explanation = f"{d.explanation or ''} | Resolution: {req.resolution_notes}"

    db.commit()
    db.refresh(d)

    log_supply_chain_event(
        db=db,
        event_type="DISCREPANCY_RESOLVED",
        entity_type="Discrepancy",
        entity_id=d.id,
        description=f"Discrepancy #{d.id} status updated to '{req.status}'. Notes: {req.resolution_notes}",
        payload={
            "discrepancy_id": d.id,
            "status": req.status,
            "resolution_notes": req.resolution_notes
        },
        user_id=current_user.id if current_user else None
    )

    return d


@router.get("/audit/events", response_model=List[SupplyChainEventResponse])
def list_supply_chain_events(
    entity_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(SupplyChainEvent)
    if entity_type:
        query = query.filter(SupplyChainEvent.entity_type == entity_type)
    return query.order_by(SupplyChainEvent.id.desc()).offset(skip).limit(limit).all()
