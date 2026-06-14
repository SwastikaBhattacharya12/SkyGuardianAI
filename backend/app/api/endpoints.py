from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

from app.db.session import get_db
from app.db.models import Flight, Aircraft, RiskScore, Alert, TelemetrySnapshot
from app.services.weather import WeatherService
from app.services.health import AircraftHealthService
from app.services.risk import RiskEngine
from app.services.assistant import GeminiAssistant

router = APIRouter()
assistant_service = GeminiAssistant()

# Pydantic Schemas for API responses
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    response: str

@router.get("/flights")
def get_flights(db: Session = Depends(get_db)):
    flights = db.query(Flight).all()
    results = []
    for f in flights:
        # Get latest computed risk score
        latest_score = db.query(RiskScore).filter(RiskScore.flight_id == f.flight_id).order_by(RiskScore.computed_at.desc()).first()
        # Count unresolved alerts
        alert_count = db.query(Alert).filter(Alert.flight_id == f.flight_id, Alert.is_resolved == False).count()
        
        results.append({
            "flight_id": f.flight_id,
            "flight_number": f.flight_number,
            "origin_airport": f.origin_airport,
            "destination_airport": f.destination_airport,
            "scheduled_departure": f.scheduled_departure.isoformat(),
            "scheduled_arrival": f.scheduled_arrival.isoformat(),
            "status": f.status,
            "aircraft_tail": f.aircraft.tail_number,
            "aircraft_type": f.aircraft.aircraft_type,
            "health_status": f.aircraft.current_health_status,
            "composite_risk": float(latest_score.composite_score) if latest_score else 0.0,
            "alert_count": alert_count
        })
    # Sort: Scheduled/Active first, then by risk score descending
    results.sort(key=lambda x: (x["status"] == "Completed", -x["composite_risk"]))
    return results

@router.get("/flights/{flight_id}")
def get_flight_detail(flight_id: str, db: Session = Depends(get_db)):
    f = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Flight not found")
        
    latest_score = db.query(RiskScore).filter(RiskScore.flight_id == f.flight_id).order_by(RiskScore.computed_at.desc()).first()
    alerts = db.query(Alert).filter(Alert.flight_id == f.flight_id, Alert.is_resolved == False).all()
    
    # Fetch aircraft telemetry history
    telemetry_history = db.query(TelemetrySnapshot).filter(TelemetrySnapshot.aircraft_id == f.aircraft_id).order_by(TelemetrySnapshot.timestamp.desc()).limit(15).all()
    telemetry_data = [{
        "timestamp": t.timestamp.isoformat(),
        "engine_egt": t.engine_egt,
        "oil_pressure": t.oil_pressure,
        "hydraulic_pressure": t.hydraulic_pressure,
        "battery_charge": t.battery_charge
    } for t in telemetry_history]
    
    # Calculate route segments
    segments = WeatherService.get_route_segments(f.origin_airport, f.destination_airport)
    
    # Parse explanation
    explanation = latest_score.explanation if latest_score else "No explanation available."
    sub_scores = {
        "weather": float(latest_score.weather_sub_score) if latest_score else 0.0,
        "health": float(latest_score.aircraft_health_sub_score) if latest_score else 0.0,
        "traffic": float(latest_score.traffic_sub_score) if latest_score else 0.0,
        "human": float(latest_score.human_factor_sub_score) if latest_score else 0.0
    }
    
    return {
        "flight_id": f.flight_id,
        "flight_number": f.flight_number,
        "origin_airport": f.origin_airport,
        "destination_airport": f.destination_airport,
        "scheduled_departure": f.scheduled_departure.isoformat(),
        "scheduled_arrival": f.scheduled_arrival.isoformat(),
        "status": f.status,
        "aircraft": {
            "tail_number": f.aircraft.tail_number,
            "type": f.aircraft.aircraft_type,
            "health_status": f.aircraft.current_health_status
        },
        "composite_risk": float(latest_score.composite_score) if latest_score else 0.0,
        "sub_scores": sub_scores,
        "explanation": explanation,
        "alerts": [{"category": a.category, "severity": a.severity, "message": a.message} for a in alerts],
        "telemetry_history": telemetry_data,
        "route_segments": segments
    }

@router.get("/alerts")
def get_all_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.is_resolved == False).order_by(Alert.created_at.desc()).all()
    return [{
        "alert_id": a.alert_id,
        "flight_number": a.flight.flight_number if a.flight else "N/A",
        "tail_number": a.aircraft.tail_number if a.aircraft else "N/A",
        "severity": a.severity,
        "category": a.category,
        "message": a.message,
        "created_at": a.created_at.isoformat()
    } for a in alerts]

@router.get("/aircraft/health")
def get_fleet_health(db: Session = Depends(get_db)):
    aircraft_list = db.query(Aircraft).all()
    results = []
    for ac in aircraft_list:
        latest_telemetry = db.query(TelemetrySnapshot).filter(TelemetrySnapshot.aircraft_id == ac.aircraft_id).order_by(TelemetrySnapshot.timestamp.desc()).first()
        
        # Calculate details using the health service
        history_dicts = []
        if latest_telemetry:
            history_dicts.append({
                "engine_egt": latest_telemetry.engine_egt,
                "oil_pressure": latest_telemetry.oil_pressure,
                "hydraulic_pressure": latest_telemetry.hydraulic_pressure,
                "battery_charge": latest_telemetry.battery_charge
            })
            
        analysis = AircraftHealthService.analyze_telemetry_trends(history_dicts)
        
        results.append({
            "aircraft_id": ac.aircraft_id,
            "tail_number": ac.tail_number,
            "aircraft_type": ac.aircraft_type,
            "current_health_status": ac.current_health_status,
            "health_score": analysis["health_score"],
            "failure_forecast_24h": analysis["failure_forecast_24h"],
            "failure_forecast_7d": analysis["failure_forecast_7d"],
            "anomalies": analysis["anomalies"],
            "recommendations": analysis["recommendations"],
            "latest_telemetry": {
                "engine_egt": latest_telemetry.engine_egt if latest_telemetry else None,
                "oil_pressure": latest_telemetry.oil_pressure if latest_telemetry else None,
                "hydraulic_pressure": latest_telemetry.hydraulic_pressure if latest_telemetry else None,
                "battery_charge": latest_telemetry.battery_charge if latest_telemetry else None,
            }
        })
    return results

@router.post("/assistant/query", response_model=QueryResponse)
def query_assistant(req: QueryRequest, db: Session = Depends(get_db)):
    # Build active flights and warnings context dynamically for RAG
    flights = db.query(Flight).filter(Flight.status != "Completed").all()
    context_blocks = []
    for f in flights:
        latest_score = db.query(RiskScore).filter(RiskScore.flight_id == f.flight_id).order_by(RiskScore.computed_at.desc()).first()
        active_alerts = db.query(Alert).filter(Alert.flight_id == f.flight_id, Alert.is_resolved == False).all()
        
        score_text = f"Composite Risk: {latest_score.composite_score}/100" if latest_score else "No score"
        alerts_text = "; ".join(a.message for a in active_alerts) if active_alerts else "None"
        
        latest_tel = db.query(TelemetrySnapshot).filter(TelemetrySnapshot.aircraft_id == f.aircraft_id).order_by(TelemetrySnapshot.timestamp.desc()).first()
        telemetry_text = f"EGT: {latest_tel.engine_egt}C, Hyd Press: {latest_tel.hydraulic_pressure}PSI" if latest_tel else "N/A"
        
        context_blocks.append(
            f"- Flight {f.flight_number} ({f.origin_airport} -> {f.destination_airport}) | "
            f"Tail: {f.aircraft.tail_number} ({f.aircraft.aircraft_type}, Health Status: {f.aircraft.current_health_status}) | "
            f"Scores: {score_text} | Telemetry: {telemetry_text} | Warnings: {alerts_text}"
        )
        
    context_data = "\n".join(context_blocks)
    answer = assistant_service.query(req.question, context_data)
    return QueryResponse(response=answer)

@router.post("/simulator/tick")
def trigger_simulator_tick(db: Session = Depends(get_db)):
    """
    Simulates a deterioration event on Tail number XY-123 (hydraulic leak)
    and engine EGT drift on N456SG to show live dashboard updates.
    """
    # 1. Update XY-123 (A320)
    ac_xy = db.query(Aircraft).filter(Aircraft.tail_number == "XY-123").first()
    if ac_xy:
        # Get latest telemetry
        latest = db.query(TelemetrySnapshot).filter(TelemetrySnapshot.aircraft_id == ac_xy.aircraft_id).order_by(TelemetrySnapshot.timestamp.desc()).first()
        current_pressure = latest.hydraulic_pressure if latest else 2850.0
        # Drop pressure by 35 PSI
        new_pressure = max(current_pressure - 35.0, 2600.0)
        
        new_tel = TelemetrySnapshot(
            aircraft_id=ac_xy.aircraft_id,
            timestamp=datetime.utcnow(),
            engine_egt=625.0,
            oil_pressure=54.0,
            hydraulic_pressure=new_pressure,
            battery_charge=97.0
        )
        db.add(new_tel)
        
        # Analyze health
        analysis = AircraftHealthService.analyze_telemetry_trends([{
            "engine_egt": new_tel.engine_egt,
            "oil_pressure": new_tel.oil_pressure,
            "hydraulic_pressure": new_tel.hydraulic_pressure,
            "battery_charge": new_tel.battery_charge
        }])
        
        ac_xy.current_health_status = analysis["status"]
        db.flush()
        
        # Update flight risk score for Flight AI102
        fl_ai = db.query(Flight).filter(Flight.aircraft_id == ac_xy.aircraft_id, Flight.status != "Completed").first()
        if fl_ai:
            w_score = WeatherService.compute_route_weather_score(fl_ai.origin_airport, fl_ai.destination_airport)
            h_score = analysis["health_score"]
            # Recalculate Risk
            risk_calc = RiskEngine.calculate_composite_risk(w_score, h_score, 40.0, 45.0)
            
            new_score = RiskScore(
                flight_id=fl_ai.flight_id,
                composite_score=risk_calc["composite_score"],
                weather_sub_score=risk_calc["weather_sub_score"],
                aircraft_health_sub_score=risk_calc["aircraft_health_sub_score"],
                traffic_sub_score=risk_calc["traffic_sub_score"],
                human_factor_sub_score=risk_calc["human_factor_sub_score"],
                explanation=risk_calc["explanation"]
            )
            db.add(new_score)
            
            # Check if alert needs update
            existing_maint_alert = db.query(Alert).filter(
                Alert.flight_id == fl_ai.flight_id,
                Alert.category == "Maintenance",
                Alert.is_resolved == False
            ).first()
            
            alert_msg = f"Hydraulic pressure critical threshold breached ({round(new_pressure)} PSI). Failure probability is {round(analysis['failure_forecast_24h']*100)}% over next 24 flight hours."
            if existing_maint_alert:
                existing_maint_alert.message = alert_msg
                existing_maint_alert.severity = "Critical" if new_pressure < 2750.0 else "Warning"
            else:
                db.add(Alert(
                    flight_id=fl_ai.flight_id,
                    aircraft_id=ac_xy.aircraft_id,
                    severity="Critical" if new_pressure < 2750.0 else "Warning",
                    category="Maintenance",
                    message=alert_msg
                ))

    # 2. Update N456SG (Elevated EGT)
    ac_n45 = db.query(Aircraft).filter(Aircraft.tail_number == "N456SG").first()
    if ac_n45:
        latest_n = db.query(TelemetrySnapshot).filter(TelemetrySnapshot.aircraft_id == ac_n45.aircraft_id).order_by(TelemetrySnapshot.timestamp.desc()).first()
        current_egt = latest_n.engine_egt if latest_n else 650.0
        # Drift EGT up by 5 degrees
        new_egt = min(current_egt + 5.0, 710.0)
        
        new_tel_n = TelemetrySnapshot(
            aircraft_id=ac_n45.aircraft_id,
            timestamp=datetime.utcnow(),
            engine_egt=new_egt,
            oil_pressure=58.5,
            hydraulic_pressure=3005.0,
            battery_charge=94.5
        )
        db.add(new_tel_n)
        
        analysis_n = AircraftHealthService.analyze_telemetry_trends([{
            "engine_egt": new_tel_n.engine_egt,
            "oil_pressure": new_tel_n.oil_pressure,
            "hydraulic_pressure": new_tel_n.hydraulic_pressure,
            "battery_charge": new_tel_n.battery_charge
        }])
        ac_n45.current_health_status = analysis_n["status"]
        
        fl_sg = db.query(Flight).filter(Flight.aircraft_id == ac_n45.aircraft_id, Flight.status != "Completed").first()
        if fl_sg:
            w_score = WeatherService.compute_route_weather_score(fl_sg.origin_airport, fl_sg.destination_airport)
            h_score = analysis_n["health_score"]
            risk_calc_n = RiskEngine.calculate_composite_risk(w_score, h_score, 35.0, 30.0)
            
            new_score_n = RiskScore(
                flight_id=fl_sg.flight_id,
                composite_score=risk_calc_n["composite_score"],
                weather_sub_score=risk_calc_n["weather_sub_score"],
                aircraft_health_sub_score=risk_calc_n["aircraft_health_sub_score"],
                traffic_sub_score=risk_calc_n["traffic_sub_score"],
                human_factor_sub_score=risk_calc_n["human_factor_sub_score"],
                explanation=risk_calc_n["explanation"]
            )
            db.add(new_score_n)
            
            existing_maint_alert_n = db.query(Alert).filter(
                Alert.flight_id == fl_sg.flight_id,
                Alert.category == "Maintenance",
                Alert.is_resolved == False
            ).first()
            
            alert_msg_n = f"Engine Exhaust Gas Temperature is dangerously high ({round(new_egt)}°C) exceeding OEM baseline limit of 650°C."
            if existing_maint_alert_n:
                existing_maint_alert_n.message = alert_msg_n
                existing_maint_alert_n.severity = "Critical" if new_egt > 685.0 else "Warning"
            else:
                db.add(Alert(
                    flight_id=fl_sg.flight_id,
                    aircraft_id=ac_n45.aircraft_id,
                    severity="Warning",
                    category="Maintenance",
                    message=alert_msg_n
                ))
                
    db.commit()
    return {"status": "success", "message": "Simulation tick completed successfully"}
