@echo off
chcp 65001 >nul
title KHOI DONG LAI BACKEND SPRING BOOT (PORT 5454)

echo ==============================================================================
echo    KHOI DONG LAI RIENG BACKEND SPRING BOOT (PORT 5454)
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Dang giai phong cong 5454 va tien trinh Java cu (neu co)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5454 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { if ($_ -gt 0) { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }" >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5454') do (
    if not "%%a"=="0" taskkill /F /T /PID %%a >nul 2>&1
)
echo     [OK] Cong 5454 da duoc giai phong hoan toan sach se!
echo.

echo [2/3] Khoi dong Backend Spring Boot...
cd /d "%~dp0Online-Food-Ordering"
start "SPRING BOOT BACKEND [Port 5454]" cmd /k "chcp 65001 >nul && echo Dang khoi dong Backend Spring Boot... && mvnw.cmd spring-boot:run"

echo.
echo [3/3] Dang cho Backend san sang (thuong mat 12 - 15 giay)...
:WAIT_BACKEND
timeout /t 2 /nobreak >nul
netstat -aon | findstr :5454 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo     -> Backend dang nap context va database, vui long doi...
    goto WAIT_BACKEND
)

echo     [OK] Backend Spring Boot da san sang 100%%! (Giu nguyen du lieu & anh hien co trong MySQL)
echo.
echo ==============================================================================
echo    BACKEND DA KHOI DONG THANH CONG TAI: http://localhost:5454
echo ==============================================================================
timeout /t 5 >nul
