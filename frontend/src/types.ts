export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface Beekeeper {
  id: number;
  name: string;
  phone?: string;
  location?: string;
  user_id?: number;
  created_at?: string;
}

export interface Apiary {
  id: number;
  beekeeper_id: number;
  name: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface Hive {
  id: number;
  apiary_id: number;
  hive_code: string;
  hive_type?: string;
  status?: string;
  created_at?: string;
}

export interface HarvestLot {
  id: number;
  hive_id: number;
  lot_code: string;
  harvest_date: string;
  declared_quantity: number;
  unit: string;
  notes?: string;
  created_at?: string;
}

export interface DiscrepancyInfo {
  difference: number;
  percentage_difference: number;
  is_discrepant: boolean;
  status: string;
  explanation: string;
}

export interface CollectionLot {
  id: number;
  harvest_lot_id: number;
  collection_code: string;
  measured_quantity: number;
  unit: string;
  collection_center?: string;
  collected_at?: string;
  declared_quantity?: number;
  discrepancy?: DiscrepancyInfo;
}

export interface ProcessingLot {
  id: number;
  collection_lot_id: number;
  processing_code: string;
  input_quantity: number;
  output_quantity: number;
  processing_type?: string;
  processed_at?: string;
  mass_balance_ratio?: number;
  is_discrepant?: boolean;
}

export interface LabReport {
  id: number;
  processing_lot_id: number;
  report_code: string;
  sample_id: string;
  result: string;
  moisture?: number;
  purity_score?: number;
  remarks?: string;
  verified: boolean;
  tested_at?: string;
}

export interface PackagingBatch {
  id: number;
  processing_lot_id: number;
  package_code: string;
  product_name: string;
  quantity: number;
  unit: string;
  qr_code?: string;
  packaged_at?: string;
}

export interface SensorReading {
  id: number;
  hive_id: number;
  temperature?: number;
  humidity?: number;
  hive_weight?: number;
  recorded_at?: string;
}

export interface Discrepancy {
  id: number;
  entity_type: string;
  entity_id: number;
  declared_quantity?: number;
  measured_quantity?: number;
  difference?: number;
  status: string;
  explanation?: string;
  created_at?: string;
}

export interface SupplyChainEvent {
  id?: number;
  event_id?: number;
  event_type: string;
  entity_type: string;
  entity_id?: number;
  description?: string;
  blockchain_hash?: string;
  timestamp?: string;
  created_at?: string;
}

export interface ConsumerVerifyResponse {
  verified: boolean;
  status_summary: string;
  package: {
    package_code: string;
    product_name: string;
    quantity: number;
    unit: string;
    qr_code?: string;
    packaged_at?: string;
  };
  processing?: {
    processing_code: string;
    processing_type?: string;
    input_quantity: number;
    output_quantity: number;
    loss_pct: number;
    processed_at?: string;
  };
  laboratory?: {
    report_code: string;
    sample_id: string;
    result: string;
    moisture_pct?: number;
    purity_score_pct?: number;
    verified: boolean;
    remarks?: string;
    tested_at?: string;
  };
  collection?: {
    collection_code: string;
    collection_center?: string;
    measured_quantity: number;
    unit: string;
    collected_at?: string;
  };
  harvest?: {
    lot_code: string;
    declared_quantity: number;
    unit: string;
    harvest_date?: string;
    notes?: string;
  };
  origin?: {
    beekeeper_name: string;
    beekeeper_location?: string;
    apiary_name: string;
    apiary_location?: string;
    hive_code: string;
    hive_type?: string;
  };
  discrepancies: Array<{
    stage: string;
    declared_quantity?: number;
    measured_quantity?: number;
    input_quantity?: number;
    output_quantity?: number;
    difference?: number;
    status: string;
    explanation?: string;
    created_at?: string;
  }>;
  events_history: Array<{
    event_id: number;
    event_type: string;
    entity_type: string;
    description?: string;
    blockchain_hash?: string;
    timestamp?: string;
  }>;
  integrity_verification: {
    blockchain_hash_anchors: number;
    tamper_evident_status: string;
    proof_standard: string;
  };
}

export interface YieldPredictionResponse {
  hive_id?: number;
  predicted_yield_kg: number;
  confidence_score?: number;
  expected_harvest_window_days: string;
  features_used: Record<string, any>;
  explanation: string;
}
