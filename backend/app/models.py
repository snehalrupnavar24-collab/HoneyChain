from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Date,
    Text,
    ForeignKey,
    Boolean,
)
from sqlalchemy.orm import relationship

from .database import Base


# =========================================================
# USER
# =========================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    beekeepers = relationship("Beekeeper", back_populates="user")


# =========================================================
# BEEKEEPER
# =========================================================

class Beekeeper(Base):
    __tablename__ = "beekeepers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    location = Column(String(200), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="beekeepers")
    apiaries = relationship("Apiary", back_populates="beekeeper", cascade="all, delete-orphan")


# =========================================================
# APIARY
# =========================================================

class Apiary(Base):
    __tablename__ = "apiaries"

    id = Column(Integer, primary_key=True, index=True)
    beekeeper_id = Column(
        Integer,
        ForeignKey("beekeepers.id"),
        nullable=False
    )

    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=True)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    beekeeper = relationship("Beekeeper", back_populates="apiaries")
    hives = relationship("Hive", back_populates="apiary", cascade="all, delete-orphan")


# =========================================================
# HIVE
# =========================================================

class Hive(Base):
    __tablename__ = "hives"

    id = Column(Integer, primary_key=True, index=True)

    apiary_id = Column(
        Integer,
        ForeignKey("apiaries.id"),
        nullable=False
    )

    hive_code = Column(String(50), unique=True, nullable=False)
    hive_type = Column(String(50), nullable=True)

    status = Column(String(30), default="active")

    created_at = Column(DateTime, default=datetime.utcnow)

    apiary = relationship("Apiary", back_populates="hives")
    harvest_lots = relationship("HarvestLot", back_populates="hive", cascade="all, delete-orphan")
    sensor_readings = relationship("SensorReading", back_populates="hive", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="hive", cascade="all, delete-orphan")


# =========================================================
# HARVEST LOT
# =========================================================

class HarvestLot(Base):
    __tablename__ = "harvest_lots"

    id = Column(Integer, primary_key=True, index=True)

    hive_id = Column(
        Integer,
        ForeignKey("hives.id"),
        nullable=False
    )

    lot_code = Column(String(100), unique=True, nullable=False)

    harvest_date = Column(Date, nullable=False)

    # What beekeeper declares
    declared_quantity = Column(Float, nullable=False)

    unit = Column(String(20), default="kg")

    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    hive = relationship("Hive", back_populates="harvest_lots")
    collection_lots = relationship("CollectionLot", back_populates="harvest_lot")


# =========================================================
# COLLECTION LOT
# =========================================================

class CollectionLot(Base):
    __tablename__ = "collection_lots"

    id = Column(Integer, primary_key=True, index=True)

    harvest_lot_id = Column(
        Integer,
        ForeignKey("harvest_lots.id"),
        nullable=False
    )

    collection_code = Column(
        String(100),
        unique=True,
        nullable=False
    )

    # Actual measured quantity
    measured_quantity = Column(Float, nullable=False)

    unit = Column(String(20), default="kg")

    collection_center = Column(String(150), nullable=True)

    collected_at = Column(DateTime, default=datetime.utcnow)

    harvest_lot = relationship("HarvestLot", back_populates="collection_lots")
    processing_lots = relationship("ProcessingLot", back_populates="collection_lot")


# =========================================================
# PROCESSING LOT
# =========================================================

class ProcessingLot(Base):
    __tablename__ = "processing_lots"

    id = Column(Integer, primary_key=True, index=True)

    collection_lot_id = Column(
        Integer,
        ForeignKey("collection_lots.id"),
        nullable=False
    )

    processing_code = Column(
        String(100),
        unique=True,
        nullable=False
    )

    input_quantity = Column(Float, nullable=False)
    output_quantity = Column(Float, nullable=False)

    processing_type = Column(String(100), nullable=True)

    processed_at = Column(DateTime, default=datetime.utcnow)

    collection_lot = relationship("CollectionLot", back_populates="processing_lots")
    lab_reports = relationship("LabReport", back_populates="processing_lot", cascade="all, delete-orphan")
    packaging_batches = relationship("PackagingBatch", back_populates="processing_lot", cascade="all, delete-orphan")


# =========================================================
# LAB REPORT
# =========================================================

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)

    processing_lot_id = Column(
        Integer,
        ForeignKey("processing_lots.id"),
        nullable=False
    )

    report_code = Column(
        String(100),
        unique=True,
        nullable=False
    )

    sample_id = Column(String(100), nullable=False)

    result = Column(String(50), nullable=False)

    moisture = Column(Float, nullable=True)
    purity_score = Column(Float, nullable=True)

    remarks = Column(Text, nullable=True)

    verified = Column(Boolean, default=False)

    tested_at = Column(DateTime, default=datetime.utcnow)

    processing_lot = relationship("ProcessingLot", back_populates="lab_reports")


# =========================================================
# PACKAGING BATCH
# =========================================================

class PackagingBatch(Base):
    __tablename__ = "packaging_batches"

    id = Column(Integer, primary_key=True, index=True)

    processing_lot_id = Column(
        Integer,
        ForeignKey("processing_lots.id"),
        nullable=False
    )

    package_code = Column(
        String(100),
        unique=True,
        nullable=False
    )

    product_name = Column(String(150), nullable=False)

    quantity = Column(Float, nullable=False)

    unit = Column(String(20), default="kg")

    qr_code = Column(Text, nullable=True)

    packaged_at = Column(DateTime, default=datetime.utcnow)

    processing_lot = relationship("ProcessingLot", back_populates="packaging_batches")


# =========================================================
# SUPPLY CHAIN EVENT
# =========================================================

class SupplyChainEvent(Base):
    __tablename__ = "supply_chain_events"

    id = Column(Integer, primary_key=True, index=True)

    event_type = Column(String(100), nullable=False)

    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=False)

    description = Column(Text, nullable=True)

    blockchain_hash = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================================================
# SENSOR READING
# =========================================================

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)

    hive_id = Column(
        Integer,
        ForeignKey("hives.id"),
        nullable=False
    )

    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    hive_weight = Column(Float, nullable=True)

    recorded_at = Column(DateTime, default=datetime.utcnow)

    hive = relationship("Hive", back_populates="sensor_readings")


# =========================================================
# PREDICTION
# =========================================================

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    hive_id = Column(
        Integer,
        ForeignKey("hives.id"),
        nullable=True
    )

    prediction_type = Column(String(100), nullable=False)

    predicted_value = Column(Float, nullable=True)

    confidence = Column(Float, nullable=True)

    explanation = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    hive = relationship("Hive", back_populates="predictions")


# =========================================================
# DISCREPANCY
# =========================================================

class Discrepancy(Base):
    __tablename__ = "discrepancies"

    id = Column(Integer, primary_key=True, index=True)

    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=False)

    declared_quantity = Column(Float, nullable=True)
    measured_quantity = Column(Float, nullable=True)

    difference = Column(Float, nullable=True)

    status = Column(
        String(50),
        default="open"
    )

    explanation = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# =========================================================
# AUDIT RECORD
# =========================================================

class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=True)

    action = Column(String(100), nullable=False)

    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=True)

    details = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)