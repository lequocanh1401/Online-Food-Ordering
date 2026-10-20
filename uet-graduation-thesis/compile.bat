@echo off
chcp 65001 > nul
echo ===============================================================
echo     BIEN DICH KHOA LUAN TOT NGHIEP VNU-UET (LUALATEX)
echo ===============================================================
echo.

where lualatex >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay trinh bien dich LuaLaTeX trong he thong!
    echo Ban vui long cai dat TeX Live hoac MiKTeX, hoac su dung Overleaf (chon Compiler: LuaLaTeX).
    echo Xem huong dan chi tiet tai tep README.md.
    echo.
    pause
    exit /b 1
)

echo [1/2] Dang chay LuaLaTeX lan 1 de khoi tao aux, toc, lof, lot...
lualatex -synctex=1 -interaction=nonstopmode main.tex

echo.
echo [2/2] Dang chay LuaLaTeX lan 2 de cap nhat danh muc va so trang...
lualatex -synctex=1 -interaction=nonstopmode main.tex

if exist main.pdf (
    echo.
    echo ===============================================================
    echo [THANH CONG] Da xuat tep main.pdf thanh cong!
    echo ===============================================================
) else (
    echo.
    echo [CANH BAO] Qua trinh bien dich gap loi, vui long kiem tra main.log!
)

echo.
pause
