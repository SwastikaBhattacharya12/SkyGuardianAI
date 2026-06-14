import random
from typing import Dict, Any, List

class WeatherService:
    @staticmethod
    def get_route_segments(origin: str, destination: str) -> List[Dict[str, Any]]:
        """
        Simulates route segmentation and computes weather risk factors for each leg.
        """
        # Seed to make the simulated route weather stable per origin-destination pair
        seed_val = sum(ord(c) for c in (origin + destination))
        random.seed(seed_val)
        
        legs = [
            {"name": "Departure & Climb", "distance_pct": 15},
            {"name": "Cruise Segment A", "distance_pct": 35},
            {"name": "Cruise Segment B", "distance_pct": 35},
            {"name": "Descent & Arrival", "distance_pct": 15}
        ]
        
        segments = []
        for i, leg in enumerate(legs):
            # Generate deterministic weather indicators for the demo
            convective = random.choice([True, False, False, False])
            turbulence = random.choice(["None", "Light", "Moderate", "Severe"])
            icing = random.choice(["None", "Trace", "Moderate", "Severe"])
            
            # Special case for Flight AI102 landing at EGLL (severe convective cell enroute / landing)
            if destination == "EGLL" and i == 3:
                convective = True
                turbulence = "Severe"
                icing = "Moderate"
                risk_score = 85.0
                dominant_hazard = "Severe Wind-shear & Convective Storm"
            elif origin == "KJFK" and i == 0:
                convective = False
                turbulence = "Light"
                icing = "None"
                risk_score = 25.0
                dominant_hazard = "Light Turbulence"
            else:
                # Calculate simple base risk
                risk_score = 10.0
                if convective:
                    risk_score += 40.0
                if turbulence == "Moderate":
                    risk_score += 20.0
                elif turbulence == "Severe":
                    risk_score += 50.0
                if icing == "Moderate":
                    risk_score += 15.0
                elif icing == "Severe":
                    risk_score += 35.0
                risk_score = min(risk_score, 100.0)
                
                hazards = []
                if convective: hazards.append("Convective Cells")
                if turbulence in ["Moderate", "Severe"]: hazards.append(f"{turbulence} Turbulence")
                if icing in ["Moderate", "Severe"]: hazards.append(f"{icing} Icing")
                dominant_hazard = ", ".join(hazards) if hazards else "No Significant Hazards"
                
            segments.append({
                "segment_index": i + 1,
                "name": leg["name"],
                "distance_pct": leg["distance_pct"],
                "weather_risk_score": float(risk_score),
                "dominant_hazard": dominant_hazard,
                "conditions": {
                    "convective_activity": convective,
                    "turbulence_level": turbulence,
                    "icing_forecast": icing,
                    "crosswind_component_kt": random.randint(5, 25)
                }
            })
            
        return segments

    @classmethod
    def compute_route_weather_score(cls, origin: str, destination: str) -> float:
        """
        Computes average weather risk score across all segments.
        """
        segments = cls.get_route_segments(origin, destination)
        if not segments:
            return 0.0
        # For safety context, weight the highest risk segment most heavily
        max_risk = max(s["weather_risk_score"] for s in segments)
        avg_risk = sum(s["weather_risk_score"] for s in segments) / len(segments)
        return float(round((max_risk * 0.7) + (avg_risk * 0.3), 1))
