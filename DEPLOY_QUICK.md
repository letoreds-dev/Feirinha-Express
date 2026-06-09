# 🚀 DEPLOY RÁPIDO - FEIRINHA EXPRESS

## Passo 1: Neon (Banco de Dados)

1. Acesse [neon.tech](https://neon.tech)
2. Crie projeto: `feirinha-express`
3. Copie a **Connection String**

## Passo 2: Railway (API)

1. Acesse [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecione `feirinha-express`
4. **Root Directory**: `apps/api`
5. Adicione variáveis:
   ```
   DATABASE_URL=postgresql://... (do Neon)
   JWT_SECRET=gerar-com-openssl-rand-base64-32
   NODE_ENV=production
   ```
6. Deploy automático! ✅

## Passo 3: Vercel (Frontend)

1. Acesse [vercel.com](https://vercel.com)
2. **Import** → Selecione `feirinha-express`
3. **Root Directory**: `apps/web`
4. Adicione variável:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api.railway.app
   ```
5. Deploy automático! ✅

## Passo 4: Seed (Dados de Teste)

```bash
cd apps/api
export DATABASE_URL="postgresql://..."
npx prisma db push
npx prisma db seed
```

## URLs Temporárias

Após deploy:
- **API**: `https://feirinha-api.up.railway.app`
- **Frontend**: `https://feirinha-express.vercel.app`

## Testar

```bash
# Health check
curl https://feirinha-api.up.railway.app/api/health

# Login demo
curl -X POST https://feirinha-api.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@demo.com","password":"demo123"}'
```

## Domínio Próprio (Futuro)

### Vercel
Settings → Domains → Adicionar `feirinhaexpress.com`

### Railway
Settings → Networking → Custom Domains → Adicionar `api.feirinhaexpress.com`

---

## 📧 Credenciais Demo

| Tipo | Email | Senha |
|------|-------|-------|
| Cliente | cliente@demo.com | demo123 |
| Lojista | burger@demo.com | demo123 |
| Entregador | entregador1@demo.com | demo123 |
