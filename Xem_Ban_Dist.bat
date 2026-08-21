@echo off
title Thi Ca Lan Dinh - Production Preview
echo ========================================================
echo   DANG MO BAN PRODUCTION (DIST) THI CA LAN DINH...
echo ========================================================
echo.
cd /d "%~dp0"
start http://localhost:4173
cmd /c npm run preview
pause
