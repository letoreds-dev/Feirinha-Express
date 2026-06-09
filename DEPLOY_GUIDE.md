# 🚀 GUIA DE DEPLOY - FEIRINHA EXPRESS

## Infraestrutura

| Serviço | Uso | Custo | Limites |
|--------|-----|-------|---------|
| **Neon** | PostgreSQL | Gratuito | 480MB storage |
| **Railway** | API Fastify | $5/grátis | 500MB RAM, 500h/mês |
| **Vercel** | Frontend Next.js | Gratuito | 100GB bandwidth |

---

## PASSO 1: Criar Banco de Dados (Neon)

### 1.1 Acesse [neon.tech](https://neon.tech)

### 1.2 Crie uma conta (GitHub login)

### 1.3 Crie um novo projeto:
```
Project Name: feirinha-express
Database Name: feirinha_db
Region: São Paulo (gru)
```

### 1.4 Copie a Connection String:
```
postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/feirinha_db?sslmode=require
```

### 1.5 Adicione ao `.env` da API:
```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/feirinha_db?sslmode=require"
```

---

## PASSO 2: Deploy da API (Railway)

### 2.1 Acesse [railway.app](https://railway.app)

### 2.2 Conecte seu GitHub
- Vá em **Settings** > **Linked Accounts**
- Conecte GitHub

### 2.3 Crie um novo projeto:
- **New Project** > **Deploy from GitHub repo**
- Selecione o repositório `feirinha-express`
- Escolha o repositório

### 2.4 Configure o deploy:
- **Root Directory**: `apps/api`
- **Build Command**: `npx prisma migrate deploy && npm run build`
- **Start Command**: `node dist/index.js`

### 2.5 Adicione variáveis de ambiente:
```
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/feirinha_db?sslmode=require
JWT_SECRET=generate-a-secure-random-string-here
REDIS_URL=redis://default:password@redis-host.railway.app:6379
PORT=3001
NODE_ENV=production
```

### 2.6 Deploy:
- Railway vai detectar o Dockerfile automaticamente
- O deploy começa automaticamente
- Aguarde ~3-5 minutos

### 2.7 Copie a URL da API:
- Vá em **Settings** > **Networking** > **Public Networking**
- Copie a URL: `https://feirinha-api.up.railway.app`

---

## PASSO 3: Deploy do Frontend (Vercel)

### 3.1 Acesse [vercel.com](https://vercel.com)

### 3.2 Importe o projeto:
- **Add New** > **Project**
- Importe do GitHub
- Selecione `feirinha-express`
- **Root Directory**: `apps/web`

### 3.3 Configure as variáveis de ambiente:
```
NEXT_PUBLIC_API_URL=https://feirinha-api.up.railway.app
```

### 3.4 Deploy:
- Clique em **Deploy**
- Aguarde ~2 minutos
- Copie a URL: `https://feirinha-express.vercel.app`

---

## PASSO 4: Configurar Redis (Opcional)

### 4.1 Adicione Redis no Railway:
- **New Project** > **Add Redis**
- Escolha **Redis** > **TinyTiny**

### 4.2 Copie a URL de conexão:
```
REDIS_URL=redis://default:password@host:port
```

### 4.3 Adicione ao Railway da API

---

## PASSO 5: Seed do Banco (Opcional)

### 5.1 Conecte ao banco via psql:
```bash
psql "postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/feirinha_db?sslmode=require"
```

### 5.2 Execute o seed:
```bash
cd apps/api
npx prisma db seed
```

---

## VARIÁVEIS DE AMBIENTE COMPLETAS

### API (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/feirinha_db?sslmode=require"

# Auth
JWT_SECRET="generate-with-openssl-rand-base64-32"

# Redis (opcional)
REDIS_URL="redis://default:password@host:port"

# Server
PORT=3001
NODE_ENV=production
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL="https://feirinha-api.up.railway.app"
```

---

## DOMÍNIOS PERSONALIZADOS (Futuro)

### Vercel
1. Settings > Domains
2. Adicione `feirinhaexpress.com`
3. Configure DNS

### Railway
1. Settings > Networking > Custom Domains
2. Adicione `api.feirinhaexpress.com`

---

## MONITORAMENTO

### Railway
- **Metrics**: Uso de CPU, RAM, Network
- **Logs**: Logs em tempo real
- **Deployments**: Histórico de deploys

### Vercel
- **Analytics**: Pageviews, Core Web Vitals
- **Logs**: Request logs
- **Functions**: Serverless function logs

---

## TROUBLESHOOTING

### API não inicia
```bash
# Ver logs
railway logs

# Verificar variáveis
railway variables
```

### Erro de conexão banco
- Verificar `DATABASE_URL`
- Verificar se Neon está ativo
- Testar conexão com `psql`

### Erro 500 na API
- Verificar `JWT_SECRET`
- Verificar logs do Railway
- Testar endpoint `/health`

---

## URLs DO PROJETO

| Serviço | URL |
|---------|-----|
| **Frontend** | https://feirinha-express.vercel.app |
| **API** | https://feirinha-api.up.railway.app |
| **API Health** | https://feirinha-api.up.railway.app/api/health |
| **Neon Console** | https://console.neon.tech |

---

## PRÓXIMOS PASSOS

1. [ ] Configurar Custom Domain
2. [ ] Configurar CI/CD (GitHub Actions)
3. [ ] Configurar Monitoramento (Sentry)
4. [ ] Configurar Email (Resend/SendGrid)
5. [ ] Configurar Pagamentos (Stripe/Pagarme)
