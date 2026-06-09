@echo off
chcp 65001 >nul
color 0A
title Feirinha Express - Centro de Comando 24/7

echo.
echo ==============================================================
echo        FEIRINHA EXPRESS - CENTRO DE COMANDO 24/7
echo ==============================================================
echo.
echo  Agentes implementando funcionalidades automaticamente
echo.
echo  Configuracoes:
echo    - Intervalo: 15 minutos
echo    - Duracao: 10 horas
echo    - Agentes ativos: Marina, Carlos, Lucas, Ana, Paula
echo.
echo ==============================================================
echo.

cd /d "%~dp0"

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado!
    pause
    exit /b 1
)

:: Verificar dependencias
if not exist "packages\dev-agents\node_modules" (
    echo [PASSO] Instalando dependencias...
    cd packages\dev-agents
    call npm install
    cd ..\..
    echo [OK] Dependencias instaladas!
    echo.
)

:: Limpar terminal e iniciar
cls

cd packages\dev-agents
echo.
echo Iniciando Centro de Comando...
echo.
npx tsx src/center-real.ts