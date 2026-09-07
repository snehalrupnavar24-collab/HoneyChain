from fastapi import FastAPI

app = FastAPI(
    title="HoneyChain Backend",
    description="Backend API for HoneyChain",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "HoneyChain Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }