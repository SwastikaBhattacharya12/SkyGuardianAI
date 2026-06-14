<div align="center">

<img src="https://img.shields.io/badge/SkyGuardian_AI-Aviation_Risk_Intelligence-E5C158?style=for-the-badge&logo=shield&logoColor=white" alt="SkyGuardian AI" />

# 🛡️ SkyGuardian AI

### Real-Time Pre-Departure Aviation Risk Intelligence Platform

*Predict. Assess. Release. Every flight, every corridor, every sensor.*

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Google-4285F4?style=flat-square&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[**Live Demo**](#demo-mode) • [**Docs**](#api-reference) • [**Quick Start**](#quick-start) • [**Architecture**](#architecture)

</div>

---

## 📖 Overview

**SkyGuardian AI** is a full-stack, AI-powered **aviation risk intelligence platform** for pre-departure flight dispatch. It integrates micro-scale weather grids, enroute corridor density, crew duty logs, and continuous aircraft telemetry streams into a unified safety assurance layer — giving flight directors, fleet operations managers, and safety inspectors the intelligence they need to make informed dispatch release decisions and identify structural anomalies before departure.

### 🎯 The Problem

Pre-departure aviation risk attribution is highly fragmented. Weather delays, enroute traffic bottlenecks, crew fatigue logs, and aircraft component drifts are typically managed in silos. Under-addressed risks lead to high-cost enroute flight cancellations, emergency diversions, and component failures, which cost the commercial aviation industry billions of dollars annually.

### 💡 The Solution

SkyGuardian AI creates a **pre-departure risk intelligence layer** for every flight — continuously analyzing aircraft sensor telemetry (EGT, hydraulic pressure, oil pressure), predicting route segment meteorological hazards (turbulence waves, storm cells, icing, wind shear), and computing a dynamic composite risk rating to assure safe, optimal release clearances.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛰️ **Active Radar Track** | Circular airspace monitoring visual tracking flight vectors, headings, and weather contours |
| 🛩️ **Airframe Health Schematic** | Jet structural silhouette illustrating Nose, Engines, Fuselage, and Tail status node health |
| ⚡ **Pre-Departure Risk Scoring** | Multi-attribute calculation of composite safety scores (weather, health, traffic, human factors) |
| 🗺️ **Corridor Weather Mapping** | Bezier route tracking mapping enroute segments to storm cells, turbulence waves, and icing zones |
| 🤖 **Intelligent RAG Assistant** | LLM integration using Gemini 1.5 Flash to answer operations queries and execute macros |
| 🧪 **Telemetry Simulator** | Inject anomalous drifts (hydraulic leaks and exhaust gas temperature drifts) to test alerts |
| 📝 **Executive Safety Briefing** | Spaced, consulting-style safety documents showing explainable AI attributions and telemetry charts |
| 💼 **Editorial Luxury UI** | Dark UI dashboard with gold accents |

---

## 🖥️ Screenshots

### Command Deck Dashboard

![Command Deck Dashboard](dashboard.png)

---

### Executive Safety Briefing

![Executive Safety Briefing](flight-briefing.png)

---

### Fleet Status Matrix

![Fleet Status Matrix](fleet.png)

---

### AI Safety Assistant

![AI Safety Assistant](assistant.png)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   SkyGuardian AI Stack                  │
├──────────────┬──────────────────┬───────────────────────┤
│   Frontend   │     Backend      │       AI / ML         │
│  Next.js 15  │    FastAPI       │   Gemini 1.5 Flash    │
│  Tailwind 4  │    SQLAlchemy    │   (RAG Assistant)     │
│  Lucide Icons│    SQLite / PG   │   Risk Engine         │
│  Recharts    │    Pydantic v2   │   Telemetry Analysis  │
└──────────────┴──────────────────┴───────────────────────┘
```

### Project Structure

```
skyguardian-ai/
├── frontend/                    # Next.js 15 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Luxury Landing Entry Portal
│   │   │   └── dashboard/       # Operations Control Panel
│   │   │       ├── layout.tsx   # Header Console & AI Sidebar Frame
│   │   │       ├── page.tsx     # Airspace Radar Deck & Flight Cards
│   │   │       ├── fleet/       # Airframe Health Schematic & Telemetry
│   │   │       └── flight/      # Flight Briefing & Segment Hazards
│   │   ├── components/
│   │   │   └── ChatPanel.tsx    # RAG Intel Console (AI Assistant)
│   │   ├── lib/
│   │   │   └── api.ts           # REST API client configurations
│   │   └── styles/
│   │       └── globals.css      # Core Design System (editorial fonts & overlays)
│   └── public/                  # Static assets & luxury hero photos
│
├── backend/                     # FastAPI Application
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py     # FastAPI endpoints (Flights, Telemetry, RAG, Sim)
│   │   ├── db/
│   │   │   ├── models.py        # SQLAlchemy models (Aircraft, Flight, RiskScore, Alert, TelemetrySnapshot)
│   │   │   ├── seed.py          # Operational seed databases (Active flights, tail numbers)
│   │   │   └── session.py       # Session managers
│   │   ├── services/
│   │   │   ├── assistant.py     # Gemini RAG integration
│   │   │   ├── health.py        # Airframe health analytics & failure forecast
│   │   │   ├── risk.py          # Pre-departure risk engine
│   │   │   └── weather.py       # Route segments & METAR weather services
│   │   └── main.py              # Application entry point
│   └── requirements.txt         # Python dependencies list
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git**

### Clone

```bash
git clone https://github.com/SwastikaBhattacharya12/SkyGuardianAI.git
cd SkyGuardianAI
```

---

### 🔴 Demo Mode (No credentials required)

The application works fully out-of-the-box with automatically seeded database files.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # Set up your Gemini API Key
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs
```

ML database and demo flights auto-seed on the first backend server tick.

---

### 🟢 Full Setup (With PostgreSQL Database)

#### 1. PostgreSQL Integration

1. Create a PostgreSQL connection string (e.g. via Neon or local database).
2. Configure it in `backend/.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   ```

#### 2. Google Gemini API Integration

1. Secure an API Key from Google AI Studio.
2. Configure it in `backend/.env`:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

#### 3. Environment Files

**`backend/.env`**
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./skyguardian.db
PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python
```

**`frontend/src/lib/api.ts`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🤖 AI / ML System

### Models

#### Google Gemini RAG Assistant
- **Input**: User-typed safety operations questions.
- **RAG Context**: Dynamically pulls active flights status, airframe tail numbers, health metrics, and active warning alerts.
- **Output**: Detailed risk mitigations, release reviews, and maintenance directives.

#### Pre-Departure Risk Engine
- **Input**: Route weather coordinates, airframe component telemetry, airspace corridor occupancy, and crew duty times.
- **Output**: Composite Risk Rating out of 100 with sub-scores.

#### Composite Risk Rating Formula
```
composite_risk = weather_score × 0.40 + health_score × 0.30 + traffic_score × 0.15 + human_score × 0.15
```

#### Airframe Health Rating Formula
```
health_score = egt_score × 0.35 + hyd_score × 0.35 + oil_score × 0.15 + battery_score × 0.15
```

---

## 📡 API Reference

Interactive docs available at **`http://localhost:8000/docs`** (Swagger UI) or **`/redoc`**.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/flights` | — | List operational active & scheduled flights with risk metrics |
| `GET` | `/api/flights/{flight_id}` | — | Get flight safety briefings, enroute hazard segments, and telemetry |
| `GET` | `/api/alerts` | — | List active warning and critical alerts |
| `GET` | `/api/aircraft/health` | — | Retrieve fleet status, health scores, failure forecasts, and anomalies |
| `POST` | `/api/assistant/query` | — | Send operations query to the Gemini AI advisor |
| `POST` | `/api/simulator/tick` | — | Inject hydraulic leaks and powerplant thermal drifts into the telemetry |

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Flight Director** | Approves pre-departure release clearances, monitors composite corridor risks |
| **Safety Inspector** | Audits explainable AI safety attributions, inspects enroute segments |
| **Operations Manager** | Monitors fleet airframe health matrices and failure forecast curves |
| **Maintenance Engineer** | Evaluates airframe schematics, reads drift variables, executes repair work orders |

---

## 🗄️ Database Schema

6 tables with primary key references, foreign keys, and cascading relationships:

```
operators ──> aircraft ──> telemetry_snapshots
                       ──> alerts
          ──> flights ──> risk_scores
                      ──> alerts
```

See [`backend/app/db/models.py`](backend/app/db/models.py) for the SQLAlchemy ORM declarations.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | Next.js | 15.0 |
| UI Library | React | 18.3 |
| Styling | Tailwind CSS | 4.0 |
| Component Library | Lucide Icons | — |
| Charts | Recharts | 2.12 |
| Animations | Framer Motion | 11.3 |
| Backend Framework | FastAPI | 0.109+ |
| ORM | SQLAlchemy | 2.0+ |
| Database | SQLite / PostgreSQL | — |
| AI — LLM & RAG | Google Generative AI | 0.4+ |
| Model Core | Gemini 1.5 Flash | — |
| Telemetry Analytics | Custom Health Service | — |

---

## 🧪 Development

### Running Tests

```bash
# Backend
cd backend
pip install pytest httpx
python -m pytest tests/ -v

# Frontend
cd frontend
npm run build   # Validates TypeScript, imports, and compile health
```

### Simulating Telemetry Drift

```bash
# Trigger an airframe degradation anomaly
curl -X POST http://localhost:8000/api/simulator/tick
```

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

### Backend → Render

Configure the start command in the Render dashboard:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) — Generative safety advisor and RAG pipeline
- [FastAPI](https://fastapi.tiangolo.com/) — High-performance backend API framework
- [SQLAlchemy](https://www.sqlalchemy.org/) — Database ORM and managers
- [Tailwind CSS 4](https://tailwindcss.com/) — Modern typography rendering and layouts
- [Recharts](https://recharts.org) — Telemetry graphing library

---

<div align="center">

Built with 🛡️ for aviation safety

**SkyGuardian AI** — *Assuring the future of aerospace pre-departure intelligence*

</div>
