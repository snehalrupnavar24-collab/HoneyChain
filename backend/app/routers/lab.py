from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import LabReport, ProcessingLot, User
from ..schemas import LabReportCreate, LabReportResponse
from ..blockchain import log_supply_chain_event
from ..dependencies import get_optional_current_user

router = APIRouter(
    prefix="/lab",
    tags=["Laboratory"]
)


@router.post("/reports", response_model=LabReportResponse, status_code=status.HTTP_201_CREATED)
def create_lab_report(
    report_in: LabReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    proc = db.query(ProcessingLot).filter(ProcessingLot.id == report_in.processing_lot_id).first()
    if not proc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Processing lot with id {report_in.processing_lot_id} not found"
        )

    existing = db.query(LabReport).filter(LabReport.report_code == report_in.report_code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Lab report code '{report_in.report_code}' already exists"
        )

    report = LabReport(
        processing_lot_id=report_in.processing_lot_id,
        report_code=report_in.report_code,
        sample_id=report_in.sample_id,
        result=report_in.result.upper(),
        moisture=report_in.moisture,
        purity_score=report_in.purity_score,
        remarks=report_in.remarks,
        verified=report_in.verified,
        tested_at=datetime.utcnow()
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Log LAB_REPORT_CREATED event with SHA-256 hash
    log_supply_chain_event(
        db=db,
        event_type="LAB_REPORT_CREATED",
        entity_type="LabReport",
        entity_id=report.id,
        description=(
            f"Laboratory report {report.report_code} issued for Processing Lot {proc.processing_code}. "
            f"Result: {report.result}, Moisture: {report.moisture}%, Purity: {report.purity_score}%."
        ),
        payload={
            "report_code": report.report_code,
            "sample_id": report.sample_id,
            "processing_code": proc.processing_code,
            "result": report.result,
            "moisture": report.moisture,
            "purity_score": report.purity_score,
            "verified": report.verified
        },
        user_id=current_user.id if current_user else None
    )

    return report


@router.put("/reports/{report_id}/verify", response_model=LabReportResponse)
def verify_lab_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    report = db.query(LabReport).filter(LabReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab report with id {report_id} not found"
        )

    report.verified = True
    db.commit()
    db.refresh(report)

    log_supply_chain_event(
        db=db,
        event_type="LAB_REPORT_VERIFIED",
        entity_type="LabReport",
        entity_id=report.id,
        description=f"Lab report {report.report_code} was officially verified and digitally signed.",
        payload={
            "report_code": report.report_code,
            "result": report.result,
            "verified": True
        },
        user_id=current_user.id if current_user else None
    )

    return report


@router.get("/reports", response_model=List[LabReportResponse])
def list_lab_reports(
    processing_lot_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(LabReport)
    if processing_lot_id:
        query = query.filter(LabReport.processing_lot_id == processing_lot_id)
    return query.order_by(LabReport.id.desc()).offset(skip).limit(limit).all()


@router.get("/reports/{report_id}", response_model=LabReportResponse)
def get_lab_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = db.query(LabReport).filter(LabReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lab report with id {report_id} not found"
        )
    return report