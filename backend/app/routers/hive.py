from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Hive, Apiary
from ..schemas import HiveCreate, HiveResponse

router = APIRouter(
    prefix="/hives",
    tags=["Hives"]
)


@router.post("", response_model=HiveResponse, status_code=status.HTTP_201_CREATED)
def create_hive(
    hive_in: HiveCreate,
    db: Session = Depends(get_db)
):
    apiary = db.query(Apiary).filter(Apiary.id == hive_in.apiary_id).first()
    if not apiary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Apiary with id {hive_in.apiary_id} not found"
        )

    existing_hive = db.query(Hive).filter(Hive.hive_code == hive_in.hive_code).first()
    if existing_hive:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hive with code '{hive_in.hive_code}' already exists"
        )

    hive = Hive(
        apiary_id=hive_in.apiary_id,
        hive_code=hive_in.hive_code,
        hive_type=hive_in.hive_type,
        status=hive_in.status or "active"
    )
    db.add(hive)
    db.commit()
    db.refresh(hive)
    return hive


@router.get("", response_model=List[HiveResponse])
def list_hives(
    apiary_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Hive)
    if apiary_id:
        query = query.filter(Hive.apiary_id == apiary_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{hive_id}", response_model=HiveResponse)
def get_hive(
    hive_id: int,
    db: Session = Depends(get_db)
):
    hive = db.query(Hive).filter(Hive.id == hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hive with id {hive_id} not found"
        )
    return hive