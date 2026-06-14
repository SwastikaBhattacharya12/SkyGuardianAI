const B = require('./build');
const {
  Paragraph, TextRun, AlignmentType, BorderStyle, WidthType,
  h1, h2, h3, p, pBold, bullet, bulletRich, numbered, pageBreak, divider, makeTable, COLORS, FULL_WIDTH
} = B;

const content = [];

// ================= 7. SYSTEM ARCHITECTURE =================
content.push(h1("7. System Architecture"));

content.push(p(
  "SkyGuardian AI is designed as a cloud-native, microservices-based platform organized into six logical " +
  "layers: Data Ingestion, Data Pipeline, Storage, AI/ML, Application/API, and Presentation. Each layer " +
  "is independently deployable and scalable, enabling the platform to start small (pilot deployments with " +
  "a handful of aircraft) and scale to fleet-wide, multi-operator deployments without redesign."
));

content.push(h2("7.1 Architectural Layers"));

content.push(h3("Layer 1 — Data Ingestion"));
content.push(bullet("Connectors for aircraft telemetry feeds (ACARS/ACMS or OEM health-monitoring exports), weather data providers, flight planning systems, maintenance/MRO systems, air traffic data feeds, and pilot report (PIREP/ASR) sources."));
content.push(bullet("Each connector normalizes incoming data into a common schema and publishes to a streaming message bus."));
content.push(bullet("Supports both real-time streaming (telemetry, weather updates) and batch/periodic ingestion (maintenance records, scheduled flight plans)."));

content.push(h3("Layer 2 — Data Pipeline"));
content.push(bullet("Stream processing for real-time anomaly detection and risk-score updates."));
content.push(bullet("Batch processing for model training data preparation, historical trend computation, and report generation."));
content.push(bullet("Data quality and validation services that flag missing, stale, or out-of-range data before it reaches the AI layer."));

content.push(h3("Layer 3 — Storage"));
content.push(bullet("Time-series database for high-frequency telemetry and sensor data."));
content.push(bullet("Relational database for structured operational data (flights, aircraft, maintenance records, users, configuration)."));
content.push(bullet("Object storage for large unstructured artifacts (raw telemetry exports, model artifacts, generated reports)."));
content.push(bullet("Search/index layer for fast retrieval of pilot reports and unstructured text (PIREPs, maintenance notes) used by the AI Safety Assistant."));

content.push(h3("Layer 4 — AI/ML Layer"));
content.push(bullet("Risk scoring service combining outputs from specialized models (weather risk, aircraft health, traffic, human-factor) into the composite risk score."));
content.push(bullet("Time-series forecasting models for component health and weather-derived hazards."));
content.push(bullet("Anomaly detection models for telemetry streams."));
content.push(bullet("Explainability service that generates human-readable reasoning for risk scores and assistant responses."));
content.push(bullet("Natural-language interface service (AI Safety Assistant) built on a large language model with retrieval-augmented access to platform data."));

content.push(h3("Layer 5 — Application / API Layer"));
content.push(bullet("REST and event-driven (webhook) APIs exposing risk scores, alerts, health forecasts, and assistant queries to internal frontends and external integrations (e.g., EFB apps, third-party dispatch tools)."));
content.push(bullet("Authentication, authorization, and tenant-isolation services for multi-operator deployments."));
content.push(bullet("Alerting and notification service (email, SMS, push, webhook) for active alerts."));

content.push(h3("Layer 6 — Presentation"));
content.push(bullet("Web-based Safety Dashboard (responsive, role-aware)."));
content.push(bullet("Mobile/EFB companion view for pilots and field maintenance personnel."));
content.push(bullet("Embedded AI Safety Assistant chat interface across all surfaces."));

content.push(h2("7.2 High-Level Architecture Diagram (Description)"));
content.push(p(
  "External data sources (weather providers, aircraft telemetry feeds, MRO systems, ATC/traffic feeds, " +
  "flight planning systems, PIREP sources) flow into the Data Ingestion layer via dedicated connectors. " +
  "Normalized data is published to a streaming bus, consumed by the Data Pipeline layer for real-time " +
  "processing and by batch jobs for historical aggregation. Processed data lands in the Storage layer " +
  "(time-series DB, relational DB, object storage, search index). The AI/ML layer reads from storage to " +
  "compute risk scores, forecasts, and explanations, writing results back to the relational database and " +
  "an alerts queue. The Application/API layer exposes this data to the Presentation layer (Safety " +
  "Dashboard, mobile/EFB, AI Assistant) and to external integrations via API. A Security layer (identity, " +
  "encryption, audit logging) spans all layers."
));

content.push(h2("7.3 Security Layer"));
content.push(bullet("Identity and access management (IAM) with SSO/SAML support for enterprise customers."));
content.push(bullet("Role-based access control enforced at the API gateway and data-access layers."));
content.push(bullet("End-to-end encryption (TLS in transit, AES-256 at rest) across all storage and messaging components."));
content.push(bullet("Centralized audit logging for all data access, configuration changes, and AI-generated outputs."));
content.push(bullet("Network segmentation between tenant environments in multi-operator deployments, with optional dedicated-tenant deployment for large enterprise customers."));

content.push(pageBreak());

// ================= 8. DATABASE DESIGN =================
content.push(h1("8. Database Design"));

content.push(p(
  "SkyGuardian AI uses a polyglot persistence approach: a relational database for structured operational " +
  "entities, a time-series database for high-frequency telemetry, and object/search storage for " +
  "unstructured content. Below is a representative entity model for the relational layer."
));

content.push(h2("8.1 Core Entity Overview"));
content.push(makeTable(
  [2200, 7160],
  ["Entity", "Description"],
  [
    ["Operator", "An airline or aviation operator tenant; root of multi-tenant data isolation"],
    ["Aircraft", "Tail-number-level record including type, configuration, and OEM identifiers"],
    ["Flight", "A scheduled or active flight instance, linked to Aircraft, Route, and Crew"],
    ["Route", "A planned flight path composed of ordered Route Legs"],
    ["RouteLeg", "A segment of a route with associated weather risk data"],
    ["TelemetrySnapshot", "Time-series reference linking an Aircraft to telemetry records in the time-series store"],
    ["MaintenanceRecord", "Maintenance event, deferral, or inspection associated with an Aircraft"],
    ["PilotReport", "Unstructured or semi-structured report (PIREP/ASR) linked to a Flight or Aircraft"],
    ["RiskScore", "Versioned risk score record for a Flight at a point in time, including sub-scores"],
    ["Alert", "An active or historical safety alert linked to a Flight, Aircraft, or Route"],
    ["User", "Platform user with role and Operator association"],
    ["AssistantQueryLog", "Log of AI Safety Assistant queries and responses for audit"],
  ]
));

content.push(h2("8.2 Representative Schema (Relational)"));

content.push(h3("aircraft"));
content.push(makeTable(
  [2200, 1800, 5360],
  ["Column", "Type", "Notes"],
  [
    ["aircraft_id", "UUID (PK)", "Primary key"],
    ["operator_id", "UUID (FK)", "References operator.operator_id"],
    ["tail_number", "VARCHAR(10)", "Unique within operator"],
    ["aircraft_type", "VARCHAR(50)", "e.g., A320, B737-800"],
    ["manufacture_date", "DATE", ""],
    ["current_health_status", "VARCHAR(20)", "Derived: Healthy / Watch / Degraded / Critical"],
    ["created_at / updated_at", "TIMESTAMP", "Standard audit columns"],
  ]
));

content.push(h3("flight"));
content.push(makeTable(
  [2200, 1800, 5360],
  ["Column", "Type", "Notes"],
  [
    ["flight_id", "UUID (PK)", "Primary key"],
    ["operator_id", "UUID (FK)", "References operator.operator_id"],
    ["aircraft_id", "UUID (FK)", "References aircraft.aircraft_id"],
    ["flight_number", "VARCHAR(10)", "e.g., AI102"],
    ["scheduled_departure", "TIMESTAMP", ""],
    ["scheduled_arrival", "TIMESTAMP", ""],
    ["origin_airport / destination_airport", "VARCHAR(4)", "ICAO codes"],
    ["status", "VARCHAR(20)", "Scheduled / Active / Completed / Cancelled"],
    ["current_risk_score_id", "UUID (FK)", "References latest risk_score record"],
  ]
));

content.push(h3("risk_score"));
content.push(makeTable(
  [2200, 1800, 5360],
  ["Column", "Type", "Notes"],
  [
    ["risk_score_id", "UUID (PK)", "Primary key"],
    ["flight_id", "UUID (FK)", "References flight.flight_id"],
    ["computed_at", "TIMESTAMP", "Score computation time"],
    ["composite_score", "DECIMAL(5,2)", "0–100"],
    ["weather_sub_score", "DECIMAL(5,2)", ""],
    ["aircraft_health_sub_score", "DECIMAL(5,2)", ""],
    ["traffic_sub_score", "DECIMAL(5,2)", ""],
    ["human_factor_sub_score", "DECIMAL(5,2)", ""],
    ["model_version", "VARCHAR(20)", "For auditability/reproducibility"],
    ["explanation_ref", "UUID (FK)", "References explanation record"],
  ]
));

content.push(h3("maintenance_record"));
content.push(makeTable(
  [2200, 1800, 5360],
  ["Column", "Type", "Notes"],
  [
    ["maintenance_record_id", "UUID (PK)", "Primary key"],
    ["aircraft_id", "UUID (FK)", "References aircraft.aircraft_id"],
    ["record_type", "VARCHAR(30)", "Scheduled / Unscheduled / Deferral / Inspection"],
    ["component", "VARCHAR(100)", "Affected component/system"],
    ["status", "VARCHAR(20)", "Open / Resolved / Deferred"],
    ["recorded_at", "TIMESTAMP", ""],
    ["ai_recommendation_ref", "UUID (FK, nullable)", "Links to AI-generated recommendation, if applicable"],
  ]
));

content.push(h2("8.3 Time-Series Data Model"));
content.push(p(
  "High-frequency telemetry (engine parameters, hydraulic pressures, electrical bus voltages, battery " +
  "state-of-health) is stored in a time-series database optimized for high write throughput and " +
  "downsampled query performance. Each record is tagged with aircraft_id, parameter_name, flight_id " +
  "(where applicable), and timestamp, with the numeric value and data-quality flag as fields. Continuous " +
  "aggregates (e.g., 1-minute and 1-hour rollups) are maintained for dashboard rendering and trend " +
  "analysis without scanning raw high-frequency data."
));

content.push(pageBreak());

// ================= 9. AI ARCHITECTURE =================
content.push(h1("9. AI Architecture"));

content.push(h2("9.1 Model Portfolio Overview"));
content.push(p(
  "SkyGuardian AI's intelligence layer is composed of a portfolio of specialized models rather than a " +
  "single monolithic model. This improves explainability (each sub-score traces to a specific model), " +
  "supports independent retraining and validation, and aligns with regulatory expectations for " +
  "auditable AI in safety-critical contexts."
));

content.push(makeTable(
  [2600, 2900, 3860],
  ["Model", "Technique", "Purpose"],
  [
    ["Aircraft Health Forecasting", "Time-series forecasting (e.g., gradient-boosted trees and temporal models such as LSTM/Temporal Fusion Transformer variants)", "Forecast component health trajectories and failure probabilities across 24h / 7d / 30 flight-hour horizons"],
    ["Telemetry Anomaly Detection", "Unsupervised anomaly detection (e.g., isolation forests, autoencoders) on time-series telemetry", "Flag deviations from fleet-baseline behavior in near real-time"],
    ["Weather Risk Scoring", "Ensemble of statistical and ML models combining numerical weather prediction (NWP) outputs with route geometry", "Produce per-leg weather risk scores and hazard classifications"],
    ["Traffic / Airspace Risk", "Rule-based and ML-assisted scoring using ATC and airspace congestion data", "Estimate operational risk from traffic density, airspace restrictions, and schedule compression"],
    ["Human-Factor Risk", "Rule-based scoring augmented with NLP analysis of pilot reports", "Estimate risk contribution from crew duty-time proximity and patterns in PIREPs/ASRs"],
    ["Composite Risk Scoring", "Weighted ensemble / learned aggregation model", "Combine sub-scores into the composite 0–100 risk score"],
    ["Explainability Engine", "Feature-attribution methods (e.g., SHAP-style attribution) plus templated natural-language generation", "Translate model outputs into human-readable reasoning"],
    ["AI Safety Assistant (NLU/NLG)", "Large language model with retrieval-augmented generation (RAG) over platform data and explanation records", "Conversational interface for natural-language queries"],
  ]
));

content.push(h2("9.2 Time-Series Forecasting Approach"));
content.push(p(
  "Component health forecasting models are trained per-component-class (e.g., 'CFM56 engine bleed valve', " +
  "'A320 hydraulic pump') using historical telemetry labeled with eventual maintenance outcomes. Models " +
  "produce both a point forecast (expected parameter trajectory) and a failure probability curve over the " +
  "forecast horizon. Fleet-wide baselines are continuously recalibrated as new operating data arrives, " +
  "and model drift is monitored via tracked prediction-error metrics."
));

content.push(h2("9.3 Anomaly Detection Approach"));
content.push(p(
  "Real-time telemetry streams are scored against fleet-baseline distributions using unsupervised " +
  "anomaly detection. Anomalies are classified by severity (statistical deviation magnitude) and " +
  "persistence (transient vs. sustained), with sustained anomalies triggering downstream risk-score " +
  "updates and, where confidence is high, maintenance recommendations."
));

content.push(h2("9.4 Risk Scoring Methodology"));
content.push(p(
  "The composite risk score is computed as a weighted aggregation of the four sub-scores (weather, " +
  "aircraft health, traffic, human-factor). Default weights are derived from historical correlation with " +
  "labeled incident/precursor data and can be adjusted per operator, fleet type, or route category by " +
  "safety officers within configured bounds. Each sub-score is itself a normalized 0–100 value, allowing " +
  "weights to be interpreted directly as relative contribution percentages."
));

content.push(p(
  "Incident probability estimates are derived by mapping composite and sub-scores, plus contextual " +
  "features (season, route history, aircraft age), to historical incident/precursor base rates using a " +
  "calibrated probabilistic model, producing both a point estimate and a confidence interval."
));

content.push(h2("9.5 Explainable AI Mechanisms"));
content.push(bullet("Feature attribution: every sub-score is decomposed into the top contributing input features (e.g., 'oil temperature trend +0.8°C/hr above baseline contributed 35% of the aircraft health sub-score increase')."));
content.push(bullet("Model version tagging: every output is tagged with the exact model version used, enabling reproducibility for audits and incident investigations."));
content.push(bullet("Natural-language explanation generation: feature attributions are translated into plain-language summaries via templated NLG, reviewed for consistency, and surfaced in both the dashboard and AI Safety Assistant."));
content.push(bullet("Confidence reporting: all predictions include confidence levels or intervals, with low-confidence outputs flagged distinctly in the UI rather than presented with false certainty."));

content.push(h2("9.6 AI Safety Assistant Design"));
content.push(p(
  "The AI Safety Assistant is built on a large language model augmented with retrieval-augmented " +
  "generation (RAG) over a curated index of platform data: current risk scores and sub-scores, " +
  "explanation records, aircraft health summaries, active alerts, and relevant pilot reports. The " +
  "assistant is constrained to ground its responses in retrieved platform data and explicitly declines " +
  "or flags queries it cannot answer from available data, rather than generating unsupported claims — a " +
  "critical requirement for a safety-context application."
));

content.push(pageBreak());

B.fs.writeFileSync('/home/claude/prd/_content_03.json', JSON.stringify({count: content.length}));
module.exports = content;
