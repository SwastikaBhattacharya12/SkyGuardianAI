import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import engine, Base, SessionLocal
from app.db.models import Operator, Aircraft, Flight, RiskScore, Alert, TelemetrySnapshot

def seed_db():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding database...")
        
        # 1. Operators
        op = Operator(name="SkyGuardian Airways")
        db.add(op)
        db.flush() # Populate op.operator_id
        
        # 2. Aircraft
        ac1 = Aircraft(
            operator_id=op.operator_id,
            tail_number="XY-123",
            aircraft_type="A320-200",
            current_health_status="Degraded" # Anomaly in hydraulic system
        )
        ac2 = Aircraft(
            operator_id=op.operator_id,
            tail_number="N987SG",
            aircraft_type="B737-800",
            current_health_status="Healthy"
        )
        ac3 = Aircraft(
            operator_id=op.operator_id,
            tail_number="N456SG",
            aircraft_type="B787-9",
            current_health_status="Watch" # Elevated EGT
        )
        ac4 = Aircraft(
            operator_id=op.operator_id,
            tail_number="N222SG",
            aircraft_type="A321neo",
            current_health_status="Healthy"
        )
        ac5 = Aircraft(
            operator_id=op.operator_id,
            tail_number="N333SG",
            aircraft_type="A350-900",
            current_health_status="Healthy"
        )
        db.add_all([ac1, ac2, ac3, ac4, ac5])
        db.flush()
        
        # 3. Telemetry Snapshots (Generate history)
        now = datetime.utcnow()
        telemetries = []
        
        # XY-123: Hydraulic pressure degradation trend (Normal is 3000 PSI)
        for i in range(10):
            t = now - timedelta(hours=i)
            # Pressure drops from 2950 down to 2710 (Threshold breach is < 2800)
            pressure = 2710 + (i * 25) 
            telemetries.append(TelemetrySnapshot(
                aircraft_id=ac1.aircraft_id,
                timestamp=t,
                engine_egt=620.0 + (i * 2),
                oil_pressure=55.0,
                hydraulic_pressure=float(pressure),
                battery_charge=98.0
            ))
            
        # N456SG: Engine Exhaust Gas Temp (EGT) rising trend (Normal is < 650C)
        for i in range(10):
            t = now - timedelta(hours=i)
            egt = 675.0 - (i * 3.5) # Rises from 643 up to 675 over last 10 hours
            telemetries.append(TelemetrySnapshot(
                aircraft_id=ac3.aircraft_id,
                timestamp=t,
                engine_egt=float(egt),
                oil_pressure=58.0,
                hydraulic_pressure=3010.0,
                battery_charge=95.0
            ))
            
        # Others: Healthy
        for ac in [ac2, ac4, ac5]:
            for i in range(5):
                t = now - timedelta(hours=i)
                telemetries.append(TelemetrySnapshot(
                    aircraft_id=ac.aircraft_id,
                    timestamp=t,
                    engine_egt=580.0,
                    oil_pressure=60.0,
                    hydraulic_pressure=3000.0,
                    battery_charge=99.0
                ))
        db.add_all(telemetries)
        db.flush()
        
        # 4. Flights
        # Flight AI102: operated by XY-123 (JFK to LHR), active weather hazard enroute
        f1 = Flight(
            operator_id=op.operator_id,
            aircraft_id=ac1.aircraft_id,
            flight_number="AI102",
            origin_airport="KJFK",
            destination_airport="EGLL",
            scheduled_departure=now + timedelta(hours=2),
            scheduled_arrival=now + timedelta(hours=9),
            status="Scheduled"
        )
        # Flight SG202: operated by N456SG (Watch)
        f2 = Flight(
            operator_id=op.operator_id,
            aircraft_id=ac3.aircraft_id,
            flight_number="SG202",
            origin_airport="KORD",
            destination_airport="KLAX",
            scheduled_departure=now + timedelta(hours=4),
            scheduled_arrival=now + timedelta(hours=8),
            status="Scheduled"
        )
        # Flight SG303: operated by N987SG (JFK to MIA)
        f3 = Flight(
            operator_id=op.operator_id,
            aircraft_id=ac2.aircraft_id,
            flight_number="SG303",
            origin_airport="KJFK",
            destination_airport="KMIA",
            scheduled_departure=now - timedelta(minutes=45),
            scheduled_arrival=now + timedelta(hours=2),
            status="Active"
        )
        # Flight SG404: operated by N222SG (SFO to SEA)
        f4 = Flight(
            operator_id=op.operator_id,
            aircraft_id=ac4.aircraft_id,
            flight_number="SG404",
            origin_airport="KSFO",
            destination_airport="KSEA",
            scheduled_departure=now + timedelta(hours=6),
            scheduled_arrival=now + timedelta(hours=8),
            status="Scheduled"
        )
        # Flight SG505: completed
        f5 = Flight(
            operator_id=op.operator_id,
            aircraft_id=ac5.aircraft_id,
            flight_number="SG505",
            origin_airport="KDFW",
            destination_airport="KDEN",
            scheduled_departure=now - timedelta(hours=6),
            scheduled_arrival=now - timedelta(hours=4),
            status="Completed"
        )
        db.add_all([f1, f2, f3, f4, f5])
        db.flush()
        
        # 5. Alerts
        # XY-123 Alerts: Weather wind-shear and Hydraulic system Degradation
        al1 = Alert(
            flight_id=f1.flight_id,
            aircraft_id=ac1.aircraft_id,
            severity="Critical",
            category="Weather",
            message="Severe convective activity and potential wind-shear forecasted near EGLL arrival window."
        )
        al2 = Alert(
            flight_id=f1.flight_id,
            aircraft_id=ac1.aircraft_id,
            severity="Warning",
            category="Maintenance",
            message="Hydraulic pressure trend anomaly detected (2710 PSI). Component failure forecasted within 48 flight-hours."
        )
        # N456SG Alerts: High EGT
        al3 = Alert(
            flight_id=f2.flight_id,
            aircraft_id=ac3.aircraft_id,
            severity="Warning",
            category="Maintenance",
            message="Engine Exhaust Gas Temperature (EGT) exceeding baseline limits (675C vs 650C normal limit)."
        )
        db.add_all([al1, al2, al3])
        db.flush()
        
        # 6. Risk Scores
        # Flight AI102: 68/100 risk score
        r1 = RiskScore(
            flight_id=f1.flight_id,
            composite_score=68.0,
            weather_sub_score=85.0,        # Severe windshear alert
            aircraft_health_sub_score=75.0, # Hydraulic pressure warning
            traffic_sub_score=40.0,
            human_factor_sub_score=45.0,
            explanation=(
                "Elevated composite risk score of 68/100 is driven by:\n"
                "1. Critical weather alert (severe convective storm/windshear at EGLL) contributing 85.0 weather sub-score.\n"
                "2. System degradation in hydraulic pressure (2710 PSI) contributing 75.0 aircraft health sub-score."
            )
        )
        # Flight SG202: 45/100 risk score
        r2 = RiskScore(
            flight_id=f2.flight_id,
            composite_score=45.0,
            weather_sub_score=20.0,
            aircraft_health_sub_score=68.0, # High EGT
            traffic_sub_score=35.0,
            human_factor_sub_score=30.0,
            explanation=(
                "Moderate composite risk score of 45/100 is primarily driven by "
                "aircraft engine EGT alert (675C) on N456SG."
            )
        )
        # Flight SG303: 15/100 risk score
        r3 = RiskScore(
            flight_id=f3.flight_id,
            composite_score=15.0,
            weather_sub_score=10.0,
            aircraft_health_sub_score=15.0,
            traffic_sub_score=20.0,
            human_factor_sub_score=15.0,
            explanation="Low composite risk score of 15/100. Routine operational parameters."
        )
        # Flight SG404: 12/100 risk score
        r4 = RiskScore(
            flight_id=f4.flight_id,
            composite_score=12.0,
            weather_sub_score=15.0,
            aircraft_health_sub_score=10.0,
            traffic_sub_score=10.0,
            human_factor_sub_score=10.0,
            explanation="Normal flight release status."
        )
        
        db.add_all([r1, r2, r3, r4])
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
