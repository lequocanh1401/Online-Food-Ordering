@echo off
chcp 65001 >nul
title DUNG TOAN BO HE THONG ONLINE FOOD ORDERING

echo ==============================================================================
echo    DANG DUNG TOAN BO TIEN TRINH HE THONG F&B (SPRING BOOT & VITE)
echo ==============================================================================
echo.

echo [1/2] Dang dong tien trinh Backend tren cong 5454...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5454 ^| findstr LISTENING') do (
    echo     -> Dung PID: %%a
    taskkill /F /T /PID %%a >nul 2>&1
)

echo [2/2] Dang dong tien trinh Frontend tren cong 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo     -> Dung PID: %%a
    taskkill /F /T /PID %%a >nul 2>&1
)

echo.
echo ==============================================================================
echo    DA DUNG VA GIAI PHONG TAT CA CONG MANG SACH SE!
echo    Bay gio ban co the yen tam tat may hoac khoi dong lai bat cu luc nao.
echo ==============================================================================
timeout /t 3 >nul
