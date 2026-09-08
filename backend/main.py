import sys
import os

# Support running uvicorn from workspace root or from backend folder
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app.main import app
except ImportError:
    from backend.app.main import app