from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Prediction, Hive, SensorReading
from ..schemas import (
    YieldPredictionRequest,
    YieldPredictionResponse,
    SupplyChainAnomalyRequest,
    AnomalyDetectionResponse,
)
from ..ml.service import (
    run_yield_prediction,
    run_supply_chain_anomaly_detection,
    detect_sensor_anomaly
)

router = APIRouter(
    prefix="/ai",
    tags=["AI & Intelligence"]
)


@router.post("/yield-prediction", response_model=YieldPredictionResponse)
def predict_yield(
    req: YieldPredictionRequest,
    db: Session = Depends(get_db)
):
    hive_temp = req.hive_temp
    hive_hum = req.hive_hum

    # If hive_id is provided, check if real recent sensor readings exist to enrich features
    if req.hive_id:
        hive = db.query(Hive).filter(Hive.id == req.hive_id).first()
        if not hive:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Hive with id {req.hive_id} not found"
            )
        latest_sensor = (
            db.query(SensorReading)
            .filter(SensorReading.hive_id == req.hive_id)
            .order_by(SensorReading.recorded_at.desc())
            .first()
        )
        if latest_sensor:
            if latest_sensor.temperature:
                hive_temp = latest_sensor.temperature
            if latest_sensor.humidity:
                hive_hum = latest_sensor.humidity

    pred_value, lags, explanation = run_yield_prediction(
        env_temp=req.env_temp,
        rel_hum=req.rel_hum,
        hive_temp=hive_temp,
        hive_hum=hive_hum,
        wind_speed=req.wind_speed,
        date_str=req.date_str
    )

    # Save in Prediction table
    pred_record = Prediction(
        hive_id=req.hive_id,
        prediction_type="YIELD_PREDICTION",
        predicted_value=pred_value,
        confidence=0.92,
        explanation=explanation,
        created_at=datetime.utcnow()
    )
    db.add(pred_record)
    db.commit()
    db.refresh(pred_record)

    return YieldPredictionResponse(
        hive_id=req.hive_id,
        predicted_yield_kg=pred_value,
        confidence_score=0.92,
        expected_harvest_window_days="4-7 days",
        features_used={
            "environmental_temp_c": req.env_temp,
            "relative_humidity_pct": req.rel_hum,
            "hive_temp_c": hive_temp,
            "hive_hum_pct": hive_hum,
            "wind_speed_kmh": req.wind_speed,
            "lags": lags
        },
        explanation=explanation,
        prediction_record_id=pred_record.id
    )


@router.post("/anomaly-detection", response_model=AnomalyDetectionResponse)
def detect_anomalies(
    req: SupplyChainAnomalyRequest,
    db: Session = Depends(get_db)
):
    analysis = run_supply_chain_anomaly_detection(
        batch_id=req.batch_id,
        harvest=req.harvest_qty,
        processing=req.processing_qty,
        bottled=req.bottled_qty,
        dispatched=req.dispatched_qty
    )

    pred_record = Prediction(
        hive_id=None,
        prediction_type="SUPPLY_CHAIN_ANOMALY",
        predicted_value=1.0 if analysis["is_anomaly"] else 0.0,
        confidence=0.95 if analysis["is_anomaly"] else 0.90,
        explanation=analysis["explanation"],
        created_at=datetime.utcnow()
    )
    db.add(pred_record)
    db.commit()
    db.refresh(pred_record)

    return AnomalyDetectionResponse(
        status=analysis["status"],
        is_anomaly=analysis["is_anomaly"],
        confidence_info=analysis.get("confidence_info"),
        layer1_rule_violations=analysis.get("layer1_rule_violations", []),
        explanation=analysis["explanation"],
        prediction_record_id=pred_record.id
    )