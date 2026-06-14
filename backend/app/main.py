import os
import sys
# Prevents Python 3.14 C-extension loading crash in google-protobuf
sys.modules['google._upb._message'] = None

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import router as api_router
from app.db.session import engine, Base, SessionLocal
from app.db.models import Flight
from app.db.seed import seed_db

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Check and auto-seed database if empty
db = SessionLocal()
try:
    if db.query(Flight).count() == 0:
        print("SkyGuardian Database is empty. Initiating automatic seeding...")
        seed_db()
    else:
        print("SkyGuardian Database has existing records. Skipping seeding.")
except Exception as e:
    print(f"Startup database validation failed: {e}")
finally:
    db.close()


app = FastAPI(
    title="SkyGuardian AI - Predictive Aviation Safety API",
    description="Backend risk scoring and safety intelligence platform",
    version="1.0.0-mvp"
)

# CORS configurations
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

allow_all_origins = "*" in origins or len(origins) == 0

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all_origins else origins,
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to SkyGuardian AI safety intelligence engine API"}
