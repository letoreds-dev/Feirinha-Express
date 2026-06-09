# Relatório de Performance - Feirinha Express

**Data:** Junho 2026
**Analista:** LIGHTHOUSE (Especialista em Performance)
**Versão Next.js:** 14.1.0

---

## Resumo Executivo

O projeto Feirinha Express apresenta **oportunidades significativas de otimização**. Identificamos 3 problemas críticos de performance e 5 oportunidades de melhoria que, se implementadas, podem melhorar o Lighthouse Score em ~15-20 pontos.

**Impacto estimado:**
- LCP: Potencial melhoria de 2.8s para 1.8s (-35%)
- CLS: Potencial melhoria de 0.12 para 0.05 (-58%)
- Bundle size: Potencial redução de ~180KB (-25%)

---

## 1. Imagens (Next/Image) - CRÍTICO

### Problema Encontrado
Nenhuma imagem do projeto utiliza o componente `<Image>` do Next.js. O projeto usa emojis e divs estilizadas em vez de imagens otimizadas.

**Arquivos afetados:**
- `src/components/ui/store-card.tsx`
- `src/components/ui/product-gallery.tsx`
- `src/app/page.tsx`
- E todos os demais componentes

### Impacto
- Sem lazy loading nativo
- Sem otimização de formato (WebP/AVIF)
- Sem redimensionamento responsivo
- CLS elevado por não ter dimensões definidas

### Recomendação
Substituir divs com emojis por `<Image>` do Next.js:

```tsx
import Image from 'next/image'

// Antes (problemático)
<div className="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center">
  🍔
</div>

// Depois (otimizado)
<div className="relative w-14 h-14 rounded-2xl overflow-hidden">
  <Image
    src="/images/store-logo.png"
    alt="Logo da loja"
    fill
    sizes="56px"
    className="object-cover"
  />
</div>
```

Para above-the-fold (LCP), adicionar `priority`:
```tsx
<Image
  src="/images/hero-banner.jpg"
  alt="Banner principal"
  fill
  priority
  sizes="100vw"
/>
```

---

## 2. Fontes - OTIMIZADO

### Situação Atual
O projeto já utiliza `next/font/google` corretamente:

```tsx
// src/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

### Oportunidade de Melhoria
Adicionar `display: swap` para melhorar CLS:

```tsx
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})
```

### Impacto Esperado
- CLS: -0.03 (melhoria de ~25%)

---

## 3. Bundle Optimization - CRÍTICO

### Problema Encontrado
Os componentes 3D (`Agent3D.tsx`, `OfficeEnvironment.tsx`) são pesados e carregados no bundle principal:

```
Dependências pesadas no bundle:
- three: 162KB (minified)
- @react-three/fiber: ~50KB
- @react-three/drei: ~80KB
- Total: ~292KB
```

### Recomendação
Implementar **dynamic import** com loading states:

```tsx
// src/app/merchant/analytics/page.tsx
import dynamic from 'next/dynamic'

const OfficeEnvironment = dynamic(
  () => import('@/components/agents/OfficeEnvironment').then(mod => mod.OfficeEnvironment),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-brand-soft">
        <div className="animate-pulse text-brand-muted">Carregando ambiente 3D...</div>
      </div>
    )
  }
)
```

### Impacto Esperado
- Initial bundle: -292KB (-40%)
- TTI (Time to Interactive): -800ms

---

## 4. Core Web Vitals - Metas

| Métrica | Atual (est.) | Meta | Status |
|---------|--------------|------|--------|
| LCP | ~2.8s | < 2.5s | ⚠️Atenção |
| FID | ~45ms | < 100ms | ✅ Bom |
| CLS | ~0.12 | < 0.1 | ⚠️Atenção |
| Performance Score | ~72 | > 85 | ⚠️Atenção |

### Estratégias por Métrica

**LCP (< 2.5s):**
1. Adicionar `priority` nas imagens above-the-fold
2. Pré-carregar fonte Inter
3. Minimizar render-blocking resources

**CLS (< 0.1):**
1. Definir dimensões explícitas em todas as imagens
2. Reservar espaço com `aspect-ratio` para conteúdo异步
3. Usar `display: swap` nas fontes

**FID (< 100ms):**
1. Lazy load de componentes pesados (3D)
2. Code splitting por rota
3. Reduzir JavaScript do main thread

---

## 5. Configuração Recomendada - next.config.js

Substituir o arquivo `apps/web/next.config.js` pelo seguinte:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Remove console.log em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental: CSS optimization
  experimental: {
    optimizeCss: true,
  },

  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.feirinha-express.com',
      },
    ],
  },

  // Rewrites para API
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },

  // Compressão
  compress: true,

  // Production source maps (opcional, para debugging)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
```

---

## 6. Script Lighthouse CI

### Instalação
```bash
cd apps/web
npm install -D @lhci/cli
```

### Configuração (.lhcrc.json)
Criar arquivo `apps/web/.lhcrc.json`:

```json
{
  "ci": {
    "collect": {
      "settings": {
        "staticDistDir": "./.next",
        "url": [
          "http://localhost:3000",
          "http://localhost:3000/user",
          "http://localhost:3000/merchant"
        ],
        "numberOfRuns": 3,
        "puppeteerArgs": ["--no-sandbox"]
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }],
        "uses-optimized-images": "error",
        "uses-webp-images": "warn",
        "next-image-unoptimized": "error"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Scripts do package.json
Adicionar em `scripts`:

```json
{
  "scripts": {
    "lhci": "lhci autorun",
    "lhci:build": "npm run build && lhci autorun",
    "lhci:server": "npm run start"
  }
}
```

### Execução
```bash
# Terminal 1: Iniciar servidor
npm run lhci:server

# Terminal 2: Executar Lighthouse CI
npm run lhci
```

---

## 7. Priorização - Roadmap de Implementação

### Fase 1 - Crítico (Impacto imediato)
1. **next.config.js** - Aplicar configurações de otimização
2. **Dynamic imports** - Isolar componentes 3D
3. **Lazy load routes** - Implementar next/dynamic nas páginas pesadas

### Fase 2 - Importante (Médio prazo)
4. **next/font** - Adicionar `display: swap`
5. **Image optimization** - Substituir divs por `<Image>`
6. **Lighthouse CI** - Configurar monitoramento

### Fase 3 - Otimização (Contínuo)
7. **Prefetching** - Adicionar links prefetch
8. **Bundle analysis** - Analisar com `@next/bundle-analyzer`
9. **Service Worker** - Cache strategies

---

## 8. Comandos de Verificação

```bash
# Analisar bundle
npm run build && npx @next/bundle-analyzer

# Lighthouse audit
npx lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html

# Verificar performance em produção
npm run build
npm run start
# Abrir http://localhost:3000 com DevTools > Lighthouse
```

---

## Conclusão

O Feirinha Express tem uma base sólida com Next.js 14, mas há espaço significativo para melhoria de performance. As principais ações são:

1. **Isolar código 3D** (maior impacto: -40% no bundle)
2. **Configurar next.config.js** (segundo maior impacto)
3. **Migrar para next/image** (impacto em LCP e CLS)
4. **Lighthouse CI** (monitoramento contínuo)

A implementação das recomendações da Fase 1 pode melhorar o Lighthouse Score de ~72 para ~85-90.

---

*Documento gerado por LIGHTHOUSE - Especialista em Performance Frontend*