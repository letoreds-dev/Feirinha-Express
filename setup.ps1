# ============================================
# FEIRINHA EXPRESS - SETUP (PowerShell)
# ============================================

$ErrorActionPreference = "Continue"

function Write-Step { param($msg) Write-Host "[PASSO] $msg" -ForegroundColor Cyan }
function Write-OK { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[AVISO] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERRO] $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   FEIRINHA EXPRESS - SETUP AUTOMATICO  " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Verificar Node.js
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Err "Node.js nao encontrado!"
    Write-Host "   Instale o Node.js: https://nodejs.org/"
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-OK "Node.js: $(node --version)"
Write-Host ""

# PASSO 1: Instalar dependencias
Write-Host "==========================================" -ForegroundColor Cyan
Write-Step "Instalando dependencias..."
Write-Host "==========================================" -ForegroundColor Cyan

npm install | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Err "Falha na instalacao!"
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-OK "Dependencias instaladas!"
Write-Host ""

# PASSO 2: Gerar Prisma Client
Write-Host "==========================================" -ForegroundColor Cyan
Write-Step "Gerando Prisma Client..."
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location apps\api
npx prisma generate | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Prisma pode ja estar gerado"
} else {
    Write-OK "Prisma Client pronto!"
}
Set-Location ..
Write-Host ""

# PASSO 3: Verificar Docker
Write-Host "==========================================" -ForegroundColor Cyan
Write-Step "Verificando Docker..."
Write-Host "==========================================" -ForegroundColor Cyan

$dockerCheck = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerCheck) {
    Write-Warn "Docker nao encontrado!"
    Write-Host ""
    Write-Host "Para o banco de dados funcionar, instale o Docker:"
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O frontend pode rodar em modo demo offline."
    Write-Host ""
    $continue = Read-Host "Tentar continuar mesmo assim? (S/N)"
    if ($continue -ne "S" -and $continue -ne "s") {
        Write-Host ""
        Write-Host "Setup cancelado. Apos instalar o Docker, execute este script novamente."
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-OK "Docker encontrado!"
    docker --version
    Write-Host ""
    Write-Step "Subindo containers..."
    docker compose up -d | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Nao foi possivel subir containers"
    } else {
        Write-OK "Containers subiram!"
        Write-Host "Aguardando banco ficar pronto..."
        Start-Sleep -Seconds 8
    }
    Write-Host ""
}

# PASSO 4: Migrar banco
Write-Host "==========================================" -ForegroundColor Cyan
Write-Step "Configurando banco de dados..."
Write-Host "==========================================" -ForegroundColor Cyan

$dbReady = docker exec feirinha-postgres pg_isready -U postgres 2>$null
if ($LASTEXITCODE -eq 0) {
    Set-Location apps\api
    npx prisma migrate dev --name init --skip-generate 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        npx prisma db push --force-reset 2>$null | Out-Null
    }
    Set-Location ..
    Write-OK "Banco configurado!"
} else {
    Write-Warn "Banco nao disponivel (Docker necessario)"
}
Write-Host ""

# PASSO 5: Seed
Write-Host "==========================================" -ForegroundColor Cyan
Write-Step "Inserindo dados demo..."
Write-Host "==========================================" -ForegroundColor Cyan

$dbReady = docker exec feirinha-postgres pg_isready -U postgres 2>$null
if ($LASTEXITCODE -eq 0) {
    Set-Location apps\api
    npm run db:seed 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Seed pode ja ter sido executado"
    } else {
        Write-OK "Dados demo inseridos!"
    }
    Set-Location ..
} else {
    Write-Warn "Seed pulado (banco nao disponivel)"
}
Write-Host ""

# FINALIZADO
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host " [OK] SETUP CONCLUIDO!" -ForegroundColor Green
Write-Host ""
Write-Host " URLs disponiveis (se Docker estiver rodando):"
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host " Login demo:"
Write-Host "   Cliente:  cliente@demo.com / demo123" -ForegroundColor Yellow
Write-Host "   Lojista:  lojista@demo.com / demo123" -ForegroundColor Yellow
Write-Host ""
Write-Host " Se o banco nao subiu:"
Write-Host "   1. Abra o Docker Desktop"
Write-Host "   2. Aguarde ate estar 'running'"
Write-Host "   3. Execute este script novamente"
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Perguntar se quer iniciar
$iniciar = Read-Host "Deseja iniciar o projeto agora? (S/N)"
if ($iniciar -eq "S" -or $iniciar -eq "s") {
    Write-Host ""
    Write-Host "Iniciando..." -ForegroundColor Cyan
    Write-Host "(Pressione Ctrl+C para parar)" -ForegroundColor Gray
    Write-Host ""
    npm run dev
}