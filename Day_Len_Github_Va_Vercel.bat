@echo off
title Day code len GitHub va Tu dong Deploy Vercel
echo ========================================================
echo   DANG DONG BO CODE LEN GITHUB VA VERCEL...
echo ========================================================
echo.
cd /d "%~dp0"

echo 1. Dang kiem tra thay doi...
git add .

set /p msg="Nhap ghi chu cap nhat (hoac Enter de mac dinh): "
if "%msg%"=="" set msg=Cap nhat Thi Ca Lan Dinh: %date% %time%

echo 2. Dang Commit thay doi: "%msg%"...
git commit -m "%msg%"

echo 3. Dang Push len GitHub (Vercel se tu dong nhan va deploy trong 30s)...
git push origin main

echo.
echo ========================================================
echo   HOAN TAT! GitHub va Vercel dang tu dong cap nhat!
echo ========================================================
pause
