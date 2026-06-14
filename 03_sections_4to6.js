const B = require('./build');
const {
  Paragraph, TextRun, AlignmentType, BorderStyle, WidthType,
  h1, h2, h3, p, pBold, bullet, bulletRich, numbered, pageBreak, divider, makeTable, COLORS, FULL_WIDTH
} = B;

const content = [];

// ================= 4. PRODUCT REQUIREMENTS =================
content.push(h1("4. Product Requirements"));

content.push(p(
  "This section defines the six core feature modules of SkyGuardian AI at a product level. Each module " +
  "is designed to operate independently (for incremental adoption) while sharing a common data layer and " +
  "risk-scoring framework, so insights from one module continuously enrich the others."
));

content.push(h2("4.1 Predictive Risk Engine"));
content.push(p(
  "The core of SkyGuardian AI. The Predictive Risk Engine continuously ingests weather, telemetry, " +
  "maintenance, flight plan, traffic, and pilot report data and produces a composite risk score for each " +
  "flight, aircraft, and route segment."
));
content.push(bullet("Computes a 0–100 composite risk score per flight, updated continuously from filing through landing."));
content.push(bullet("Decomposes the composite score into weighted sub-scores: weather risk, aircraft health risk, traffic/airspace risk, and human-factor risk."));
content.push(bullet("Generates safety alerts when any sub-score crosses configurable thresholds, with severity tiers (Advisory, Caution, Warning)."));
content.push(bullet("Produces incident probability estimates (e.g., 'elevated probability of a weather-related diversion: 18% above baseline')."));
content.push(bullet("Supports both pre-departure risk assessment and continuous in-flight re-scoring as conditions change."));

content.push(h2("4.2 Aircraft Health Monitoring"));
content.push(p(
  "Continuously monitors aircraft subsystem telemetry to detect degradation trends and predict component " +
  "failures before they cause operational disruptions."
));
content.push(bullet("Monitors engine performance parameters (EGT, N1/N2, oil pressure/temperature, vibration), fuel system parameters, electrical bus health, hydraulic system pressures, and battery state-of-health."));
content.push(bullet("Generates failure probability forecasts for monitored components over rolling time horizons (e.g., next 24 hours, next 7 days, next 30 flight hours)."));
content.push(bullet("Produces preventive maintenance recommendations ranked by urgency and confidence."));
content.push(bullet("Provides health trend visualizations showing parameter drift relative to fleet baselines and manufacturer limits."));

content.push(h2("4.3 AI Safety Assistant"));
content.push(p(
  "A conversational interface, accessible via the dashboard and mobile/EFB, that allows users to query " +
  "the platform in natural language and receive explainable, evidence-backed answers."
));
content.push(bullet("Answers operational questions such as 'Is Flight AI102 safe to operate?', 'What are the highest-risk flights today?', and 'Which aircraft require inspection this week?'"));
content.push(bullet("Every response includes an explainability panel showing the specific data points and model reasoning that produced the answer (e.g., contributing risk factors, weighted scores, source data timestamps)."));
content.push(bullet("Supports follow-up, drill-down questions within the same conversational context (e.g., 'Why is the weather risk elevated?' after an initial risk summary)."));
content.push(bullet("Role-aware responses: a dispatcher asking about a flight receives operational guidance, while a maintenance technician asking about the same aircraft receives component-level detail."));

content.push(h2("4.4 Weather Intelligence Module"));
content.push(p(
  "Aggregates and interprets meteorological data along filed and predicted flight routes to produce " +
  "route-specific risk assessments."
));
content.push(bullet("Analyzes turbulence forecasts (including AI-derived turbulence nowcasting), wind shear reports and forecasts, convective activity (thunderstorms), visibility/ceiling conditions, crosswind components relative to runway headings, and icing condition forecasts."));
content.push(bullet("Generates a route risk profile that segments the flight path into legs, each with an associated weather risk score and the dominant contributing hazard."));
content.push(bullet("Flags time-sensitive weather windows (e.g., a thunderstorm cell expected to intersect the route in 45 minutes) with recommended alternative routings or timing adjustments."));

content.push(h2("4.5 Safety Dashboard"));
content.push(p(
  "The primary visual interface for OCC, safety, and management personas, providing a unified, real-time " +
  "view of fleet-wide and flight-level safety status."
));
content.push(bullet("Fleet health overview: aggregate health status across all monitored aircraft, segmented by subsystem."));
content.push(bullet("Risk heatmaps: geographic and fleet-matrix visualizations highlighting concentrations of elevated risk."));
content.push(bullet("Active alerts panel: real-time feed of safety alerts with severity, affected flight/aircraft, and recommended actions."));
content.push(bullet("Flight monitoring view: live list of active and upcoming flights sorted by composite risk score."));
content.push(bullet("Safety trends: historical trend charts for incident precursor rates, risk score distributions, and maintenance event frequency."));
content.push(bullet("Predictive analytics panel: forward-looking forecasts (e.g., projected fleet-wide risk for the next 24–72 hours based on weather and maintenance schedules)."));

content.push(h2("4.6 Incident Prediction System"));
content.push(p(
  "Synthesizes outputs from the other modules to estimate the likelihood of an incident occurring before " +
  "a flight departs, categorized by root-cause domain."
));
content.push(bullet("Maintenance-related risk: probability that an aircraft will experience an in-service technical issue based on current health trends and deferred maintenance items."));
content.push(bullet("Weather-related risk: probability of weather-driven diversion, delay, or in-flight hazard encounter."));
content.push(bullet("Operational risk: probability of disruption due to traffic congestion, airspace restrictions, or schedule compression (e.g., insufficient turnaround time)."));
content.push(bullet("Human-factor risk: probability elevated by indicators such as crew duty-time proximity to limits, fatigue risk indicators, or patterns identified in recent pilot reports."));
content.push(bullet("Each prediction includes a confidence interval and the top contributing factors, ranked by contribution weight."));

content.push(pageBreak());

// ================= 5. FUNCTIONAL REQUIREMENTS =================
content.push(h1("5. Functional Requirements"));

content.push(p(
  "Functional requirements are organized by module and expressed as discrete, testable capabilities. " +
  "Priority follows MoSCoW (Must, Should, Could, Won't-for-now)."
));

content.push(h2("5.1 Predictive Risk Engine — Functional Requirements"));
content.push(makeTable(
  [900, 6260, 1300, 900],
  ["ID", "Requirement", "Priority", "Module"],
  [
    ["FR-101", "System shall ingest weather, telemetry, maintenance, flight plan, traffic, and PIREP data via configurable connectors", "Must", "PRE"],
    ["FR-102", "System shall compute a composite risk score (0–100) for each active and scheduled flight, refreshed at least every 5 minutes", "Must", "PRE"],
    ["FR-103", "System shall decompose the composite score into weather, aircraft health, traffic, and human-factor sub-scores, each independently visible", "Must", "PRE"],
    ["FR-104", "System shall generate alerts when any sub-score crosses configurable thresholds, with three severity tiers", "Must", "PRE"],
    ["FR-105", "System shall provide an incident probability estimate with an associated confidence interval for each flight", "Should", "PRE"],
    ["FR-106", "System shall allow safety officers to configure risk-scoring weights and thresholds per fleet type or route", "Should", "PRE"],
    ["FR-107", "System shall maintain a versioned history of risk scores per flight for post-event audit and model validation", "Must", "PRE"],
  ]
));

content.push(h2("5.2 Aircraft Health Monitoring — Functional Requirements"));
content.push(makeTable(
  [900, 6260, 1300, 900],
  ["ID", "Requirement", "Priority", "Module"],
  [
    ["FR-201", "System shall ingest aircraft telemetry (ACARS, ACMS, or equivalent feeds) for engine, fuel, electrical, hydraulic, and battery parameters", "Must", "AHM"],
    ["FR-202", "System shall compare live parameter values against fleet baselines and OEM limits to detect anomalies", "Must", "AHM"],
    ["FR-203", "System shall generate failure probability forecasts for monitored components across multiple time horizons (24h, 7d, 30 flight-hours)", "Must", "AHM"],
    ["FR-204", "System shall produce a ranked preventive maintenance recommendation queue, including confidence scores and supporting evidence", "Must", "AHM"],
    ["FR-205", "System shall provide health trend visualizations per aircraft and per fleet, with drill-down to individual sensor parameters", "Should", "AHM"],
    ["FR-206", "System shall support manual annotation by maintenance teams to confirm, dismiss, or escalate AI-generated recommendations, feeding back into model retraining", "Should", "AHM"],
  ]
));

content.push(h2("5.3 AI Safety Assistant — Functional Requirements"));
content.push(makeTable(
  [900, 6260, 1300, 900],
  ["ID", "Requirement", "Priority", "Module"],
  [
    ["FR-301", "System shall provide a natural-language query interface accepting questions about flights, aircraft, routes, and fleet status", "Must", "ASA"],
    ["FR-302", "System shall return responses with an explainability panel listing contributing data sources, scores, and reasoning steps", "Must", "ASA"],
    ["FR-303", "System shall support multi-turn conversational context for follow-up questions", "Must", "ASA"],
    ["FR-304", "System shall tailor response content and detail level based on the requesting user's role", "Should", "ASA"],
    ["FR-305", "System shall log all assistant queries and responses for audit and quality-monitoring purposes", "Must", "ASA"],
    ["FR-306", "System shall flag and decline to answer queries that fall outside its data scope, rather than producing unsupported responses", "Must", "ASA"],
  ]
));

content.push(h2("5.4 Weather Intelligence Module — Functional Requirements"));
content.push(makeTable(
  [900, 6260, 1300, 900],
  ["ID", "Requirement", "Priority", "Module"],
  [
    ["FR-401", "System shall ingest weather data from aviation-grade providers covering turbulence, wind shear, convective activity, visibility, crosswinds, and icing", "Must", "WX"],
    ["FR-402", "System shall segment filed routes into legs and assign a weather risk score and dominant hazard to each leg", "Must", "WX"],
    ["FR-403", "System shall identify time-sensitive weather windows that intersect a flight's planned trajectory and timing", "Must", "WX"],
    ["FR-404", "System shall suggest alternative routings or timing adjustments to avoid identified high-risk weather windows", "Should", "WX"],
    ["FR-405", "System shall update route risk profiles automatically as weather forecasts are updated", "Must", "WX"],
  ]
));

content.push(h2("5.5 Safety Dashboard — Functional Requirements"));
content.push(makeTable(
  [900, 6260, 1300, 900],
  ["ID", "Requirement", "Priority", "Module"],
  [
    ["FR-501", "Dashboard shall display a fleet health overview summarizing subsystem status across all monitored aircraft", "Must", "DASH"],
    ["FR-502", "Dashboard shall display risk heatmaps by geography and by fleet matrix (aircraft x risk category)", "Must", "DASH"],
    ["FR-503", "Dashboard shall display a live, sortable list of active and upcoming flights ranked by composite risk score", "Must", "DASH"],
    ["FR-504", "Dashboard shall display an active alerts feed with severity, affected entity, and recommended action", "Must", "DASH"],
    ["FR-505", "Dashboard shall provide historical safety trend charts with configurable date ranges and filters", "Should", "DASH"],
    ["FR-506", "Dashboard shall provide a predictive analytics panel forecasting fleet-wide risk over the next 24–72 hours", "Should", "DASH"],
    ["FR-507", "Dashboard shall support role-based views (OCC, Safety, Maintenance, Management) with appropriate default layouts", "Should", "DASH"],
  ]
));

content.push(h2("5.6 Incident Prediction System — Functional Requirements"));
content.push(makeTable(
  [900, 6260, 1300, 900],
  ["ID", "Requirement", "Priority", "Module"],
  [
    ["FR-601", "System shall produce a pre-departure incident likelihood estimate for each flight, categorized by root-cause domain (maintenance, weather, operational, human-factor)", "Must", "INC"],
    ["FR-602", "System shall rank contributing factors for each prediction by contribution weight and present them in plain language", "Must", "INC"],
    ["FR-603", "System shall integrate crew duty-time data to compute human-factor risk indicators where data is available", "Should", "INC"],
    ["FR-604", "System shall provide a feedback mechanism for safety officers to label predictions against actual outcomes, supporting model evaluation", "Must", "INC"],
  ]
));

content.push(pageBreak());

// ================= 6. NON-FUNCTIONAL REQUIREMENTS =================
content.push(h1("6. Non-Functional Requirements"));

content.push(h2("6.1 Performance"));
content.push(bullet("Risk scores shall be recomputed for all active flights within 5 minutes of new data availability."));
content.push(bullet("AI Safety Assistant responses shall be returned within 5 seconds for 95% of queries (p95 latency)."));
content.push(bullet("Dashboard views shall load within 2 seconds for fleets of up to 200 aircraft."));

content.push(h2("6.2 Scalability"));
content.push(bullet("The data pipeline shall support ingestion of telemetry from fleets ranging from 10 to 1,000+ aircraft without architectural redesign."));
content.push(bullet("The platform shall support horizontal scaling of AI inference workloads via containerized, autoscaling compute."));
content.push(bullet("Time-series storage shall support multi-year retention of telemetry data for model retraining and regulatory audit."));

content.push(h2("6.3 Reliability and Availability"));
content.push(bullet("Core platform availability target of 99.9% (excluding scheduled maintenance windows)."));
content.push(bullet("Graceful degradation: if a data source becomes unavailable, the affected risk sub-score shall be flagged as 'data unavailable' rather than silently defaulting to a low-risk value."));
content.push(bullet("Automated failover for the data pipeline and inference layer across multiple availability zones."));

content.push(h2("6.4 Security and Data Protection"));
content.push(bullet("All data in transit and at rest shall be encrypted using industry-standard protocols (TLS 1.2+, AES-256)."));
content.push(bullet("Role-based access control (RBAC) shall govern access to fleet data, with audit logging of all data access."));
content.push(bullet("The platform shall support deployment models compliant with relevant data residency requirements (e.g., regional data isolation for operators subject to local regulations)."));
content.push(bullet("Security architecture shall align with aviation cybersecurity guidance (e.g., relevant provisions of ICAO Annex 17 and applicable national frameworks) and undergo periodic third-party penetration testing."));

content.push(h2("6.5 Explainability and Auditability"));
content.push(bullet("Every risk score and AI-generated recommendation shall be traceable to the specific input data and model version that produced it."));
content.push(bullet("The platform shall retain an immutable audit log of risk scores, alerts, and assistant responses for a configurable retention period (minimum 2 years) to support regulatory and incident investigations."));

content.push(h2("6.6 Usability and Accessibility"));
content.push(bullet("The dashboard shall meet WCAG 2.1 AA accessibility standards."));
content.push(bullet("Interfaces shall support operation in low-bandwidth environments (e.g., degraded connectivity at remote airports)."));
content.push(bullet("The platform shall support localization for major operating languages of target markets."));

content.push(h2("6.7 Compliance"));
content.push(bullet("The platform's outputs and processes shall be designed to support, not replace, operators' existing Safety Management System (SMS) obligations under ICAO Annex 19 and applicable national regulations (e.g., FAA, EASA)."));
content.push(bullet("Data handling shall comply with applicable data protection regulations (e.g., GDPR) for operators in relevant jurisdictions."));

content.push(pageBreak());

B.fs.writeFileSync('/home/claude/prd/_content_02.json', JSON.stringify({count: content.length}));
module.exports = content;
