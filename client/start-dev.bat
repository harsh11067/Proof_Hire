@echo off
echo Starting ProofHire Development Environment...
echo.

echo Starting Backend Server on port 3001...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run backend"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server on port 5173...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul




