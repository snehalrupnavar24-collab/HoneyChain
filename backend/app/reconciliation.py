from typing import Optional, Dict, Any


def reconcile_collection_quantity(
    declared_qty: float,
    measured_qty: float,
    tolerance_pct: float = 2.0,
    tolerance_abs: float = 0.5
) -> Dict[str, Any]:
    """
    Reconciles declared quantity from beekeeper vs physical measured quantity at collection center.
    Preserves both values and determines whether discrepancy threshold is exceeded.
    """
    difference = round(measured_qty - declared_qty, 3)
    pct_diff = round((difference / declared_qty) * 100.0, 2) if declared_qty > 0 else 0.0

    # Flag discrepancy if absolute gap exceeds tolerance_abs and percentage exceeds tolerance_pct
    is_discrepant = (abs(difference) > tolerance_abs) and (abs(pct_diff) > tolerance_pct)

    if is_discrepant:
        if difference < 0:
            explanation = (
                f"Deficit detected: measured quantity ({measured_qty:.2f} kg) is "
                f"{abs(difference):.2f} kg ({abs(pct_diff):.2f}%) below declared quantity ({declared_qty:.2f} kg)."
            )
        else:
            explanation = (
                f"Surplus detected: measured quantity ({measured_qty:.2f} kg) exceeds declared "
                f"quantity ({declared_qty:.2f} kg) by {difference:.2f} kg ({pct_diff:.2f}%)."
            )
    else:
        explanation = (
            f"Measurement verified: difference of {difference:+.2f} kg ({pct_diff:+.2f}%) "
            f"is within acceptable measurement tolerance (±{tolerance_pct}% / ±{tolerance_abs} kg)."
        )

    return {
        "declared_quantity": declared_qty,
        "measured_quantity": measured_qty,
        "difference": difference,
        "percentage_difference": pct_diff,
        "is_discrepant": is_discrepant,
        "explanation": explanation
    }


def reconcile_processing_mass_balance(
    input_qty: float,
    output_qty: float,
    available_collection_qty: Optional[float] = None,
    allowed_loss_pct: float = 15.0
) -> Dict[str, Any]:
    """
    Checks mass balance for honey processing.
    Ensures input does not exceed collection inventory and output does not violate mass conservation.
    """
    violations = []
    ratio = round(output_qty / input_qty, 4) if input_qty > 0 else 0.0

    if available_collection_qty is not None and input_qty > round(available_collection_qty + 0.01, 2):
        excess_input = round(input_qty - available_collection_qty, 2)
        violations.append(
            f"Processing input ({input_qty:.2f} kg) exceeds available collection lot quantity "
            f"({available_collection_qty:.2f} kg) by {excess_input:.2f} kg."
        )

    if output_qty > input_qty:
        excess_output = round(output_qty - input_qty, 2)
        violations.append(
            f"Mass conservation violation: Output quantity ({output_qty:.2f} kg) exceeds input "
            f"quantity ({input_qty:.2f} kg) by {excess_output:.2f} kg. Possible volume injection or adulteration."
        )

    # Check excessive processing loss
    loss_qty = round(input_qty - output_qty, 2)
    loss_pct = round((loss_qty / input_qty) * 100.0, 2) if input_qty > 0 else 0.0
    if loss_pct > allowed_loss_pct:
        violations.append(
            f"Excessive processing loss: {loss_qty:.2f} kg ({loss_pct:.1f}%) exceeds normal threshold ({allowed_loss_pct}%)."
        )

    is_discrepant = len(violations) > 0
    explanation = " | ".join(violations) if is_discrepant else (
        f"Processing mass balance verified: {input_qty:.2f} kg input -> {output_qty:.2f} kg output "
        f"({loss_pct:.1f}% loss within normal range)."
    )

    return {
        "input_quantity": input_qty,
        "output_quantity": output_qty,
        "loss_quantity": loss_qty,
        "loss_percentage": loss_pct,
        "mass_balance_ratio": ratio,
        "is_discrepant": is_discrepant,
        "violations": violations,
        "explanation": explanation
    }
