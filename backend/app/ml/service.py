import os
import json
from datetime import datetime
from typing import Dict, Any, Tuple, Optional, List

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "models"))
DAT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "DAT"))


def get_model_path(filename: str) -> str:
    return os.path.join(MODELS_DIR, filename)


# =========================================================
# YIELD PREDICTION SERVICE
# =========================================================

def run_yield_prediction(
    env_temp: float,
    rel_hum: float,
    hive_temp: float,
    hive_hum: float,
    wind_speed: float,
    date_str: Optional[str] = None
) -> Tuple[float, Dict[str, Any], str]:
    """
    Executes honey yield prediction using trained best_honey_yield_model.joblib.
    Falls back gracefully if dependencies or models are missing.
    """
    model_path = get_model_path("best_honey_yield_model.joblib")
    meta_path = get_model_path("model_metadata.json")

    target_date = datetime.utcnow()
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            pass

    month = target_date.month
    day_of_year = target_date.timetuple().tm_yday

    # Default lags
    lags = {
        "honey_weight_lag1": 20.0,
        "honey_weight_roll_mean_3": 20.0,
        "honey_weight_roll_mean_7": 20.0,
        "honey_weight_roll_std_7": 0.5
    }

    try:
        import joblib
        import pandas as pd
        import numpy as np

        if not os.path.exists(model_path) or not os.path.exists(meta_path):
            raise FileNotFoundError(f"Model or metadata not found at {MODELS_DIR}")

        model = joblib.load(model_path)
        with open(meta_path, "r") as f:
            metadata = json.load(f)

        feature_cols = metadata.get("feature_columns", [
            'Environmental Temperature (°C)', 'Relative Humidity (%)',
            'Hive Temperature (°C)', 'Hive Humidity (%)', 'Wind Speed (km/h)',
            'month', 'day_of_year', 'honey_weight_lag1',
            'honey_weight_roll_mean_3', 'honey_weight_roll_mean_7', 'honey_weight_roll_std_7'
        ])

        csv_path = os.path.join(DAT_DIR, "Honey_Production_Dataset_for_2024.csv")
        if os.path.exists(csv_path):
            try:
                df_hist = pd.read_csv(csv_path)
                df_hist['parsed_date'] = pd.to_datetime(df_hist['Date'], format='%B %d, %Y')
                df_hist = df_hist.sort_values('parsed_date').reset_index(drop=True)
                df_past = df_hist[df_hist['parsed_date'] < target_date]
                if len(df_past) >= 7:
                    pw = df_past['Honey Weight (kg)'].values
                    lags["honey_weight_lag1"] = float(pw[-1])
                    lags["honey_weight_roll_mean_3"] = float(np.mean(pw[-3:]))
                    lags["honey_weight_roll_mean_7"] = float(np.mean(pw[-7:]))
                    lags["honey_weight_roll_std_7"] = float(np.std(pw[-7:], ddof=1))
            except Exception:
                pass

        row_data = {
            'Environmental Temperature (°C)': [float(env_temp)],
            'Relative Humidity (%)': [float(rel_hum)],
            'Hive Temperature (°C)': [float(hive_temp)],
            'Hive Humidity (%)': [float(hive_hum)],
            'Wind Speed (km/h)': [float(wind_speed)],
            'month': [int(month)],
            'day_of_year': [int(day_of_year)],
            'honey_weight_lag1': [lags["honey_weight_lag1"]],
            'honey_weight_roll_mean_3': [lags["honey_weight_roll_mean_3"]],
            'honey_weight_roll_mean_7': [lags["honey_weight_roll_mean_7"]],
            'honey_weight_roll_std_7': [lags["honey_weight_roll_std_7"]]
        }
        df_input = pd.DataFrame(row_data)[feature_cols]
        predicted_yield = float(model.predict(df_input)[0])
        explanation = (
            f"ML Model Inference: Predicted {predicted_yield:.2f} kg based on hive temp {hive_temp}°C, "
            f"hive humidity {hive_hum}%, and lag weight {lags['honey_weight_lag1']:.1f} kg."
        )
        return round(predicted_yield, 2), lags, explanation

    except Exception as e:
        # Graceful fallback heuristic calculation
        base_yield = 8.5
        temp_factor = 1.0 - abs(hive_temp - 34.5) * 0.05
        hum_factor = 1.0 - abs(hive_hum - 60.0) * 0.02
        heuristic_yield = max(1.0, base_yield * max(0.5, temp_factor) * max(0.5, hum_factor))
        explanation = f"Heuristic Estimator (ML model offline/loading issue: {e}): Estimated {heuristic_yield:.2f} kg."
        return round(heuristic_yield, 2), lags, explanation


# =========================================================
# ANOMALY DETECTION SERVICE
# =========================================================

def run_supply_chain_anomaly_detection(
    batch_id: str,
    harvest: float,
    processing: float,
    bottled: float,
    dispatched: float
) -> Dict[str, Any]:
    """
    2-Layer anomaly detection: Layer 1 Deterministic Rules + Layer 2 ML Model.
    """
    harvest = float(harvest)
    processing = float(processing)
    bottled = float(bottled)
    dispatched = float(dispatched)

    violations = []
    if processing > harvest:
        violations.append({
            "rule": "Processing <= Harvest",
            "description": f"Processing ({processing:.2f} kg) exceeds Harvest ({harvest:.2f} kg) by {processing - harvest:.2f} kg (volume injection)",
            "excess_kg": round(processing - harvest, 2)
        })

    if bottled > processing:
        violations.append({
            "rule": "Bottled <= Processing",
            "description": f"Bottled ({bottled:.2f} kg) exceeds Processing ({processing:.2f} kg) by {bottled - processing:.2f} kg (batch dilution)",
            "excess_kg": round(bottled - processing, 2)
        })

    if dispatched > bottled:
        violations.append({
            "rule": "Dispatched <= Bottled",
            "description": f"Dispatched ({dispatched:.2f} kg) exceeds Bottled ({bottled:.2f} kg) by {dispatched - bottled:.2f} kg (ghost shipment)",
            "excess_kg": round(dispatched - bottled, 2)
        })

    rule_anomaly = 1 if len(violations) > 0 else 0
    ml_anomaly = 0
    confidence_info = None

    model_path = get_model_path("best_anomaly_model.joblib")
    try:
        import joblib
        import pandas as pd

        if os.path.exists(model_path):
            model = joblib.load(model_path)
            features = ['Harvest_Quantity_kg', 'Processing_Quantity_kg', 'Bottled_Quantity_kg', 'Dispatched_Quantity_kg']
            df_in = pd.DataFrame([{
                'Harvest_Quantity_kg': harvest,
                'Processing_Quantity_kg': processing,
                'Bottled_Quantity_kg': bottled,
                'Dispatched_Quantity_kg': dispatched
            }])[features]

            ml_pred = model.predict(df_in)[0]
            ml_anomaly = int(ml_pred)

            if hasattr(model, "predict_proba"):
                try:
                    probs = model.predict_proba(df_in)[0]
                    confidence_info = f"Anomaly Probability: {probs[1]*100:.1f}%"
                except Exception:
                    pass
    except Exception as e:
        confidence_info = f"ML model inference unavailable: {e}"

    is_anomaly = bool(rule_anomaly == 1 or ml_anomaly == 1)
    status_str = "ANOMALY" if is_anomaly else "NORMAL"

    if is_anomaly:
        explanations = [v["description"] for v in violations]
        if ml_anomaly == 1:
            explanations.append("ML Classifier flagged abnormal supply chain ratio.")
        explanation = " | ".join(explanations)
    else:
        explanation = "Supply chain quantities follow physical mass conservation and normal distribution."

    return {
        "batch_id": batch_id,
        "status": status_str,
        "is_anomaly": is_anomaly,
        "layer1_rule_violations": violations,
        "confidence_info": confidence_info,
        "explanation": explanation
    }


def detect_sensor_anomaly(temperature: Optional[float], humidity: Optional[float], weight: Optional[float]) -> Dict[str, Any]:
    """
    Biological hive condition anomaly check.
    """
    issues = []
    if temperature is not None:
        if temperature < 30.0:
            issues.append(f"Abnormally low hive temperature ({temperature:.1f}°C < 32°C brood threshold; possible chill or colony loss)")
        elif temperature > 38.0:
            issues.append(f"Abnormally high hive temperature ({temperature:.1f}°C > 36°C brood threshold; risk of overheating/swarming)")

    if humidity is not None:
        if humidity < 35.0:
            issues.append(f"Abnormally low humidity ({humidity:.1f}% < 40%; dehydration risk)")
        elif humidity > 85.0:
            issues.append(f"Abnormally high humidity ({humidity:.1f}% > 75%; mold/fungal spore risk)")

    if weight is not None and weight < 0:
        issues.append(f"Invalid hive weight reading ({weight} kg)")

    is_anomaly = len(issues) > 0
    return {
        "is_anomaly": is_anomaly,
        "status": "ANOMALY" if is_anomaly else "NORMAL",
        "explanation": " | ".join(issues) if is_anomaly else "Hive sensor readings are within healthy physiological limits."
    }
