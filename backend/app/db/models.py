import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Operator(Base):
    __tablename__ = "operators"
    
    operator_id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    aircraft: Mapped[List["Aircraft"]] = relationship("Aircraft", back_populates="operator")
    flights: Mapped[List["Flight"]] = relationship("Flight", back_populates="operator")

class Aircraft(Base):
    __tablename__ = "aircraft"
    
    aircraft_id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    operator_id: Mapped[str] = mapped_column(String, ForeignKey("operators.operator_id"), nullable=False)
    tail_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    aircraft_type: Mapped[str] = mapped_column(String, nullable=False)
    current_health_status: Mapped[str] = mapped_column(String, default="Healthy") # Healthy, Watch, Degraded, Critical
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    operator: Mapped["Operator"] = relationship("Operator", back_populates="aircraft")
    flights: Mapped[List["Flight"]] = relationship("Flight", back_populates="aircraft")
    telemetry: Mapped[List["TelemetrySnapshot"]] = relationship("TelemetrySnapshot", back_populates="aircraft", cascade="all, delete-orphan")
    alerts: Mapped[List["Alert"]] = relationship("Alert", back_populates="aircraft", cascade="all, delete-orphan")

class Flight(Base):
    __tablename__ = "flights"
    
    flight_id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    operator_id: Mapped[str] = mapped_column(String, ForeignKey("operators.operator_id"), nullable=False)
    aircraft_id: Mapped[str] = mapped_column(String, ForeignKey("aircraft.aircraft_id"), nullable=False)
    flight_number: Mapped[str] = mapped_column(String, nullable=False)
    origin_airport: Mapped[str] = mapped_column(String, nullable=False)
    destination_airport: Mapped[str] = mapped_column(String, nullable=False)
    scheduled_departure: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    scheduled_arrival: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String, default="Scheduled") # Scheduled, Active, Completed, Cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    operator: Mapped["Operator"] = relationship("Operator", back_populates="flights")
    aircraft: Mapped["Aircraft"] = relationship("Aircraft", back_populates="flights")
    risk_scores: Mapped[List["RiskScore"]] = relationship("RiskScore", back_populates="flight", cascade="all, delete-orphan")
    alerts: Mapped[List["Alert"]] = relationship("Alert", back_populates="flight", cascade="all, delete-orphan")

class RiskScore(Base):
    __tablename__ = "risk_scores"
    
    risk_score_id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    flight_id: Mapped[str] = mapped_column(String, ForeignKey("flights.flight_id"), nullable=False)
    computed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    composite_score: Mapped[float] = mapped_column(Float, nullable=False)
    weather_sub_score: Mapped[float] = mapped_column(Float, nullable=False)
    aircraft_health_sub_score: Mapped[float] = mapped_column(Float, nullable=False)
    traffic_sub_score: Mapped[float] = mapped_column(Float, nullable=False)
    human_factor_sub_score: Mapped[float] = mapped_column(Float, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    model_version: Mapped[str] = mapped_column(String, default="v1.0.0-mvp")
    
    flight: Mapped["Flight"] = relationship("Flight", back_populates="risk_scores")

class Alert(Base):
    __tablename__ = "alerts"
    
    alert_id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    flight_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("flights.flight_id"), nullable=True)
    aircraft_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("aircraft.aircraft_id"), nullable=True)
    severity: Mapped[str] = mapped_column(String, nullable=False) # Info, Warning, Critical
    category: Mapped[str] = mapped_column(String, nullable=False) # Weather, System, Maintenance, Human
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    flight: Mapped[Optional["Flight"]] = relationship("Flight", back_populates="alerts")
    aircraft: Mapped[Optional["Aircraft"]] = relationship("Aircraft", back_populates="alerts")

class TelemetrySnapshot(Base):
    __tablename__ = "telemetry_snapshots"
    
    telemetry_id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    aircraft_id: Mapped[str] = mapped_column(String, ForeignKey("aircraft.aircraft_id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    engine_egt: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    oil_pressure: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    hydraulic_pressure: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    battery_charge: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    aircraft: Mapped["Aircraft"] = relationship("Aircraft", back_populates="telemetry")
