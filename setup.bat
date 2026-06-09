@echo off
chcp 65001 >nul
title 🚀 Feirinha Express - Setup

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           🎉 FEIRINHA EXPRESS - CONFIGURAÇÃO 🚀             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Verificar se está no diretório correto
cd /d "%~dp0"
set ROOT_DIR=%cd%

echo 📁 diretório atual: %ROOT_DIR%
echo.

:: Verificar Node.js
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado! Instale em https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js detectado

:: Verificar npm
echo 🔍 Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
)
echo ✅ npm detectado
echo.

:: Menu de opções
echo Selecione uma opcao:
echo.
echo   [1] 🚀 Instalar dependências (npm install)
echo   [2] 🐳 Subir containers Docker (PostgreSQL + Redis)
echo   [3] 🗄️  Rodar migrations do banco
echo   [4] 🌱 Popular banco com dados demo (seed)
echo   [5] ▶️  Iniciar projeto (dev)
echo   [6] 🔨 Build de produção
echo   [7] 📦 Build com Docker
echo   [8] ⏹️  Parar containers Docker
echo   [9] 🔄 Limpar node_modules e reinstalar
echo  [10] 🚪 Sair
echo.

set /p OPCAO="Digite a opcao (1-10): "

if "%OPCAO%"=="1" goto INSTALL
if "%OPCAO%"=="2" goto DOCKER_UP
if "%OPCAO%"=="3" goto MIGRATE
if "%OPCAO%"=="4" goto SEED
if "%OPCAO%"=="5" goto DEV
if "%OPCAO%"=="6" goto BUILD
if "%OPCAO%"=="7" goto DOCKER_BUILD
if "%OPCAO%"=="8" goto DOCKER_DOWN
if "%OPCAO%"=="9" goto CLEAN
if "%OPCAO%"=="10" goto FIM

echo.
echo ❌ Opção inválida!
goto FIM

:INSTALL
echo.
echo ═══════════════════════════════════════
echo 📦 Instalando dependências...
echo ═══════════════════════════════════════
call npm install
if errorlevel 1 (
    echo.
    echo ❌ Erro na instalação!
    pause
    exit /b 1
)
echo.
echo ✅ Dependências instaladas com sucesso!
echo.
set /p CONTINUE="Deseja executar outra opcao? (S/N): "
if /i "%CONTINUE%"=="S" goto :EOF
goto FIM

:DOCKER_UP
echo.
echo ═══════════════════════════════════════
echo 🐳 Subindo containers Docker...
echo ═══════════════════════════════════════
echo.
echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não encontrado! Instale Docker Desktop.
    pause
    exit /b 1
)
echo.
echo ⚠️  Pressione Ctrl+C para cancelar em 3 segundos...
timeout /t 3 >nul
echo.
call docker-compose up -d
if errorlevel 1 (
    echo.
    echo ❌ Erro ao subir containers!
    echo.
    echo Verifique se:
    echo   1. Docker Desktop está aberto
    echo   2. Ports 5432 e 6379 estão disponíveis
    pause
    exit /b 1
)
echo.
echo ✅ Containers subidos com sucesso!
echo.
echo 📊 Status dos containers:
docker-compose ps
echo.
set /p CONTINUE="Deseja executar outra opcao? (S/N): "
if /i "%CONTINUE%"=="S" goto :EOF
goto FIM

:MIGRATE
echo.
echo ═══════════════════════════════════════
echo 🗄️  Rodando migrations do banco...
echo ═══════════════════════════════════════
call npm run db:migrate --workspace=apps/api
if errorlevel 1 (
    echo.
    echo ❌ Erro nas migrations!
    pause
    exit /b 1
)
echo.
echo ✅ Migrations executadas com sucesso!
echo.
set /p CONTINUE="Deseja executar outra opcao? (S/N): "
if /i "%CONTINUE%"=="S" goto :EOF
goto FIM

:SEED
echo.
echo ═══════════════════════════════════════
echo 🌱 Populando banco com dados demo...
echo ═══════════════════════════════════════
call npm run db:seed --workspace=apps/api
if errorlevel 1 (
    echo.
    echo ❌ Erro no seed!
    pause
    exit /b 1
)
echo.
echo ✅ Banco populado com sucesso!
echo.
echo 🔑 Credenciais de acesso:
echo    Lojista: lojista@demo.com / demo123
echo    Cliente: cliente@demo.com / demo123
echo.
set /p CONTINUE="Deseja executar outra opcao? (S/N): "
if /i "%CONTINUE%"=="S" goto :EOF
goto FIM

:DEV
echo.
echo ═══════════════════════════════════════
echo ▶️  Iniciando projeto em modo desenvolvimento...
echo ═══════════════════════════════════════
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:3001
echo.
echo Pressione Ctrl+C para parar.
echo.
call npm run dev
goto FIM

:BUILD
echo.
echo ═══════════════════════════════════════
echo 🔨 Gerando build de produção...
echo ═══════════════════════════════════════
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Erro no build!
    pause
    exit /b 1
)
echo.
echo ✅ Build gerado com sucesso!
echo.
echo Execute 'npm run start' para iniciar.
echo.
pause
goto FIM

:DOCKER_BUILD
echo.
echo ═══════════════════════════════════════
echo 📦 Gerando imagens Docker...
echo ═══════════════════════════════════════
call docker-compose build
if errorlevel 1 (
    echo.
    echo ❌ Erro no build Docker!
    pause
    exit /b 1
)
echo.
echo ✅ Imagens Docker geradas!
echo.
pause
goto FIM

:DOCKER_DOWN
echo.
echo ═══════════════════════════════════════
echo ⏹️  Parando containers Docker...
echo ═══════════════════════════════════════
call docker-compose down
echo.
echo ✅ Containers parados!
echo.
pause
goto FIM

:CLEAN
echo.
echo ═══════════════════════════════════════
echo 🔄 Limpando node_modules...
echo ═══════════════════════════════════════
if exist "node_modules" (
    echo Removendo node_modules...
    rmdir /s /q node_modules
)
if exist "apps\web\node_modules" (
    rmdir /s /q apps\web\node_modules
)
if exist "apps\api\node_modules" (
    rmdir /s /q apps\api\node_modules
)
echo.
echo ✅ Limpeza concluída!
echo.
echo Iniciando reinstall...
call npm install
if errorlevel 1 (
    echo ❌ Erro na reinstall!
    pause
    exit /b 1
)
echo.
echo ✅ Dependências reinstaladas!
echo.
pause
goto FIM

:FIM
echo.
echo ═══════════════════════════════════════
echo Obrigado por usar Feirinha Express! 👋
echo ═══════════════════════════════════════
echo.
pause