import json
import hashlib
import hmac
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from .models import SupplyChainEvent, AuditRecord


def create_canonical_payload(
    event_type: str,
    entity_type: str,
    entity_id: int,
    timestamp: datetime,
    payload: Optional[Dict[str, Any]] = None,
    previous_hash: Optional[str] = None
) -> str:
    """
    Creates a deterministic, canonical JSON representation of a supply chain event.
    """
    iso_time = timestamp.isoformat() if isinstance(timestamp, datetime) else str(timestamp)
    canonical_dict = {
        "entity_id": entity_id,
        "entity_type": entity_type,
        "event_type": event_type,
        "payload": payload or {},
        "previous_hash": previous_hash or "GENESIS",
        "timestamp": iso_time
    }
    return json.dumps(canonical_dict, sort_keys=True, separators=(",", ":"))


def compute_sha256_hash(canonical_string: str) -> str:
    """
    Computes standard SHA-256 hash formatted as a hex digest.
    """
    return hashlib.sha256(canonical_string.encode("utf-8")).hexdigest()


def generate_event_hash(
    event_type: str,
    entity_type: str,
    entity_id: int,
    timestamp: datetime,
    payload: Optional[Dict[str, Any]] = None,
    previous_hash: Optional[str] = None
) -> str:
    canonical = create_canonical_payload(
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        timestamp=timestamp,
        payload=payload,
        previous_hash=previous_hash
    )
    return compute_sha256_hash(canonical)


def verify_event_integrity(
    recorded_hash: str,
    event_type: str,
    entity_type: str,
    entity_id: int,
    timestamp: datetime,
    payload: Optional[Dict[str, Any]] = None,
    previous_hash: Optional[str] = None
) -> bool:
    """
    Verifies if a recorded hash matches newly computed canonical hash.
    Uses constant-time comparison to prevent timing side-channels.
    """
    expected = generate_event_hash(
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        timestamp=timestamp,
        payload=payload,
        previous_hash=previous_hash
    )
    return hmac.compare_digest(recorded_hash or "", expected)


def log_supply_chain_event(
    db: Session,
    event_type: str,
    entity_type: str,
    entity_id: int,
    description: str,
    payload: Optional[Dict[str, Any]] = None,
    user_id: Optional[int] = None
) -> SupplyChainEvent:
    """
    Creates a SupplyChainEvent with a cryptographic SHA-256 hash anchored to the event data,
    and simultaneously logs an AuditRecord.
    """
    now = datetime.utcnow()

    # Find the most recent event's hash to form a hash chain
    last_event = db.query(SupplyChainEvent).order_by(SupplyChainEvent.id.desc()).first()
    prev_hash = last_event.blockchain_hash if last_event else "GENESIS"

    event_hash = generate_event_hash(
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        timestamp=now,
        payload=payload,
        previous_hash=prev_hash
    )

    sc_event = SupplyChainEvent(
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description,
        blockchain_hash=event_hash,
        created_at=now
    )
    db.add(sc_event)

    # Also record audit entry
    audit = AuditRecord(
        user_id=user_id,
        action=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        details=description,
        created_at=now
    )
    db.add(audit)

    db.commit()
    db.refresh(sc_event)
    return sc_event
