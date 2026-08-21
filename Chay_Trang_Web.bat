@echo off
title Thi Ca Lan Dinh - Server
echo ========================================================
echo   DANG KHOI CHAY TRANG WEB THI CA LAN DINH...
echo ========================================================
echo.
cd /d "%~dp0"
cmd /c npm run dev
pause
