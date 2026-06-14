from typing import Dict, Any, List
from .weather import WeatherService
from .health import AircraftHealthService

class RiskEngine:
    @staticmethod
    def calculate_composite_risk(
        weather_score: float,
        health_score: float,
        traffic_score: float,
        human_score: float
    ) -> Dict[str, Any]:
        """
        Computes composite risk score as a weighted ensemble of sub-scores.
        Weights: Weather (35%), Health (35%), Traffic (15%), Human Factors (15%)
        """
        # Composite score calculation
        composite = (weather_score * 0.35) + (health_score * 0.35) + (traffic_score * 0.15) + (human_score * 0.15)
        composite = round(min(max(composite, 0.0), 100.0), 1)
        
        # Build explanation elements
        explanations = []
        if weather_score >= 70.0:
            explanations.append(f"Critical weather risk factors ({weather_score}/100) due to localized storm or wind-shear forecasts.")
        elif weather_score >= 40.0:
            explanations.append(f"Elevated weather sub-score ({weather_score}/100) reflecting moderate turbulence/icing forecasts.")
            
        if health_score >= 60.0:
            explanations.append(f"Degraded aircraft health sub-score ({health_score}/100) indicating critical subsystem parameter anomaly.")
        elif health_score >= 30.0:
            explanations.append(f"Elevated aircraft health watch score ({health_score}/100) showing telemetry parameter drift.")
            
        if traffic_score >= 60.0:
            explanations.append(f"High traffic/airspace congestion risk ({traffic_score}/100).")
            
        if human_score >= 60.0:
            explanations.append(f"Elevated crew fatigue/duty-time risk factors ({human_score}/100).")
            
        if not explanations:
            explanation_str = "All operational sub-scores are within normal baselines. Low overall flight risk."
        else:
            explanation_str = "Composite risk score is elevated due to:\n" + "\n".join(f"- {exp}" for exp in explanations)
            
        return {
            "composite_score": composite,
            "weather_sub_score": round(weather_score, 1),
            "aircraft_health_sub_score": round(health_score, 1),
            "traffic_sub_score": round(traffic_score, 1),
            "human_factor_sub_score": round(human_score, 1),
            "explanation": explanation_str
        }
