const B = require('./build');
const {
  Paragraph, TextRun, AlignmentType, BorderStyle, WidthType,
  h1, h2, h3, p, pBold, bullet, bulletRich, numbered, pageBreak, divider, makeTable, COLORS, FULL_WIDTH
} = B;

const content = [];

// ================= 10. USER FLOWS =================
content.push(h1("10. User Flows"));

content.push(h2("10.1 Flow: Pre-Departure Risk Review (Dispatcher)"));
content.push(numbered("Dispatcher opens the Safety Dashboard at the start of their shift; the Flight Monitoring view loads, sorted by composite risk score (highest first)."));
content.push(numbered("Dispatcher identifies Flight AI102 with an elevated composite risk score (e.g., 68/100) and an Active Alert badge."));
content.push(numbered("Dispatcher clicks the flight to open the Flight Risk Detail view, showing the four sub-scores and the top contributing factors for each."));
content.push(numbered("Dispatcher sees that the weather sub-score is elevated due to a forecast wind-shear event near the destination, expected to intersect the arrival window."));
content.push(numbered("Dispatcher opens the AI Safety Assistant and asks: 'Is Flight AI102 safe to operate?'"));
content.push(numbered("Assistant responds with a summary risk assessment, citing the wind-shear forecast, its expected timing, and the magnitude of its contribution to the weather sub-score, with a link to the underlying weather product."));
content.push(numbered("Dispatcher asks a follow-up: 'What if we delay departure by 30 minutes?' The assistant re-evaluates the route risk profile against the shifted arrival window and reports the updated weather sub-score."));
content.push(numbered("Dispatcher uses this information to adjust the flight release time, with the decision and AI-assistant interaction logged automatically for audit."));

content.push(h2("10.2 Flow: Predictive Maintenance Alert (Maintenance Team)"));
content.push(numbered("Aircraft Health Monitoring module detects a sustained anomaly in hydraulic system pressure on tail number XY-123, trending toward a forecasted threshold breach within 48 flight-hours."));
content.push(numbered("System generates a preventive maintenance recommendation with a confidence score and adds it to the Maintenance Recommendation Queue, ranked by urgency."));
content.push(numbered("An alert notification is sent to the maintenance team's configured channel (e.g., email/webhook to MRO system)."));
content.push(numbered("Maintenance lead opens the recommendation in the dashboard, reviewing the health trend visualization showing the pressure trajectory against fleet baseline and OEM limits."));
content.push(numbered("Maintenance lead asks the AI Safety Assistant: 'Which aircraft require inspection this week?' and confirms XY-123 appears with this recommendation alongside any others."));
content.push(numbered("Maintenance lead schedules an inspection within the recommended window and marks the recommendation as 'Acknowledged — Scheduled' in the platform."));
content.push(numbered("Upon completion, the maintenance team records the inspection outcome, which feeds back into the model evaluation dataset."));

content.push(h2("10.3 Flow: Fleet-Wide Safety Trend Review (Safety Officer)"));
content.push(numbered("Safety officer opens the Safety Dashboard's Safety Trends view and selects the trailing 90-day window."));
content.push(numbered("Safety officer reviews the risk heatmap, identifying that aircraft of a particular fleet type show a recurring elevated aircraft-health sub-score related to a specific component class."));
content.push(numbered("Safety officer drills into the affected aircraft list and reviews the Incident Prediction System's maintenance-related risk estimates for each."));
content.push(numbered("Safety officer exports the trend analysis and supporting evidence (model versions, data sources, explanation summaries) for inclusion in the quarterly SMS report."));
content.push(numbered("Safety officer uses the feedback mechanism to label historical predictions against actual outcomes for the affected component class, supporting ongoing model evaluation."));

content.push(h2("10.4 Flow: Executive Fleet Health Review (Airline Management)"));
content.push(numbered("VP of Flight Operations opens the Management dashboard view, showing fleet-wide KPIs: average composite risk score, active alert counts by severity, and predictive maintenance ROI estimates."));
content.push(numbered("VP reviews a trend chart showing the reduction in unscheduled maintenance events over the prior two quarters, segmented by whether the event was preceded by an AI-generated recommendation."));
content.push(numbered("VP asks the AI Safety Assistant: 'What are the highest-risk flights today?' to get a current operational snapshot before a leadership meeting."));
content.push(numbered("VP exports a summary view for the board meeting, including key safety and cost-avoidance metrics."));

content.push(pageBreak());

// ================= 11. WIREFRAME DESCRIPTIONS =================
content.push(h1("11. Wireframe Descriptions"));

content.push(p(
  "The following descriptions outline the layout and key components of SkyGuardian AI's primary screens. " +
  "These serve as the basis for high-fidelity UI design."
));

content.push(h2("11.1 Safety Dashboard — Home / Flight Monitoring View"));
content.push(bullet("Top navigation bar: Operator/fleet selector, global search, user profile, notification bell with active alert count."));
content.push(bullet("Left sidebar: Navigation between Flight Monitoring, Fleet Health, Risk Heatmap, Safety Trends, Maintenance Queue, and AI Assistant."));
content.push(bullet("Main panel — Flight Monitoring: a sortable table/list of active and upcoming flights, each row showing flight number, route, aircraft tail number, departure time, composite risk score (color-coded: green/amber/red), and an alert icon if applicable."));
content.push(bullet("Top-right summary cards: 'Flights Active Now', 'High-Risk Flights (>70)', 'Active Alerts', 'Aircraft in Watch/Critical Health Status'."));
content.push(bullet("Persistent AI Assistant chat icon in the bottom-right corner, expandable into a side panel without navigating away from the current view."));

content.push(h2("11.2 Flight Risk Detail View"));
content.push(bullet("Header: Flight number, route, aircraft tail number, scheduled times, and large composite risk score gauge (0–100, color-coded)."));
content.push(bullet("Four sub-score cards arranged horizontally: Weather, Aircraft Health, Traffic/Airspace, Human Factor — each showing its score and a one-line summary of the top contributing factor."));
content.push(bullet("Route map visualization: the flight path segmented into legs, color-coded by weather risk, with hazard icons (turbulence, icing, wind shear) at relevant points."));
content.push(bullet("Explanation panel: expandable section showing the full feature-attribution breakdown for the composite score, in both chart and plain-language form."));
content.push(bullet("Incident probability panel: displays the categorized incident likelihood estimates (maintenance, weather, operational, human-factor) with confidence indicators."));
content.push(bullet("Embedded AI Assistant context: pre-loaded with this flight's context so the user can immediately ask follow-up questions."));

content.push(h2("11.3 Fleet Health / Aircraft Health Monitoring View"));
content.push(bullet("Fleet matrix: a grid with aircraft tail numbers as rows and subsystems (engine, fuel, electrical, hydraulic, battery) as columns, color-coded by health status."));
content.push(bullet("Selecting an aircraft opens a detail panel showing time-series trend charts for each monitored parameter, with fleet-baseline overlay and OEM limit lines."));
content.push(bullet("Maintenance Recommendation Queue: a ranked list of AI-generated recommendations, each showing affected aircraft/component, urgency, confidence score, and status (New / Acknowledged / Scheduled / Resolved)."));
content.push(bullet("Failure probability forecast chart: shows the probability curve over the selected time horizon (24h / 7d / 30 flight-hours) for the selected component."));

content.push(h2("11.4 Risk Heatmap View"));
content.push(bullet("Geographic map mode: overlays current and forecasted flight routes with color-coded risk segments, plus weather hazard overlays (turbulence, convective activity, icing regions)."));
content.push(bullet("Fleet matrix mode: a grid of aircraft x risk category (weather, health, traffic, human-factor), color-coded, allowing rapid visual identification of risk concentrations."));
content.push(bullet("Toggle and filter controls: by fleet type, route, time window, and risk category."));

content.push(h2("11.5 AI Safety Assistant Interface"));
content.push(bullet("Chat-style interface with a persistent input box and conversation history."));
content.push(bullet("Each assistant response includes an 'Explain this' expandable section showing the underlying data sources, scores, and reasoning chain."));
content.push(bullet("Suggested queries displayed contextually (e.g., on the Flight Risk Detail view: 'Why is this flight's risk score elevated?', 'What would reduce this risk?')."));
content.push(bullet("Citations within responses link directly to the relevant dashboard view (e.g., a weather hazard reference links to the Route Map for that flight)."));

content.push(h2("11.6 Mobile / EFB Companion View"));
content.push(bullet("Simplified, single-flight-focused view for pilots: composite risk score, sub-score summary, and top alerts for their assigned aircraft/flight."));
content.push(bullet("AI Assistant accessible via a persistent chat tab, optimized for short queries and concise responses suitable for cockpit/pre-flight use."));
content.push(bullet("Offline-tolerant design: caches the most recent risk assessment for viewing when connectivity is degraded, with a clear 'last updated' timestamp."));

content.push(pageBreak());

// ================= 12. MVP ROADMAP =================
content.push(h1("12. MVP Roadmap"));

content.push(h2("12.1 Phase 1 — Hackathon MVP (24–48 Hours)"));
content.push(p(
  "The Phase 1 MVP focuses on demonstrating the core value proposition — a working Predictive Risk Engine " +
  "and AI Safety Assistant — using a constrained dataset and simplified models, deployable as a " +
  "demonstration application."
));
content.push(bullet("Ingest a static or simulated dataset covering a small fleet (e.g., 5–10 aircraft) with sample telemetry, weather, maintenance, and flight plan data."));
content.push(bullet("Implement a simplified composite risk scoring algorithm combining weather risk (using a public aviation weather API) and a basic aircraft health rule-set (threshold-based, not full ML forecasting)."));
content.push(bullet("Build a functional Safety Dashboard showing the Flight Monitoring view, risk scores, and a basic alerts list."));
content.push(bullet("Implement a working AI Safety Assistant capable of answering the three example queries ('Is Flight AI102 safe to operate?', 'What are the highest-risk flights today?', 'Which aircraft require inspection?') using retrieval-augmented generation over the demo dataset, with a basic explanation panel."));
content.push(bullet("Build a simplified Route Map visualization showing weather risk segments for one or two demo routes."));
content.push(bullet("Goal: a coherent, demoable end-to-end story — from data ingestion through risk scoring to a conversational explainable interface — using one representative scenario per core module."));

content.push(h2("12.2 Phase 2 — Pilot Deployment"));
content.push(p(
  "Phase 2 targets a limited production pilot with one or two design-partner operators, focused on " +
  "validating data integration, model accuracy, and operational workflow fit."
));
content.push(bullet("Production-grade connectors to at least one real telemetry source (e.g., ACARS/ACMS export), one commercial weather data provider, and the pilot operator's maintenance system."));
content.push(bullet("Full implementation of the Predictive Risk Engine with trained anomaly detection and time-series forecasting models, validated against the pilot operator's historical incident/precursor data."));
content.push(bullet("Aircraft Health Monitoring module covering at least engine and hydraulic systems, with a functioning Maintenance Recommendation Queue and feedback loop."));
content.push(bullet("Weather Intelligence Module with full route-segmentation and hazard classification."));
content.push(bullet("Role-based dashboard views for OCC, Safety, and Maintenance personas."));
content.push(bullet("AI Safety Assistant with role-aware responses and full explainability panels, integrated into the production dashboard."));
content.push(bullet("Security and compliance baseline: RBAC, encryption, audit logging, and initial third-party security review."));
content.push(bullet("Success criteria: pilot operator validates risk scores against at least one quarter of historical operations, with documented prediction accuracy and qualitative feedback from dispatchers and safety officers."));

content.push(h2("12.3 Phase 3 — Enterprise Aviation Platform"));
content.push(p(
  "Phase 3 expands SkyGuardian AI into a multi-tenant, enterprise-grade platform supporting airlines, " +
  "private aviation operators, airports, and regulators at scale."
));
content.push(bullet("Multi-tenant architecture supporting dozens of operators with isolated data and configurable risk-scoring parameters per tenant."));
content.push(bullet("Full Incident Prediction System covering all four risk domains (maintenance, weather, operational, human-factor), with human-factor risk incorporating crew duty-time and fatigue indicators."));
content.push(bullet("Expanded Aircraft Health Monitoring across all subsystems (engine, fuel, electrical, hydraulic, battery) for multiple aircraft types, with continuously retrained models per fleet type."));
content.push(bullet("Airport Authority and Regulator portals with appropriate read-only, audit-focused views."));
content.push(bullet("Mobile/EFB companion app for pilots, with offline-tolerant design."));
content.push(bullet("Advanced predictive analytics: fleet-wide 24–72 hour risk forecasting incorporating weather forecasts and maintenance schedules."));
content.push(bullet("Open API and integration marketplace for third-party EFB, dispatch, and MRO systems."));
content.push(bullet("Full compliance program: SOC 2 Type II, regional data residency options, and alignment with ICAO Annex 19 SMS reporting requirements."));
content.push(bullet("Continuous model governance program: scheduled retraining, drift monitoring, and third-party model validation audits."));

content.push(pageBreak());

B.fs.writeFileSync('/home/claude/prd/_content_04.json', JSON.stringify({count: content.length}));
module.exports = content;
