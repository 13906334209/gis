@echo off
echo Starting Backend Server...
cd /d %~dp0backend
echo Current directory: %CD%
echo Checking main.py...
if exist main.py (
    echo main.py found!
    echo Installing dependencies...
    pip install -r requirements.txt
    echo Starting server...
    python -m uvicorn main:app --reload --port 8000 --host 127.0.0.1
) else (
    echo ERROR: main.py not found in %CD%
    pause
)

