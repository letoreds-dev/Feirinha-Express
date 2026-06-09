# 🎉 Feirinha Express - Guia de Setup

## ⚡ Setup Rápido (5 minutos)

Siga estes passos na ordem para colocar o projeto para funcionar:

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Subir Banco de Dados (Docker)
```bash
npm run docker:up
```
> **Precisa ter [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado!**

### Passo 3: Rodar Migrations
```bash
npm run db:migrate --workspace=apps/api
```

### Passo 4: Popular Banco com Dados Demo
```bash
npm run db:seed --workspace=apps/api
```

### Passo 5: Iniciar o Projeto
```bash
npm run dev
```

---

## 🌐 Acessar o Projeto

Após iniciar, acesse no navegador:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Demo dos componentes**: http://localhost:3000/demo

---

## 🔑 Credenciais de Demonstração

| Tipo | Email | Senha |
|------|-------|-------|
| Lojista | lojista@demo.com | demo123 |
| Cliente | cliente@demo.com | demo123 |

---

## 🛠️ Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar em modo desenvolvimento |
| `npm run build` | Gerar build de produção |
| `npm run start` | Iniciar com build de produção |
| `npm run docker:up` | Subir containers Docker |
| `npm run docker:down` | Parar containers Docker |
| `npm run db:migrate --workspace=apps/api` | Rodar migrations |
| `npm run db:seed --workspace=apps/api` | Popular banco |
| `npm run lint` | Verificar código |

---

## 🔧 Solução de Problemas

### "Porta já está em uso"
```bash
# Encerre processos nas portas 3000, 3001, 5432, 6379
npx kill-port 3000 3001 5432 6379
```

### "Docker não encontrado"
1. Instale [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Abra o Docker Desktop
3. Aguarde até mostrar "Docker Desktop is running"

### "Erro de conexão com banco"
```bash
# Verifique se o banco está rodando
docker-compose ps

# Se não estiver, suba novamente
npm run docker:up
```

### "node_modules corrompido"
```bash
# Limpe e reinstale
rm -rf node_modules apps/*/node_modules
npm install
```

### "Erro de TypeScript"
```bash
# Limpe o cache do TypeScript
rm -rf apps/*/.next
npm run build
```

---

## 📁 Estrutura do Projeto

```
feirinha-express/
├── apps/
│   ├── web/           # Frontend Next.js (porta 3000)
│   └── api/           # Backend Fastify (porta 3001)
├── packages/          # Pacotes compartilhados
├── docker-compose.yml # Configuração do banco
├── setup.bat          # Script de configuração (Windows)
└── README.md
```

---

## 🎨 Páginas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Home - escolha usuário ou lojista |
| `/demo` | **DEMO - Página principal com todos os componentes** |
| `/user` | Área do cliente |
| `/user/empty-states` | Demonstração de estados vazios |
| `/error-pages` | Páginas 404, 500 e manutenção |
| `/share` | Botão de compartilhamento |
| `/merchant` | Painel do lojista |
| `/login` | Login |
| `/onboarding` | Tutorial de onboarding |

---

## 📝 Notas

- O projeto usa ** workspaces npm** - todas as dependências são gerenciadas na raiz
- O frontend **não precisa do banco de dados** para funcionar - usa dados mock
- Para testes completos, é necessário PostgreSQL e Redis

---

## 🚀 Próximos Passos

1. ✅ Projeto configurado
2. 🔲 Conectar frontend com API real
3. 🔲 Implementar autenticação completa
4. 🔲 Adicionar serviços (leva e traz)
5. 🔲 Implementar webhook PIX
6. 🔲 Deploy em produção

---

**Precisa de ajuda?** Verifique os arquivos:
- `TESTING.md` - guia de testes
- `README.md` - documentação completa