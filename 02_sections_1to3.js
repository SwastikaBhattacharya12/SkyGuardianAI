const B = require('./build');
const {
  Paragraph, TextRun, AlignmentType, BorderStyle, WidthType,
  h1, h2, h3, p, pBold, bullet, bulletRich, numbered, pageBreak, divider, makeTable, COLORS, FULL_WIDTH
} = B;

const content = [];

// ================= 1. EXECUTIVE SUMMARY =================
content.push(h1("1. Executive Summary"));

content.push(p(
  "SkyGuardian AI is a predictive aviation safety intelligence platform that fuses weather data, " +
  "aircraft telemetry, maintenance history, pilot reports, flight plans, and air traffic information " +
  "into a single continuously-learning risk engine. Where today's operations centers rely on siloed " +
  "tools and manual cross-referencing to assess flight risk, SkyGuardian AI delivers a unified, " +
  "explainable, real-time risk score for every flight, aircraft, and route — surfaced through an " +
  "intuitive dashboard and a natural-language safety assistant."
));

content.push(p(
  "The platform is designed for airline operations control centers, safety officers, dispatch teams, " +
  "and aviation regulators who need to move from reactive incident response to proactive risk " +
  "mitigation. By combining time-series forecasting, anomaly detection, and explainable AI, " +
  "SkyGuardian AI identifies emerging risks — a degrading hydraulic pump, an approaching wind-shear " +
  "event, an aircraft trending toward an unscheduled maintenance event — days or hours before they " +
  "would otherwise be detected."
));

content.push(h3("Why Now"));
content.push(bullet("Aircraft generate terabytes of telemetry per flight, but most of it is never analyzed in real time for cross-domain risk correlation."));
content.push(bullet("Regulatory bodies (FAA, EASA, ICAO) are increasingly mandating predictive Safety Management Systems (SMS) and data-driven oversight."));
content.push(bullet("Recent advances in time-series foundation models and explainable AI make real-time, auditable risk scoring commercially viable for the first time."));
content.push(bullet("Legacy providers (Boeing AnalytX, Honeywell Forge, Airbus Skywise) are OEM-anchored and fleet-specific; there is no neutral, cross-fleet, cross-OEM safety intelligence layer."));

content.push(h3("Strategic Positioning"));
content.push(p(
  "SkyGuardian AI positions itself as the 'safety operating system' for aviation — an OEM-agnostic, " +
  "API-first platform that augments (rather than replaces) existing fleet management and EFB systems. " +
  "The wedge is the AI Safety Assistant and Predictive Risk Engine, which provide immediate value with " +
  "minimal integration effort and expand into deep aircraft health monitoring and fleet-wide analytics " +
  "as data integrations mature."
));

content.push(h3("Key Outcomes Targeted"));
content.push(makeTable(
  [4680, 4680],
  ["Outcome", "Target Impact (Year 2)"],
  [
    ["Reduction in preventable safety incidents", "20–30% reduction in incidents linked to maintenance, weather, or human-factor risks flagged by the platform"],
    ["Unscheduled maintenance / AOG events", "15–25% reduction via predictive maintenance alerts"],
    ["Dispatcher decision time on high-risk flights", "Reduce average risk-assessment time from ~20 minutes to under 3 minutes"],
    ["Prediction accuracy (incident precursor detection)", "≥ 85% precision / ≥ 80% recall on labeled historical incident data"],
    ["Customer adoption (airlines / operators)", "10 pilot operators in Year 1, 50+ operators by end of Year 2"],
  ]
));

content.push(pageBreak());

// ================= 2. PROBLEM ANALYSIS =================
content.push(h1("2. Problem Analysis"));

content.push(h2("2.1 The Core Problem"));
content.push(p(
  "Aviation safety depends on synthesizing information from many independent systems: weather services, " +
  "aircraft health monitoring (AHM) systems, maintenance tracking software, flight planning tools, ATC and " +
  "traffic feeds, and pilot/crew reports (PIREPs, ASRs). Each of these systems is mature in isolation, but " +
  "none of them talk to each other in a way that produces a single, real-time risk picture for a given " +
  "flight or aircraft."
));

content.push(p(
  "As a result, the responsibility for synthesizing this information falls on humans — dispatchers, " +
  "safety officers, and pilots — under time pressure, with incomplete visibility, and without consistent, " +
  "quantified risk scoring. This creates four compounding problems."
));

content.push(h3("2.1.1 Delayed Risk Identification"));
content.push(p(
  "Risk signals (a degrading sensor trend, a tightening weather window, a pattern of similar pilot reports " +
  "across a fleet) often exist in the data well before they are recognized by a human reviewer. Without " +
  "continuous automated correlation across data sources, these signals are detected late — often only " +
  "after an operational disruption or safety event has already begun."
));

content.push(h3("2.1.2 Human Error in Data Interpretation"));
content.push(p(
  "Dispatchers and safety officers must manually cross-reference dozens of data sources under time " +
  "pressure. Cognitive load increases the likelihood of missed correlations — for example, failing to " +
  "connect a minor maintenance deferral with a forecasted icing encounter on the same aircraft's next leg."
));

content.push(h3("2.1.3 Reactive Instead of Proactive Safety Management"));
content.push(p(
  "Most current safety reporting systems (ASRs, SDRs, FOQA programs) are fundamentally retrospective: " +
  "they analyze what happened after the fact. Proactive Safety Management Systems (SMS) are mandated by " +
  "regulators, but most operators lack the predictive tooling to operationalize them beyond periodic " +
  "trend reports."
));

content.push(h3("2.1.4 Inefficient Maintenance Planning"));
content.push(p(
  "Maintenance is largely scheduled on fixed intervals (hard time / on-condition) rather than true " +
  "predictive triggers. This leads to either premature part replacement (unnecessary cost) or in-service " +
  "failures that could have been anticipated from telemetry trends — both of which carry direct cost and " +
  "indirect safety implications."
));

content.push(h3("2.1.5 Increasing Operational Complexity"));
content.push(p(
  "Fleet diversification, denser airspace, more frequent extreme-weather events, and tighter turnaround " +
  "schedules all increase the cognitive and operational burden on safety-critical roles, while the volume " +
  "of available data continues to grow."
));

content.push(h2("2.2 Cost of Inaction"));
content.push(makeTable(
  [4680, 4680],
  ["Consequence of Status Quo", "Illustrative Impact"],
  [
    ["Unscheduled maintenance / AOG (Aircraft on Ground)", "Average AOG event can cost an operator tens of thousands of dollars per day in lost revenue and recovery logistics"],
    ["Weather-related diversions and delays", "Cascading network delays, crew duty-time violations, and passenger compensation costs"],
    ["Safety incidents and near-misses", "Regulatory scrutiny, reputational damage, insurance premium increases, and — in severe cases — loss of life"],
    ["Regulatory non-compliance with SMS mandates", "Findings, fines, and increased audit frequency from aviation authorities"],
  ]
));

content.push(h2("2.3 Opportunity Statement"));
content.push(p(
  "There is a clear opportunity for an AI-native platform that sits above existing operational systems, " +
  "ingests their outputs via APIs, and continuously computes a unified, explainable risk picture across " +
  "weather, aircraft health, maintenance, traffic, and human-factor dimensions — surfaced through both a " +
  "visual dashboard and a conversational interface that fits naturally into existing operations workflows."
));

content.push(pageBreak());

// ================= 3. USER PERSONAS =================
content.push(h1("3. User Personas"));

content.push(h2("3.1 Primary Personas"));

content.push(h3("Persona 1: Maya Chen — Operations Control Center (OCC) Duty Manager"));
content.push(makeTable(
  [2400, 6960],
  ["Attribute", "Description"],
  [
    ["Role", "Oversees real-time flight operations for a 60-aircraft narrow-body fleet across a regional network"],
    ["Goals", "Maintain on-time performance while ensuring no flight departs with an unmitigated safety risk; minimize disruptions"],
    ["Pain Points", "Must monitor weather, NOTAMs, aircraft status, and crew legality across multiple disconnected systems simultaneously; risk assessment is subjective and inconsistent across shifts"],
    ["Success Criteria", "A single screen showing every active and upcoming flight ranked by risk, with one-click drill-down into the 'why' behind each score"],
    ["Quote", "\"I need to know which of my 40 active flights I should actually be worried about — right now, not after a debrief.\""],
  ]
));

content.push(h3("Persona 2: Carlos Reyes — Safety Officer / SMS Manager"));
content.push(makeTable(
  [2400, 6960],
  ["Attribute", "Description"],
  [
    ["Role", "Responsible for the airline's Safety Management System, regulatory reporting, and trend analysis"],
    ["Goals", "Identify systemic risk patterns before they manifest as incidents; produce defensible, data-backed safety reports for regulators and leadership"],
    ["Pain Points", "Safety data arrives in retrospective reports (weeks-old); correlating maintenance trends with operational incidents across the fleet is a manual, spreadsheet-driven process"],
    ["Success Criteria", "Fleet-wide risk heatmaps and predictive trend analysis that can be exported directly into SMS reporting and regulatory submissions"],
    ["Quote", "\"By the time a trend shows up in our quarterly safety report, it's already history. I need to see it forming.\""],
  ]
));

content.push(h3("Persona 3: Aisha Bello — Flight Dispatcher"));
content.push(makeTable(
  [2400, 6960],
  ["Attribute", "Description"],
  [
    ["Role", "Plans and releases flights, monitors en-route conditions, and coordinates with crew on operational changes"],
    ["Goals", "Release flights with confidence that weather, aircraft, and traffic risks have been considered; respond quickly to changing conditions en route"],
    ["Pain Points", "Manually checking multiple weather products, NOTAMs, and aircraft status pages for each flight release; reassessing risk mid-flight requires re-running the same manual process"],
    ["Success Criteria", "A natural-language assistant that can answer 'Is Flight AI102 safe to operate?' with a clear, explainable risk breakdown in seconds"],
    ["Quote", "\"I don't need another dashboard — I need an answer I can trust and act on immediately.\""],
  ]
));

content.push(h3("Persona 4: David Okafor — VP of Flight Operations (Airline Management)"));
content.push(makeTable(
  [2400, 6960],
  ["Attribute", "Description"],
  [
    ["Role", "Oversees flight operations, safety, and maintenance budgets at the executive level"],
    ["Goals", "Reduce incident rates and unscheduled maintenance costs while demonstrating proactive safety leadership to the board and regulators"],
    ["Pain Points", "Lacks a real-time, fleet-wide view of operational risk; safety and maintenance KPIs are reported with significant lag"],
    ["Success Criteria", "Executive dashboard showing fleet health trends, risk-adjusted KPIs, and ROI of predictive maintenance interventions"],
    ["Quote", "\"I need to walk into a board meeting and show, with data, that our safety posture is improving — not just that we had a quiet quarter.\""],
  ]
));

content.push(h2("3.2 Secondary Personas"));
content.push(makeTable(
  [2200, 3580, 3580],
  ["Persona", "Primary Need", "Interaction with SkyGuardian AI"],
  [
    ["Pilots", "Pre-flight and in-flight situational awareness on aircraft health and weather risk", "Mobile/EFB view of flight-specific risk summary and AI assistant queries"],
    ["Aircraft Maintenance Teams", "Early warning on component degradation; prioritized inspection lists", "Aircraft Health Monitoring module, maintenance recommendation queue"],
    ["Airport Authorities", "Visibility into incoming traffic risk profiles (weather, aircraft health) affecting ground operations", "Airport-level risk dashboard, API feed for ground operations systems"],
    ["Aviation Regulators", "Auditable, explainable safety data to support oversight and SMS evaluation", "Read-only regulator portal with explainable AI audit trails and historical risk logs"],
  ]
));

content.push(pageBreak());

B.fs.writeFileSync('/home/claude/prd/_content_01.json', JSON.stringify({count: content.length}));
module.exports = content;
