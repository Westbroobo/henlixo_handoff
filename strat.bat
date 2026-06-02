@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND_PORT=8000"
set "FRONTEND_PORT=5174"

cd /d "%ROOT%"

echo.
echo Henlixo local startup
echo Backend:  http://127.0.0.1:%BACKEND_PORT%
echo Frontend: http://127.0.0.1:%FRONTEND_PORT%
echo.

py -3.13 --version >nul 2>&1
if %errorlevel%==0 (
  set "PYTHON_CMD=py -3.13"
) else (
  set "PYTHON_CMD=python"
)

if not exist "backend\.venv\Scripts\python.exe" (
  echo Creating backend virtual environment...
  %PYTHON_CMD% -m venv "backend\.venv"
  if errorlevel 1 (
    echo Failed to create backend virtual environment.
    pause
    exit /b 1
  )
)

echo Installing backend dependencies...
"backend\.venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
  echo Failed to install backend dependencies.
  pause
  exit /b 1
)

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies...
  pushd "frontend"
  npm install
  if errorlevel 1 (
    popd
    echo Failed to install frontend dependencies.
    pause
    exit /b 1
  )
  popd
)

echo Starting FastAPI backend...
start "Henlixo API" /D "%ROOT%backend" cmd /k ".venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port %BACKEND_PORT%"

echo Starting Vite frontend...
start "Henlixo Frontend" /D "%ROOT%frontend" cmd /k "npm run dev -- --host 127.0.0.1 --port %FRONTEND_PORT%"

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:%FRONTEND_PORT%/"

echo.
echo Startup commands sent. Keep the opened API and Frontend windows running.
echo.
pause
