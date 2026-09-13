@echo off
chcp 65001 >nul
title VoidTracker - LoL Personal Tracker v0.1

cd /d "%~dp0"

echo ================================================================
echo    🌌  VOIDTRACKER - LEAGUE OF LEGENDS PERSONAL TRACKER
echo ================================================================
echo.
echo [1/2] Sprawdzanie środowiska Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [BŁĄD] Node.js nie został znaleziony! Zainstaluj Node.js ze strony: https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Wykryto pierwsze uruchomienie. Trwa instalacja pakietów...
    call npm install
)

echo [2/2] Uruchamianie serwera Pustki...
echo.
echo Adres lokalny: http://localhost:3000
echo Przeglądarka otworzy się automatycznie.
echo.
echo (Aby zatrzymać działanie strony, naciśnij Ctrl+C lub zamknij to okno)
echo ----------------------------------------------------------------
echo.

call npm run dev

pause
