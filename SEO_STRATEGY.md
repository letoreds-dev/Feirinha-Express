# Estrategia SEO - Feirinha Express

## Visao Geral

E-commerce de delivery multi-varejista com marketplace centralizado. O SEO deve priorizar buscas locais (delivery na cidade), comparativos de produtos e conversion intent.

---

## 1. Palavras-chave Alvo

### 1.1 Busca Principal (Head Terms)

| Categoria | Keywords Primarias | Volume Estimado | Intencao |
|-----------|-------------------|-----------------|----------|
| Home | delivery, delivery perto de mim, pedir comida online | Alto | Transacional |
| Busca | delivery [cidade], delivery [bairro], delivery barato | Alto | Transacional |
| Categorias | delivery de mercado, delivery de farmacia, delivery de lanches | Medio-Alto | Transacional |
| Lojas | [nome da loja] delivery, [nome da loja] online | Medio | Transacional |
| Produtos | comprar [produto], [produto] preco, [produto] entrega | Medio | Transacional |
| Comparativos | melhor delivery, comparar delivery, delivery mais barato | Medio | Comercial |

### 1.2 Keywords por Pagina

| Pagina | Keywords Primarias | Keywords Secundarias |
|--------|-------------------|---------------------|
| Home (`/`) | feirinha express, delivery centro comercial, marketplace delivery | app de delivery, delivery multi-loja |
| Busca (`/user/search`) | delivery perto de mim, buscar produtos, encontrar loja | delivery [cidade], pedido online |
| Catálogo (`/user/catalog`) | cardapio delivery, catalogo de produtos, comprar online | delivery mercado, delivery farmacia |
| Loja (`/user/store/[slug]`) | [nome] delivery, [nome] online, loja [nome] | comprar em [nome], [nome] catalogo |
| Produto (`/user/product/[id]`) | [produto] preco, comprar [produto], [produto] entrega | [produto] online, [produto] [cidade] |
| Checkout (`/user/checkout`) | - (sem SEO) | - |
| Carrinho (`/user/cart`) | - (sem SEO) | - |
| Usuario (`/user/*`) | - (sem SEO - paginas privadas) | - |
| Lojista (`/merchant/*`) | cadastrar loja, vender online, loja virtual | plataforma marketplace, criar loja online |

### 1.3 Long-tail Keywords (Brasil)

- "delivery mercado aberto agora"
- "farmacia 24 horas delivery"
- "delivery de lanches barato"
- "pedido minimo delivery mercado"
- "entrega rapida delivery [cidade]"
- "cupom desconto delivery primeira compra"
- "delivery sem pedido minimo"

---

## 2. Meta Tags por Pagina

### 2.1 Home (app/page.tsx)

```typescript
// apps/web/src/app/page.tsx
export const metadata: Metadata = {
  title: 'Feirinha Express | Delivery do Centro Comercial - Tudo em Um Pedido',
  description: 'Compre de varias lojas do centro comercial em um unico pedido. Delivery rapido de mercado, farmacia, lanches e mais. Taxa de entrega baixa e Pix!',
  keywords: 'delivery, delivery centro comercial, marketplace, delivery multi-loja, pedir comida online, delivery barato, app de delivery',
  openGraph: {
    title: 'Feirinha Express | Delivery do Centro Comercial',
    description: 'Tudo de varias lojas em um unico pedido. Mercado, farmacia, lanches e mais.',
    url: 'https://feirinhaexpress.com.br',
    siteName: 'Feirinha Express',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Feirinha Express - Delivery do Centro Comercial',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feirinha Express | Delivery do Centro Comercial',
    description: 'Tudo de varias lojas em um unico pedido.',
    images: ['/og-home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### 2.2 Busca (app/user/search/page.tsx)

```typescript
export const metadata: Metadata = {
  title: 'Buscar Produtos | Feirinha Express',
  description: 'Encontre produtos de varias lojas do centro comercial. Busca por mercado, farmacia, lanches e muito mais.',
  keywords: 'buscar produtos, encontrar loja, delivery perto, pesquisa delivery',
  robots: { index: false, follow: false }, // Pagina dinamica - nao indexar
}
```

### 2.3 Catalogo (app/user/catalog/page.tsx)

```typescript
export const metadata: Metadata = {
  title: 'Cardapio | [Nome da Loja] - Feirinha Express',
  description: 'Veja o cardapio completo de [Nome da Loja]. Produtos frescos, precos justos e entrega rapida.',
  keywords: 'cardapio [loja], produtos [categoria], catalogo delivery',
  openGraph: {
    title: '[Nome da Loja] | Cardapio - Feirinha Express',
    description: 'Confira todos os produtos de [Nome da Loja].',
    images: ['/og-store-[id].jpg'],
  },
}
```

### 2.4 Produto (app/user/product/[id]/page.tsx)

```typescript
export const metadata: Metadata = {
  title: '[Nome do Produto] - [Preco] | Feirinha Express',
  description: 'Compre [Nome do Produto] de [Nome da Loja] com entrega rapida. [Descricao curta do produto].',
  keywords: '[produto] preco, comprar [produto], [produto] entrega, [categoria] delivery',
  openGraph: {
    title: '[Nome do Produto] - [Preco] | Feirinha Express',
    description: '[Descricao do produto]. Entrega rapida!',
    images: [
      {
        url: '/products/[id]/og.jpg',
        width: 1200,
        height: 630,
        alt: '[Nome do Produto]',
      },
    ],
    type: 'product',
  },
  other: {
    'product:price:amount': '[preco]',
    'product:price:currency': 'BRL',
  },
}
```

### 2.5 Loja (app/user/store/[slug]/page.tsx)

```typescript
export const metadata: Metadata = {
  title: '[Nome da Loja] | Delivery - Feirinha Express',
  description: '[Nome da Loja] no centro comercial. Delivery rapido, produtos frescos e atendimento de qualidade.',
  keywords: '[loja] delivery, [loja] online, comprar em [loja], [categoria] [bairro]',
  openGraph: {
    title: '[Nome da Loja] | Feirinha Express',
    description: 'Delivery de [Nome da Loja]. Produtos frescos e entrega rapida.',
    images: ['/stores/[slug]/og.jpg'],
    type: 'business.business',
  },
  alternates: {
    canonical: '/user/store/[slug]',
  },
}
```

### 2.6 Cadastro Lojista (app/merchant/register/page.tsx)

```typescript
export const metadata: Metadata = {
  title: 'Cadastrar Minha Loja | Feirinha Express',
  description: 'Cadastre sua loja no Feirinha Express e comece a vender online hoje. Sem mensalidade, alcance mais clientes no centro comercial.',
  keywords: 'cadastrar loja, vender online, marketplace, loja virtual delivery, cadastrar comercio',
  openGraph: {
    title: 'Cadastrar Minha Loja | Feirinha Express',
    description: 'Comece a vender online sem mensalidade. Alcance clientes do centro comercial.',
  },
}
```

---

## 3. Structured Data (JSON-LD)

### 3.1 Organization Schema (layout principal)

Criar `apps/web/src/components/seo/organization-schema.tsx`:

```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Feirinha Express",
  "url": "https://feirinhaexpress.com.br",
  "logo": "https://feirinhaexpress.com.br/logo.png",
  "description": "Marketplace de delivery do centro comercial. Compre de varias lojas em um unico pedido.",
  "slogan": "Tudo de varias lojas em um unico pedido",
  "foundingDate": "2024",
  "areaServed": {
    "@type": "City",
    "name": "[Cidade do Centro Comercial]"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-XX-XXXX-XXXX",
    "contactType": "customer service",
    "availableLanguage": ["Portuguese"],
    "contactOption": "HearingImpairedSupported"
  },
  "sameAs": [
    "https://instagram.com/feirinhaexpress",
    "https://facebook.com/feirinhaexpress",
    "https://twitter.com/feirinhaexpress"
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://feirinhaexpress.com.br/user/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3.2 LocalBusiness Schema (para cada loja)

```typescript
// apps/web/src/lib/structured-data/store-schema.ts
export function getStoreSchema(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "name": store.name,
    "url": `https://feirinhaexpress.com.br/user/store/${store.slug}`,
    "image": store.imageUrl,
    "description": store.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": store.address,
      "addressLocality": store.neighborhood,
      "addressRegion": "SP",
      "postalCode": store.cep,
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": store.latitude,
      "longitude": store.longitude
    },
    "telephone": store.phone,
    "openingHoursSpecification": store.openingHours?.map(h => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": h.days,
      "opens": h.open,
      "closes": h.close
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": store.rating,
      "reviewCount": store.reviewCount
    },
    "priceRange": store.priceRange || "$$",
    "hasMenu": `https://feirinhaexpress.com.br/user/store/${store.slug}/catalog`
  }
}
```

### 3.3 Product Schema

```typescript
// apps/web/src/lib/structured-data/product-schema.ts
export function getProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.storeName
    },
    "manufacturer": {
      "@type": "Organization",
      "name": product.storeName
    },
    "offers": {
      "@type": "Offer",
      "url": `https://feirinhaexpress.com.br/user/product/${product.id}`,
      "priceCurrency": "BRL",
      "price": product.price.toFixed(2),
      "priceValidUntil": product.priceValidUntil,
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.storeName
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    } : undefined
  }
}
```

### 3.4 BreadcrumbList Schema

```typescript
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

// Exemplo de uso na pagina de produto:
// / > Lojas > [Nome da Loja] > [Nome do Produto]
```

### 3.5 WebSite Schema (para busca)

```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Feirinha Express",
  "url": "https://feirinhaexpress.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://feirinhaexpress.com.br/user/search?q={search_term_string}"
    },
    "query-input": {
      "@type": "PropertyValueSpecification",
      "valueRequired": true,
      "valueName": "search_term_string"
    }
  }
}
```

---

## 4. Sitemap XML

Criar `apps/web/src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'

// Paginas estaticas principais
const staticPages: MetadataRoute.Sitemap = [
  {
    url: 'https://feirinhaexpress.com.br',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: 'https://feirinhaexpress.com.br/user/stores',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: 'https://feirinhaexpress.com.br/user/categories',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: 'https://feirinhaexpress.com.br/merchant/register',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: 'https://feirinhaexpress.com.br/login',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
]

// Paginas dinamicas de lojas (geradas via getServerSideProps ou API)
// Em producao, buscar do banco de dados
async function getDynamicPages(): Promise<MetadataRoute.Sitemap> {
  // TODO: Buscar lojas do banco/API
  // const stores = await fetchStores()

  return [
    // Exemplo para cada loja:
    // ...stores.map(store => ({
    //   url: `https://feirinhaexpress.com.br/user/store/${store.slug}`,
    //   lastModified: store.updatedAt,
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.8,
    // }))
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicPages = await getDynamicPages()
  return [...staticPages, ...dynamicPages]
}
```

---

## 5. robots.txt

Criar `apps/web/src/app/robots.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/user/cart',
          '/user/checkout',
          '/user/profile',
          '/user/settings',
          '/user/wallet',
          '/user/notifications',
          '/merchant/dashboard',
          '/merchant/orders',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/user/cart',
          '/user/checkout',
          '/user/profile/',
        ],
      },
    ],
    sitemap: 'https://feirinhaexpress.com.br/sitemap.xml',
    host: 'https://feirinhaexpress.com.br',
  }
}
```

---

## 6. Canonical URLs

Implementar em todas as paginas publicas:

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://feirinhaexpress.com.br/user/store/[slug]',
    languages: {
      'pt-BR': 'https://feirinhaexpress.com.br/user/store/[slug]',
    },
  },
}
```

---

## 7. Performance SEO

### 7.1 Core Web Vitals Targets

| Metrica | Target | Como melhorar |
|---------|--------|---------------|
| LCP (Largest Contentful Paint) | < 2.5s | Otimizar imagens, usar CDN, lazy loading |
| FID (First Input Delay) | < 100ms | Code splitting, evitar JS pesado no main thread |
| CLS (Cumulative Layout Shift) | < 0.1 | Reservar espaco para imagens, fontes |
| TTFB (Time to First Byte) | < 600ms | Edge caching, server-side rendering |

### 7.2 Otimizacoes Recomendadas

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 7.3 Lazy Loading de Imagens

```typescript
import Image from 'next/image'

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={product.blurDataUrl}
/>
```

---

## 8. URL Strategy

| Tipo | Formato | Exemplo |
|------|---------|---------|
| Pagina inicial | `/` | `/` |
| Lista de lojas | `/user/stores` | `/user/stores` |
| Detalhe da loja | `/user/store/[slug]` | `/user/store/estabelecimento-abc` |
| Catalogo | `/user/store/[slug]/catalog` | `/user/store/estabelecimento-abc/catalog` |
| Produto | `/user/product/[id]` | `/user/product/12345` |
| Categorias | `/user/categories/[slug]` | `/user/categories/mercado` |
| Busca | `/user/search?q=...` | `/user/search?q=arroz` |
| Cadastro lojista | `/merchant/register` | `/merchant/register` |

**Regras:**
- Usar slug (URL amigavel) para nomes de lojas
- IDs de produtos podem ser numericos (melhor para SEO que hashes)
- Evitar parametros de filtro na URL para SEO
- Usar hifen para separar palavras

---

## 9. Checklist SEO

### 9.1 On-Page Technical

- [ ] Meta title em todas as paginas (< 60 caracteres)
- [ ] Meta description em todas as paginas (< 160 caracteres)
- [ ] Heading H1 unico por pagina
- [ ] Heading H2/H3 hierarquicos
- [ ] Alt text em todas as imagens
- [ ] URL amigaveis (slug)
- [ ] Canonical URLs
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Schema markup (Organization, Product, LocalBusiness)
- [ ] Breadcrumbs estruturados

### 9.2 Performance

- [ ] Imagens otimizadas (WebP/AVIF)
- [ ] Lazy loading implementado
- [ ] Core Web Vitals < thresholds
- [ ] Minificacao de assets
- [ ] Gzip/Brotli compression
- [ ] CDN configurado

### 9.3 Indexacao

- [ ] robots.txt configurado
- [ ] sitemap.xml gerado
- [ ] Paginas privadas bloqueadas
- [ ] Paginas canonicas corretas
- [ ] Redirecionamentos 301/302

### 9.4 Mobile

- [ ] Design responsive
- [ ] Touch targets adequados
- [ ] Viewport configurado
- [ ] Sem interstitials intrusivos

### 9.5 Monitoramento

- [ ] Google Search Console conectado
- [ ] Google Analytics implementado
- [ ] Monitoramento de erros de crawl
- [ ] Sitemap submetido ao Google

---

## 10. Plano de Implementacao

### Fase 1: Fundamentos (Semana 1)
1. Atualizar `app/layout.tsx` com metadata global
2. Criar components de JSON-LD (Organization, WebSite)
3. Configurar `app/robots.ts`
4. Configurar `app/sitemap.ts`
5. Adicionar Open Graph em todas as paginas

### Fase 2: Paginas Publicas (Semana 2)
1. Home page metadata completa
2. Pagina de loja com LocalBusiness schema
3. Pagina de produto com Product schema
4. Pagina de categorias
5. Breadcrumbs com schema

### Fase 3: Otimizacao (Semana 3)
1. Otimizar imagens (Next/Image)
2. Lazy loading de componentes
3. Meta tags dinamicas via generateMetadata
4. Performance audit

### Fase 4: Monitoramento (Semana 4)
1. Conectar Google Search Console
2. Verificar indexing
3. Corrigir errors
4. A/B test de titles/descriptions

---

## 11. Ferramentas Recomendadas

| Categoria | Ferramenta |
|-----------|------------|
| Analise de keywords | Google Keyword Planner, Ubersuggest |
| Audit SEO | Screaming Frog, Semrush |
| Monitoramento | Google Search Console, GA4 |
| Structured Data | Google Rich Results Test, Schema.org |
| Performance | PageSpeed Insights, GTmetrix |
| Crawl | Googlebot simulation |

---

## 12. Notas Importantes

1. **Paginas privadas**: Nao indexar `/user/cart`, `/user/checkout`, `/user/profile`, `/merchant/*`
2. **Paginas dinamicas**: Evitar indexar resultados de busca com query params
3. **Local SEO**: Priorizar buscas com intent local ("delivery [bairro]")
4. **Mobile-first**: Todo SEO deve ser otimizado para mobile primeiro
5. **Produto schema**: Crucial para aparecer em rich snippets do Google Shopping
6. **Store schema**: Importante para aparecer em buscas locais

---

*Documento criado por KEYWORD - Estrategista SEO*
*Feirinha Express - Marketplace de Delivery*
*Versao: 1.0 | Data: 2024*