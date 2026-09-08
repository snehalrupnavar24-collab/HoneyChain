from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Beekeeper, Apiary, User
from ..schemas import (
    BeekeeperCreate,
    BeekeeperResponse,
    ApiaryCreate,
    ApiaryResponse,
)
from ..dependencies import get_optional_current_user

router = APIRouter(
    tags=["Beekeepers & Apiaries"]
)


@router.post("/beekeepers", response_model=BeekeeperResponse, status_code=status.HTTP_201_CREATED)
def create_beekeeper(
    beekeeper_in: BeekeeperCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = beekeeper_in.user_id
    if not user_id and current_user:
        user_id = current_user.id

    if user_id:
        user_exists = db.query(User).filter(User.id == user_id).first()
        if not user_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )

    beekeeper = Beekeeper(
        user_id=user_id,
        name=beekeeper_in.name,
        phone=beekeeper_in.phone,
        location=beekeeper_in.location
    )
    db.add(beekeeper)
    db.commit()
    db.refresh(beekeeper)
    return beekeeper


@router.get("/beekeepers", response_model=List[BeekeeperResponse])
def list_beekeepers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(Beekeeper).offset(skip).limit(limit).all()


@router.get("/beekeepers/{beekeeper_id}", response_model=BeekeeperResponse)
def get_beekeeper(
    beekeeper_id: int,
    db: Session = Depends(get_db)
):
    beekeeper = db.query(Beekeeper).filter(Beekeeper.id == beekeeper_id).first()
    if not beekeeper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Beekeeper with id {beekeeper_id} not found"
        )
    return beekeeper


@router.post("/apiaries", response_model=ApiaryResponse, status_code=status.HTTP_201_CREATED)
def create_apiary(
    apiary_in: ApiaryCreate,
    db: Session = Depends(get_db)
):
    beekeeper = db.query(Beekeeper).filter(Beekeeper.id == apiary_in.beekeeper_id).first()
    if not beekeeper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Beekeeper with id {apiary_in.beekeeper_id} does not exist"
        )

    apiary = Apiary(
        beekeeper_id=apiary_in.beekeeper_id,
        name=apiary_in.name,
        location=apiary_in.location,
        latitude=apiary_in.latitude,
        longitude=apiary_in.longitude
    )
    db.add(apiary)
    db.commit()
    db.refresh(apiary)
    return apiary


@router.get("/apiaries", response_model=List[ApiaryResponse])
def list_apiaries(
    beekeeper_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Apiary)
    if beekeeper_id:
        query = query.filter(Apiary.beekeeper_id == beekeeper_id)
    return query.offset(skip).limit(limit).all()


@router.get("/apiaries/{apiary_id}", response_model=ApiaryResponse)
def get_apiary(
    apiary_id: int,
    db: Session = Depends(get_db)
):
    apiary = db.query(Apiary).filter(Apiary.id == apiary_id).first()
    if not apiary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Apiary with id {apiary_id} not found"
        )
    return apiary