@echo off
chcp 65001 >nul
color 0A
title Feirinha Express - Centro de Comando

echo.
echo =========================================
echo    FEIRINHA EXPRESS - CENTRO DE COMANDO
echo =========================================
echo.

cd /d "%~dp0"

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado!
    pause
    exit /b 1
)

echo [OK] Node.js:
node --version
echo.

:: Verificar se dependencias do dev-agents estao instaladas
if not exist "packages\dev-agents\node_modules" (
    echo [PASSO] Instalando dependencias do Centro de Comando...
    cd packages\dev-agents
    call npm install
    cd ..\..
    echo [OK] Dependencias instaladas!
    echo.
)

:: Iniciar Centro de Comando
echo.
echo =========================================
echo    AGENTES ONLINE
echo =========================================
echo.
echo  👩‍💻 Marina  - Frontend Engineer
echo  ⚙️ Carlos  - Backend Engineer
echo  ✨ Lucas   - Features Engineer
echo  🔍 Ana     - QA Engineer
echo.
echo =========================================
echo.

cd packages\dev-agents
call npx tsx src/index.ts