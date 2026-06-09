# ============================================
# FEIRINHA EXPRESS - COMO RODAR
# ============================================

O projeto Feirinha Express agora usa SQLite por padrao (nao precisa de Docker!).

## Opcao 1: Setup Automatico (Recomendado)

1. Clique duas vezes em `setup.bat`
2. Aguarde a configuracao automatica
3. Escolha iniciar o projeto

## Opcao 2: Comandos Manuais

```bash
# 1. Instalar dependencias
npm install

# 2. Gerar Prisma Client
cd apps/api
npx prisma generate
cd ../..

# 3. Criar banco SQLite
cd apps/api
npx prisma db push --force-reset

# 4. Inserir dados demo
npm run db:seed
cd ..

# 5. Iniciar projeto
npm run dev
```

## Acessar o Sistema

| Servico | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |

## Credenciais Demo

| Tipo | Email | Senha |
|------|-------|-------|
| Cliente | cliente@demo.com | demo123 |
| Lojista | lojista@demo.com | demo123 |
| Lojista | fanaticos@demo.com | demo123 |
| Lojista | mobile@demo.com | demo123 |
| Lojista | tech@demo.com | demo123 |
| Lojista | game@demo.com | demo123 |

## Parar o Projeto

Pressione `Ctrl+C` no terminal onde esta rodando.

## Arquivos Criados

| Arquivo | Descricao |
|---------|-----------|
| setup.bat | Script de setup automatico |
| setup.ps1 | Script PowerShell alternativo |
| apps/api/prisma/dev.db | Banco de dados SQLite |

## Problemas Comuns

### Porta ja em uso
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Resetar banco de dados
```bash
cd apps/api
npx prisma db push --force-reset
npm run db:seed
```

### Reinstalar dependencias
```bash
rm -rf node_modules
npm install
```