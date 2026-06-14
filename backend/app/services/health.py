from typing import List, Dict, Any

class AircraftHealthService:
    @staticmethod
    def analyze_telemetry_trends(telemetry_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes time-series telemetry snapshots to identify parameter drift, anomaly detections,
        and failure probability curves.
        """
        if not telemetry_history:
            return {
                "health_score": 10.0,
                "status": "Healthy",
                "anomalies": [],
                "failure_forecast_24h": 0.01,
                "failure_forecast_7d": 0.05,
                "recommendations": []
            }
            
        # Extract latest parameters
        latest = telemetry_history[0] # Assumed sorted by timestamp descending
        
        anomalies = []
        recommendations = []
        health_score = 10.0
        
        # Check Hydraulic Pressure (Limit: > 2800 PSI, Normal: ~3000 PSI)
        hyd_press = latest.get("hydraulic_pressure")
        if hyd_press is not None:
            if hyd_press < 2800:
                anomalies.append({
                    "subsystem": "Hydraulic System",
                    "parameter": "Hydraulic Pressure",
                    "value": f"{hyd_press} PSI",
                    "severity": "Critical",
                    "message": "Hydraulic pressure dropped below minimum operational safety limit of 2800 PSI."
                })
                health_score += 55.0
                recommendations.append("Priority 1: Inspect hydraulic system for fluid leaks and replace pressure relief valve.")
            elif hyd_press < 2900:
                anomalies.append({
                    "subsystem": "Hydraulic System",
                    "parameter": "Hydraulic Pressure",
                    "value": f"{hyd_press} PSI",
                    "severity": "Warning",
                    "message": "Hydraulic pressure trending downwards below fleet baseline."
                })
                health_score += 20.0
                recommendations.append("Priority 2: Schedule hydraulic system pressure check during next scheduled maintenance halt.")
                
        # Check Engine Exhaust Gas Temperature (EGT) (Limit: < 650 C)
        egt = latest.get("engine_egt")
        if egt is not None:
            if egt > 665.0:
                anomalies.append({
                    "subsystem": "Engine (subsystem A)",
                    "parameter": "Exhaust Gas Temp (EGT)",
                    "value": f"{egt}°C",
                    "severity": "Warning",
                    "message": "Engine EGT exceeded normal operating limit of 650°C."
                })
                health_score += 35.0
                recommendations.append("Priority 2: Perform engine wash and inspect compressor path for degradation.")
            elif egt > 650.0:
                anomalies.append({
                    "subsystem": "Engine (subsystem A)",
                    "parameter": "Exhaust Gas Temp (EGT)",
                    "value": f"{egt}°C",
                    "severity": "Advisory",
                    "message": "Engine EGT showing minor elevation relative to historical profile."
                })
                health_score += 10.0
                recommendations.append("Priority 3: Monitor EGT trends during high-altitude cruise legs.")

        # Check Battery Charge (Limit: > 90% SoC)
        batt = latest.get("battery_charge")
        if batt is not None and batt < 90.0:
            anomalies.append({
                "subsystem": "Electrical System",
                "parameter": "Battery State of Charge",
                "value": f"{batt}%",
                "severity": "Warning",
                "message": "Main battery charge levels below fleet baseline limit."
            })
            health_score += 25.0
            recommendations.append("Priority 2: Replace main battery cell core at next layover.")

        # Clamp health score
        health_score = min(health_score, 100.0)
        
        # Determine Status
        status = "Healthy"
        if health_score >= 60.0:
            status = "Degraded"
        elif health_score >= 30.0:
            status = "Watch"
            
        # Map health score to failure probability curve
        # (higher health_score means higher risk/failure probability)
        failure_24h = min(round((health_score / 100.0) ** 2, 3), 0.95)
        failure_7d = min(round(failure_24h * 2.2, 3), 0.99)
        
        # Ensure at least a default low probability
        if failure_24h == 0.0: failure_24h = 0.005
        if failure_7d == 0.0: failure_7d = 0.02
        
        return {
            "health_score": float(health_score),
            "status": status,
            "anomalies": anomalies,
            "failure_forecast_24h": float(failure_24h),
            "failure_forecast_7d": float(failure_7d),
            "recommendations": recommendations
        }
