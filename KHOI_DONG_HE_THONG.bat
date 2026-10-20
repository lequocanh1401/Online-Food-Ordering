@echo off
chcp 65001 >nul
title KHOI DONG NEN TANG ONLINE FOOD ORDERING - UET / VNU THESIS

echo ==============================================================================
echo    HE THONG THUONG MAI DIEN TU F&B TICH HOP QUAN TRI THONG MINH (UET / VNU)
echo    Kich Ban Khoi Dong Tu Dong 1-Click - Do An Tot Nghiep Dai Hoc
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/4] Kiem tra va giai phong cac cong mang (5454, 5173) neu bi treo...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5454 ^| findstr LISTENING') do (
    echo     -> Phat hien tien trinh cu chiem cong 5454 (PID: %%a). Dang giai phong...
    taskkill /F /T /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo     -> Phat hien tien trinh cu chiem cong 5173 (PID: %%a). Dang giai phong...
    taskkill /F /T /PID %%a >nul 2>&1
)
echo     [OK] Cong mang sach se va san sang!
echo.

echo [2/4] Khoi dong Spring Boot Backend (Port 5454)...
cd /d "%~dp0Online-Food-Ordering"
start "SPRING BOOT BACKEND [Port 5454]" cmd /k "chcp 65001 >nul && echo Dang khoi dong Backend Spring Boot... && mvnw.cmd spring-boot:run"

echo [3/4] Khoi dong React Frontend Vite (Port 5173)...
cd /d "%~dp0food-ordering-frontend"
start "REACT FRONTEND [Port 5173]" cmd /k "chcp 65001 >nul && echo Dang khoi dong Frontend Vite... && npm run dev"

echo.
echo [4/4] Dang cho Backend va Frontend san sang (khoang 8 giay)...
timeout /t 8 /nobreak >nul

echo.
echo ==============================================================================
echo    HE THONG DA KHOI DONG THANH CONG!
echo    - Backend API:       http://localhost:5454
echo    - Real-time WS:      ws://localhost:5454/ws/orders
echo    - Frontend App:      http://localhost:5173
echo    - Admin Dashboard:   http://localhost:5173/admin/restaurant
echo.
echo    Dang tu dong mo trinh duyet...
echo ==============================================================================
start http://localhost:5173

pause
