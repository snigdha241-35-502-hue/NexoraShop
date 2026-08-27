@echo off
cd /d "%~dp0backend"
echo Installing backend dependencies...
call npm install
if errorlevel 1 (
  echo npm install failed.
  pause
  exit /b 1
)
echo Starting NexoraShop backend...
call npm start
pause
