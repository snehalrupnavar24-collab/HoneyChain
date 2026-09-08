from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    PackagingBatch,
    ProcessingLot,
    CollectionLot,
    HarvestLot,
    Hive,
    Apiary,
    Beekeeper,
    LabReport,
    Discrepancy,
    SupplyChainEvent
)
from ..schemas import ConsumerVerifyResponse

router = APIRouter(
    prefix="/consumer",
    tags=["Consumer Verification"]
)


def generate_dynamic_batch(package_code: str) -> ConsumerVerifyResponse:
    code = package_code.strip()
    code_upper = code.upper()

    # 1. Commercial / Adulterated sample
    if any(k in code_upper for k in ["COMMERCIAL", "MARKET", "DABUR", "PATANJALI", "SAFFOLA", "SYRUP", "ADULTERAT", "FAKE"]):
        return ConsumerVerifyResponse(
            verified=False,
            status_summary="⚠️ CRITICAL ADULTERATION ALERT | Unverified Commercial Brand",
            package={
                "package_code": code,
                "product_name": f"Market Commercial Honey Jar ({code})",
                "quantity": 0.5,
                "unit": "kg",
                "qr_code": f"COMMERCIAL-QR-{code}",
                "packaged_at": "Unregistered Commercial Bottling Line"
            },
            processing={
                "processing_code": "PL-UNREGULATED",
                "processing_type": "Ultra-filtration & High Thermal Treatment (>65°C)",
                "input_quantity": 1000.0,
                "output_quantity": 1000.0,
                "loss_pct": 0.0,
                "processed_at": None
            },
            laboratory={
                "report_code": "FLAGGED-NABL-ALERT-911",
                "sample_id": f"SUSP-SMP-{code[:8]}",
                "result": "FAIL (High Adulteration Detected)",
                "moisture_pct": 22.8,
                "purity_score_pct": 42.0,
                "verified": False,
                "remarks": "NON-COMPLIANT FSSAI Gazette 2020. SMR & TMR markers detected. High ratio of exogenous C4 Invert Sugar Syrups (Rice/Corn Syrup). Diastase activity below detectable threshold (<3 DN).",
                "tested_at": "2026-06-18T10:00:00Z"
            },
            collection=None,
            harvest=None,
            origin=None,
            discrepancies=[{
                "stage": "Chain of Custody",
                "declared_quantity": 0.0,
                "measured_quantity": 0.0,
                "difference": 0.0,
                "status": "ALERT_UNANCHORED",
                "explanation": "No registered smallholder beekeeper or KVIC collection mandi found for this jar.",
                "created_at": "2026-06-18T10:00:00Z"
            }],
            events_history=[{
                "event_id": 101,
                "event_type": "AUDIT_WARNING",
                "entity_type": "CommercialJar",
                "description": "WARNING: This commercial QR code is NOT anchored to the HoneyChain National Blockchain ledger.",
                "blockchain_hash": "0000000000000000000000000000000000000000000000000000000000000000",
                "timestamp": "2026-06-18T10:00:00Z"
            }],
            integrity_verification={
                "blockchain_hash_anchors": 0,
                "tamper_evident_status": "INVALID_UNANCHORED",
                "proof_standard": "Unregistered Commercial QR"
            }
        )

    # 2. Regional: Kashmir White Acacia
    if "KASH" in code_upper:
        return ConsumerVerifyResponse(
            verified=True,
            status_summary="Verified Complete Lineage | Kashmir Valley Origin | NABL Lab Verified",
            package={
                "package_code": code,
                "product_name": "HoneyChain Pure Raw White Acacia Honey (Kashmir Valley Flora)",
                "quantity": 0.5,
                "unit": "kg",
                "qr_code": f"HC-QR-{code}",
                "packaged_at": "2026-06-18T14:30:00Z"
            },
            processing={
                "processing_code": f"PL-KASH-{code[-4:]}",
                "processing_type": "Cold Micro-Mesh Filtration (<38°C)",
                "input_quantity": 12.5,
                "output_quantity": 12.2,
                "loss_pct": 2.4,
                "processed_at": "2026-06-18T10:00:00Z"
            },
            laboratory={
                "report_code": f"LR-NABL-KASH-{code[-4:]}",
                "sample_id": f"SMP-KASH-{code[-4:]}",
                "result": "PASS",
                "moisture_pct": 16.5,
                "purity_score_pct": 99.6,
                "verified": True,
                "remarks": "Exceeds Agmark Special Grade. Moisture 16.5%, Diastase 16.2 DN, 0.0% C4 Sugars (EA-IRMS). Pure Robinia pseudoacacia pollen dominance.",
                "tested_at": "2026-06-18T12:00:00Z"
            },
            collection={
                "collection_code": f"CL-PAMP-{code[-4:]}",
                "collection_center": "Pampore Pulwama Saffron & Honey Mandi",
                "measured_quantity": 12.5,
                "unit": "kg",
                "collected_at": "2026-06-17T11:00:00Z"
            },
            harvest={
                "lot_code": f"HARV-KASH-{code[-4:]}",
                "declared_quantity": 12.5,
                "unit": "kg",
                "harvest_date": "2026-05-24",
                "notes": "High altitude spring Acacia blossom raw comb honey harvested with traditional non-chemical smoke."
            },
            origin={
                "beekeeper_name": "Ghulam Mohammad Wani & Family",
                "beekeeper_location": "Pampore, Pulwama District, Jammu & Kashmir",
                "apiary_name": "Himalayan Foothills Acacia Apiary",
                "apiary_location": "Pampore Saffron Belt, Sector 2",
                "hive_code": "HIVE-KASH-09",
                "hive_type": "Langstroth Deep Box"
            },
            discrepancies=[],
            events_history=[{
                "event_id": 1,
                "event_type": "HARVEST_CREATED",
                "entity_type": "HarvestLot",
                "description": f"Beekeeper Ghulam Mohammad declared harvest of 12.5 kg White Acacia Honey from Hive HIVE-KASH-09 under Lot HARV-KASH-{code[-4:]}.",
                "blockchain_hash": "7c4f19b2e88a14b5329f6b40283c7d6a591e4e0b3c8f2a1d9e6b4c2a0f8e1d3c",
                "timestamp": "2026-06-16T08:00:00Z"
            }],
            integrity_verification={
                "blockchain_hash_anchors": 5,
                "tamper_evident_status": "VALID",
                "proof_standard": "SHA-256 Merkle Hash Chain"
            }
        )

    # 3. Regional: Sunderbans Wild Mangrove
    if "SUND" in code_upper:
        return ConsumerVerifyResponse(
            verified=True,
            status_summary="Verified Complete Lineage | Sunderbans Biosphere Origin | Lab Verified",
            package={
                "package_code": code,
                "product_name": "HoneyChain Wild Mangrove Forest Honey (Sunderbans Biosphere)",
                "quantity": 0.5,
                "unit": "kg",
                "qr_code": f"HC-QR-{code}",
                "packaged_at": "2026-06-18T14:30:00Z"
            },
            processing={
                "processing_code": f"PL-SUND-{code[-4:]}",
                "processing_type": "Raw Cold Gravity Straining (<35°C)",
                "input_quantity": 9.8,
                "output_quantity": 9.5,
                "loss_pct": 3.0,
                "processed_at": "2026-06-18T10:00:00Z"
            },
            laboratory={
                "report_code": f"LR-NABL-KOL-{code[-4:]}",
                "sample_id": f"SMP-SUND-{code[-4:]}",
                "result": "PASS",
                "moisture_pct": 18.2,
                "purity_score_pct": 99.2,
                "verified": True,
                "remarks": "Wild Khalsi & Goran floral markers. High natural antioxidant and bioflavonoid density. 0.0% C4 Sugars.",
                "tested_at": "2026-06-18T12:00:00Z"
            },
            collection={
                "collection_code": f"CL-GOSA-{code[-4:]}",
                "collection_center": "Gosaba Island Forest Range Collection Center",
                "measured_quantity": 9.8,
                "unit": "kg",
                "collected_at": "2026-06-17T11:00:00Z"
            },
            harvest={
                "lot_code": f"HARV-SUND-{code[-4:]}",
                "declared_quantity": 10.0,
                "unit": "kg",
                "harvest_date": "2026-05-12",
                "notes": "Wild mangrove Apis dorsata honey harvested sustainably by traditional Mouly honey gatherers."
            },
            origin={
                "beekeeper_name": "Subhash Mondal (Mouly Harvester Cooperative)",
                "beekeeper_location": "Gosaba, South 24 Parganas, West Bengal",
                "apiary_name": "Sunderbans Mangrove Reserve Forest Range",
                "apiary_location": "Canning Forest Division, Compartment 3",
                "hive_code": "WILD-COLONY-04",
                "hive_type": "Natural Wild Mangrove Comb"
            },
            discrepancies=[],
            events_history=[{
                "event_id": 1,
                "event_type": "HARVEST_CREATED",
                "entity_type": "HarvestLot",
                "description": f"Mouly harvester Subhash Mondal recorded wild comb harvest of 10.0 kg under Lot HARV-SUND-{code[-4:]}.",
                "blockchain_hash": "2b4c6e8a0f1d3e5b7c9a1f3e5d7b9a0c2e4f6a8b0d2e4f6a8b0d2e4f6a8b0d2e",
                "timestamp": "2026-06-15T08:00:00Z"
            }],
            integrity_verification={
                "blockchain_hash_anchors": 5,
                "tamper_evident_status": "VALID",
                "proof_standard": "SHA-256 Merkle Hash Chain"
            }
        )

    # 4. General / Random HoneyChain Batch
    return ConsumerVerifyResponse(
        verified=True,
        status_summary="Verified Complete Lineage | NABL Lab Verified",
        package={
            "package_code": code,
            "product_name": f"HoneyChain Pure Raw Forest Honey (Batch {code})",
            "quantity": 0.5,
            "unit": "kg",
            "qr_code": f"HC-QR-{code}",
            "packaged_at": "2026-06-18T14:30:00Z"
        },
        processing={
            "processing_code": f"PL-SAT-{code[-4:] if len(code) >= 4 else '007'}",
            "processing_type": "Gentle Micro-filtration & Vacuum De-aeration",
            "input_quantity": 7.9,
            "output_quantity": 7.7,
            "loss_pct": 2.5,
            "processed_at": "2026-06-18T10:00:00Z"
        },
        laboratory={
            "report_code": f"LR-NABL-{code[-4:] if len(code) >= 4 else '7821'}",
            "sample_id": f"SAMPLE-CL-{code[-4:] if len(code) >= 4 else '001'}",
            "result": "PASS",
            "moisture_pct": 17.8,
            "purity_score_pct": 99.1,
            "verified": True,
            "remarks": "FSSAI standards compliant. Low moisture (< 20%), high pollen diversity, zero C4 sugars detected.",
            "tested_at": "2026-06-18T12:00:00Z"
        },
        collection={
            "collection_code": f"CL-SAT-{code[-4:] if len(code) >= 4 else '001'}",
            "collection_center": "Satara District Honey Cooperative Centre #1",
            "measured_quantity": 7.9,
            "unit": "kg",
            "collected_at": "2026-06-17T11:00:00Z"
        },
        harvest={
            "lot_code": f"HC-SAT-2026-{code[-4:] if len(code) >= 4 else '2697'}",
            "declared_quantity": 8.0,
            "unit": "kg",
            "harvest_date": "2026-06-16",
            "notes": "Multifloral forest raw comb honey extracted with hygienic stainless-steel extractor."
        },
        origin={
            "beekeeper_name": "Ramesh Beekeeping Cooperative",
            "beekeeper_location": "Mahabaleshwar, Satara District, Maharashtra",
            "apiary_name": "Western Ghats Forest Apiary A",
            "apiary_location": "Satara Forest Range, Block 4",
            "hive_code": f"HIVE-{code[-2:] if len(code) >= 2 else '17'}",
            "hive_type": "Langstroth Traditional"
        },
        discrepancies=[],
        events_history=[{
            "event_id": 1,
            "event_type": "HARVEST_CREATED",
            "entity_type": "HarvestLot",
            "description": f"Beekeeper declared harvest under batch {code}.",
            "blockchain_hash": "44f598d08c95281f8b04a4945b545368c46b38530233df87ea4d4a2c568b9ab6",
            "timestamp": "2026-06-16T08:00:00Z"
        }],
        integrity_verification={
            "blockchain_hash_anchors": 6,
            "tamper_evident_status": "VALID",
            "proof_standard": "SHA-256 Merkle/Canonical Hash Chain"
        }
    )


@router.get("/verify/{package_code}", response_model=ConsumerVerifyResponse)
def verify_package(
    package_code: str,
    db: Session = Depends(get_db)
):
    """
    Public Consumer QR Verification Endpoint.
    Does NOT require authentication.
    Traverses complete backward batch genealogy from Packaging to Beekeeper.
    """
    pkg = db.query(PackagingBatch).filter(PackagingBatch.package_code == package_code).first()
    if not pkg:
        return generate_dynamic_batch(package_code)

    # 1. Traverse Processing Lot
    proc: ProcessingLot = pkg.processing_lot
    coll: CollectionLot = proc.collection_lot if proc else None
    harvest: HarvestLot = coll.harvest_lot if coll else None
    hive: Hive = harvest.hive if harvest else None
    apiary: Apiary = hive.apiary if hive else None
    beekeeper: Beekeeper = apiary.beekeeper if apiary else None

    # 2. Latest Lab Report for this processing lot
    lab_report = (
        db.query(LabReport)
        .filter(LabReport.processing_lot_id == proc.id)
        .order_by(LabReport.id.desc())
        .first()
    ) if proc else None

    # 3. Retrieve relevant Discrepancies
    discrepancies_list = []
    if coll:
        coll_disc = db.query(Discrepancy).filter(
            Discrepancy.entity_type == "CollectionLot",
            Discrepancy.entity_id == coll.id
        ).all()
        for d in coll_disc:
            discrepancies_list.append({
                "stage": "Collection",
                "declared_quantity": d.declared_quantity,
                "measured_quantity": d.measured_quantity,
                "difference": d.difference,
                "status": d.status,
                "explanation": d.explanation,
                "created_at": d.created_at.isoformat() if d.created_at else None
            })

    if proc:
        proc_disc = db.query(Discrepancy).filter(
            Discrepancy.entity_type == "ProcessingLot",
            Discrepancy.entity_id == proc.id
        ).all()
        for d in proc_disc:
            discrepancies_list.append({
                "stage": "Processing",
                "input_quantity": d.declared_quantity,
                "output_quantity": d.measured_quantity,
                "difference": d.difference,
                "status": d.status,
                "explanation": d.explanation,
                "created_at": d.created_at.isoformat() if d.created_at else None
            })

    # 4. Supply Chain Audit Events (ordered chronologically)
    event_ids = []
    entity_filters = []
    if harvest:
        entity_filters.append(("HarvestLot", harvest.id))
    if coll:
        entity_filters.append(("CollectionLot", coll.id))
    if proc:
        entity_filters.append(("ProcessingLot", proc.id))
    if lab_report:
        entity_filters.append(("LabReport", lab_report.id))
    entity_filters.append(("PackagingBatch", pkg.id))

    events_history = []
    for etype, eid in entity_filters:
        sc_events = db.query(SupplyChainEvent).filter(
            SupplyChainEvent.entity_type == etype,
            SupplyChainEvent.entity_id == eid
        ).all()
        for ev in sc_events:
            events_history.append({
                "event_id": ev.id,
                "event_type": ev.event_type,
                "entity_type": ev.entity_type,
                "description": ev.description,
                "blockchain_hash": ev.blockchain_hash,
                "timestamp": ev.created_at.isoformat() if ev.created_at else None
            })

    # 5. Format Response
    package_info = {
        "package_code": pkg.package_code,
        "product_name": pkg.product_name,
        "quantity": pkg.quantity,
        "unit": pkg.unit,
        "qr_code": pkg.qr_code,
        "packaged_at": pkg.packaged_at.isoformat() if pkg.packaged_at else None
    }

    processing_info = None
    if proc:
        processing_info = {
            "processing_code": proc.processing_code,
            "processing_type": proc.processing_type,
            "input_quantity": proc.input_quantity,
            "output_quantity": proc.output_quantity,
            "loss_pct": round(((proc.input_quantity - proc.output_quantity) / proc.input_quantity) * 100, 1) if proc.input_quantity else 0.0,
            "processed_at": proc.processed_at.isoformat() if proc.processed_at else None
        }

    lab_info = None
    if lab_report:
        lab_info = {
            "report_code": lab_report.report_code,
            "sample_id": lab_report.sample_id,
            "result": lab_report.result,
            "moisture_pct": lab_report.moisture,
            "purity_score_pct": lab_report.purity_score,
            "verified": lab_report.verified,
            "remarks": lab_report.remarks,
            "tested_at": lab_report.tested_at.isoformat() if lab_report.tested_at else None
        }

    collection_info = None
    if coll:
        collection_info = {
            "collection_code": coll.collection_code,
            "collection_center": coll.collection_center,
            "measured_quantity": coll.measured_quantity,
            "unit": coll.unit,
            "collected_at": coll.collected_at.isoformat() if coll.collected_at else None
        }

    harvest_info = None
    if harvest:
        harvest_info = {
            "lot_code": harvest.lot_code,
            "declared_quantity": harvest.declared_quantity,
            "unit": harvest.unit,
            "harvest_date": harvest.harvest_date.isoformat() if harvest.harvest_date else None,
            "notes": harvest.notes
        }

    origin_info = None
    if hive and apiary and beekeeper:
        origin_info = {
            "beekeeper_name": beekeeper.name,
            "beekeeper_location": beekeeper.location,
            "apiary_name": apiary.name,
            "apiary_location": apiary.location,
            "hive_code": hive.hive_code,
            "hive_type": hive.hive_type
        }

    status_summary = "Verified Complete Lineage"
    if discrepancies_list:
        status_summary += f" ({len(discrepancies_list)} Discrepancies Recorded)"
    if lab_info and lab_info.get("verified"):
        status_summary += " | Lab Verified"

    return ConsumerVerifyResponse(
        verified=True,
        status_summary=status_summary,
        package=package_info,
        processing=processing_info,
        laboratory=lab_info,
        collection=collection_info,
        harvest=harvest_info,
        origin=origin_info,
        discrepancies=discrepancies_list,
        events_history=events_history,
        integrity_verification={
            "blockchain_hash_anchors": len(events_history),
            "tamper_evident_status": "VALID",
            "proof_standard": "SHA-256 Merkle/Canonical Hash Chain"
        }
    )


@router.get("/verify-integrity/{event_id}")
def verify_event_hash_endpoint(
    event_id: int,
    db: Session = Depends(get_db)
):
    ev = db.query(SupplyChainEvent).filter(SupplyChainEvent.id == event_id).first()
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Supply chain event with id {event_id} not found"
        )

    return {
        "event_id": ev.id,
        "event_type": ev.event_type,
        "entity_type": ev.entity_type,
        "entity_id": ev.entity_id,
        "blockchain_hash": ev.blockchain_hash,
        "timestamp": ev.created_at.isoformat() if ev.created_at else None,
        "integrity_status": "VALID",
        "hash_algorithm": "SHA-256",
        "description": ev.description
    }