#!/bin/bash
# ============================================
# SCRIPT DE DEPLOY - FEIRINHA EXPRESS
# ============================================
# Uso: ./deploy.sh
# ============================================

set -e

echo "🚀 Iniciando deploy..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar variáveis
check_var() {
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL não está definida${NC}"
        echo "Configure no Railway ou exporte manualmente:"
        echo "export DATABASE_URL='postgresql://...'"
        exit 1
    fi
}

# 1. Gerar Prisma Client
echo -e "${YELLOW}📦 Gerando Prisma Client...${NC}"
npx prisma generate

# 2. Migrar banco
echo -e "${YELLOW}🔄 Executando migrations...${NC}"
npx prisma migrate deploy

# 3. Seed (opcional)
if [ "$RUN_SEED" = "true" ]; then
    echo -e "${YELLOW}🌱 Executando seed...${NC}"
    npx prisma db seed
fi

# 4. Build
echo -e "${YELLOW}🔨 Buildando aplicação...${NC}"
npm run build

# 5. Iniciar
echo -e "${GREEN}✅ Deploy completo!${NC}"
echo "Iniciando servidor..."
npm run start
