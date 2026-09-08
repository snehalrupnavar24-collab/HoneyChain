import random
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import SensorReading, Hive
from ..schemas import SensorReadingCreate, SensorReadingResponse, SensorSimulateRequest

router = APIRouter(
    prefix="/sensors",
    tags=["Sensors"]
)


@router.post("/readings", response_model=SensorReadingResponse, status_code=status.HTTP_201_CREATED)
def record_sensor_reading(
    reading_in: SensorReadingCreate,
    db: Session = Depends(get_db)
):
    hive = db.query(Hive).filter(Hive.id == reading_in.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hive with id {reading_in.hive_id} not found"
        )

    reading = SensorReading(
        hive_id=reading_in.hive_id,
        temperature=reading_in.temperature,
        humidity=reading_in.humidity,
        hive_weight=reading_in.hive_weight,
        recorded_at=datetime.utcnow()
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/hive/{hive_id}", response_model=List[SensorReadingResponse])
def get_hive_sensor_readings(
    hive_id: int,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    hive = db.query(Hive).filter(Hive.id == hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hive with id {hive_id} not found"
        )

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.hive_id == hive_id)
        .order_by(SensorReading.recorded_at.desc())
        .limit(limit)
        .all()
    )
    return readings


@router.post("/simulate", response_model=List[SensorReadingResponse], status_code=status.HTTP_201_CREATED)
def simulate_sensor_readings(
    req: SensorSimulateRequest,
    db: Session = Depends(get_db)
):
    hive = db.query(Hive).filter(Hive.id == req.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hive with id {req.hive_id} not found"
        )

    created_readings = []
    base_time = datetime.utcnow() - timedelta(hours=req.readings_count)
    current_weight = 24.5

    for i in range(req.readings_count):
        # Realistic diurnal variations: brood temp tightly regulated at 33.5 - 35.5 C
        temp = round(random.uniform(33.2, 35.6), 2)
        hum = round(random.uniform(52.0, 68.0), 2)
        current_weight += round(random.uniform(0.05, 0.35), 2)  # nectar accumulation
        rec_time = base_time + timedelta(hours=i)

        r = SensorReading(
            hive_id=req.hive_id,
            temperature=temp,
            humidity=hum,
            hive_weight=round(current_weight, 2),
            recorded_at=rec_time
        )
        db.add(r)
        created_readings.append(r)

    db.commit()
    for r in created_readings:
        db.refresh(r)

    return created_readings