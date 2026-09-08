from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .database import Base, engine
from . import models

from .routers import (
    auth,
    beekeeper,
    hive,
    harvest,
    collection,
    processing,
    lab,
    packaging,
    sensor,
    ai,
    consumer,
    discrepancy,
)


app = FastAPI(
    title="HoneyChain Backend",
    description="AI-Verified Blockchain Traceability Platform for Honey",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database tables exist
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "HoneyChain Backend is running",
        "status": "success",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected"
    }


# Mount Routers
app.include_router(auth.router)
app.include_router(beekeeper.router)
app.include_router(hive.router)
app.include_router(harvest.router)
app.include_router(collection.router)
app.include_router(processing.router)
app.include_router(lab.router)
app.include_router(packaging.router)
app.include_router(sensor.router)
app.include_router(ai.router)
app.include_router(consumer.router)
app.include_router(discrepancy.router)