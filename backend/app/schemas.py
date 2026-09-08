from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


# =========================================================
# USER & AUTH
# =========================================================

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(..., description="BEEKEEPER, COLLECTION CENTRE, PROCESSOR, LAB, PACKAGER, ADMIN")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    name: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# BEEKEEPER & APIARY
# =========================================================

class BeekeeperCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    location: Optional[str] = None
    user_id: Optional[int] = None


class BeekeeperResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    phone: Optional[str] = None
    location: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ApiaryCreate(BaseModel):
    beekeeper_id: int
    name: str = Field(..., min_length=2, max_length=100)
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ApiaryResponse(BaseModel):
    id: int
    beekeeper_id: int
    name: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# HIVE
# =========================================================

class HiveCreate(BaseModel):
    apiary_id: int
    hive_code: str = Field(..., min_length=2, max_length=50)
    hive_type: Optional[str] = "Langstroth"
    status: Optional[str] = "active"


class HiveResponse(BaseModel):
    id: int
    apiary_id: int
    hive_code: str
    hive_type: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# HARVEST LOT
# =========================================================

class HarvestCreate(BaseModel):
    hive_id: int
    lot_code: str = Field(..., min_length=2, max_length=100)
    harvest_date: date
    declared_quantity: float = Field(..., gt=0)
    unit: str = "kg"
    notes: Optional[str] = None


class HarvestResponse(BaseModel):
    id: int
    hive_id: int
    lot_code: str
    harvest_date: date
    declared_quantity: float
    unit: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# COLLECTION LOT
# =========================================================

class CollectionCreate(BaseModel):
    harvest_lot_id: int
    collection_code: str = Field(..., min_length=2, max_length=100)
    measured_quantity: float = Field(..., gt=0)
    unit: str = "kg"
    collection_center: Optional[str] = None


class DiscrepancyInfo(BaseModel):
    difference: float
    percentage_difference: float
    is_discrepant: bool
    status: str
    explanation: str


class CollectionResponse(BaseModel):
    id: int
    harvest_lot_id: int
    collection_code: str
    measured_quantity: float
    unit: str
    collection_center: Optional[str] = None
    collected_at: Optional[datetime] = None
    declared_quantity: Optional[float] = None
    discrepancy: Optional[DiscrepancyInfo] = None

    class Config:
        from_attributes = True


# =========================================================
# PROCESSING LOT
# =========================================================

class ProcessingCreate(BaseModel):
    collection_lot_id: int
    processing_code: str = Field(..., min_length=2, max_length=100)
    input_quantity: float = Field(..., gt=0)
    output_quantity: float = Field(..., gt=0)
    processing_type: Optional[str] = "Filtration & Clarification"


class ProcessingResponse(BaseModel):
    id: int
    collection_lot_id: int
    processing_code: str
    input_quantity: float
    output_quantity: float
    processing_type: Optional[str] = None
    processed_at: Optional[datetime] = None
    mass_balance_ratio: Optional[float] = None
    is_discrepant: Optional[bool] = None

    class Config:
        from_attributes = True


# =========================================================
# LAB REPORT
# =========================================================

class LabReportCreate(BaseModel):
    processing_lot_id: int
    report_code: str = Field(..., min_length=2, max_length=100)
    sample_id: str = Field(..., min_length=2, max_length=100)
    result: str = Field("PASS", description="PASS or FAIL")
    moisture: Optional[float] = Field(None, ge=0, le=100, description="Moisture percentage (standard < 20%)")
    purity_score: Optional[float] = Field(None, ge=0, le=100, description="Purity score percentage")
    remarks: Optional[str] = None
    verified: bool = False


class LabReportResponse(BaseModel):
    id: int
    processing_lot_id: int
    report_code: str
    sample_id: str
    result: str
    moisture: Optional[float] = None
    purity_score: Optional[float] = None
    remarks: Optional[str] = None
    verified: bool
    tested_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# PACKAGING BATCH
# =========================================================

class PackagingCreate(BaseModel):
    processing_lot_id: int
    package_code: str = Field(..., min_length=2, max_length=100)
    product_name: str = Field(..., min_length=2, max_length=150)
    quantity: float = Field(..., gt=0)
    unit: str = "kg"
    qr_code: Optional[str] = None


class PackagingResponse(BaseModel):
    id: int
    processing_lot_id: int
    package_code: str
    product_name: str
    quantity: float
    unit: str
    qr_code: Optional[str] = None
    packaged_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# SENSOR READINGS
# =========================================================

class SensorReadingCreate(BaseModel):
    hive_id: int
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    hive_weight: Optional[float] = None


class SensorReadingResponse(BaseModel):
    id: int
    hive_id: int
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    hive_weight: Optional[float] = None
    recorded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SensorSimulateRequest(BaseModel):
    hive_id: int
    readings_count: int = Field(5, ge=1, le=50)


# =========================================================
# AI / ML
# =========================================================

class YieldPredictionRequest(BaseModel):
    hive_id: Optional[int] = None
    env_temp: float = 22.5
    rel_hum: float = 75.0
    hive_temp: float = 33.5
    hive_hum: float = 58.0
    wind_speed: float = 4.5
    date_str: Optional[str] = None


class YieldPredictionResponse(BaseModel):
    hive_id: Optional[int] = None
    predicted_yield_kg: float
    confidence_score: Optional[float] = None
    expected_harvest_window_days: str
    features_used: Dict[str, Any]
    explanation: str
    prediction_record_id: Optional[int] = None


class SupplyChainAnomalyRequest(BaseModel):
    batch_id: str = "BATCH-DEMO"
    harvest_qty: float = Field(..., ge=0)
    processing_qty: float = Field(..., ge=0)
    bottled_qty: float = Field(..., ge=0)
    dispatched_qty: float = Field(..., ge=0)


class AnomalyDetectionResponse(BaseModel):
    status: str
    is_anomaly: bool
    confidence_info: Optional[str] = None
    layer1_rule_violations: List[Dict[str, Any]] = []
    explanation: str
    prediction_record_id: Optional[int] = None


# =========================================================
# DISCREPANCY & AUDIT
# =========================================================

class DiscrepancyResponse(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    declared_quantity: Optional[float] = None
    measured_quantity: Optional[float] = None
    difference: Optional[float] = None
    status: str
    explanation: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SupplyChainEventResponse(BaseModel):
    id: int
    event_type: str
    entity_type: str
    entity_id: int
    description: Optional[str] = None
    blockchain_hash: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================================================
# CONSUMER QR TRACEABILITY RESPONSE
# =========================================================

class ConsumerVerifyResponse(BaseModel):
    verified: bool
    status_summary: str
    package: Dict[str, Any]
    processing: Optional[Dict[str, Any]] = None
    laboratory: Optional[Dict[str, Any]] = None
    collection: Optional[Dict[str, Any]] = None
    harvest: Optional[Dict[str, Any]] = None
    origin: Optional[Dict[str, Any]] = None
    discrepancies: List[Dict[str, Any]] = []
    events_history: List[Dict[str, Any]] = []
    integrity_verification: Dict[str, Any]