# Configuração de Analytics - Feirinha Express

## 1. Google Analytics 4

### Configuração Global (layout.tsx)

Adicionar no `<head>`:
```html
<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
<script>{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
`}</script>
```

### Arquivo de Analytics (`src/lib/analytics.ts`)

```typescript
// Analytics para Next.js
'use client'

import { GA_MEASUREMENT_ID } from '@/lib/config'

export function pageview(url: string) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

export function event(action: string, params: Record<string, any>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params)
  }
}

// Eventos customizados
export const events = {
  addToCart: (product: { id: string; name: string; price: number }) => {
    event('add_to_cart', {
      currency: 'BRL',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      }]
    })
  },
  
  beginCheckout: (cartValue: number) => {
    event('begin_checkout', {
      currency: 'BRL',
      value: cartValue,
    })
  },
  
  purchase: (order: { id: string; total: number; items: number }) => {
    event('purchase', {
      transaction_id: order.id,
      currency: 'BRL',
      value: order.total,
      items: order.items,
    })
  },
  
  search: (query: string, results: number) => {
    event('search', {
      search_term: query,
      results_count: results,
    })
  },
  
  viewItem: (product: { id: string; name: string; price: number }) => {
    event('view_item', {
      currency: 'BRL',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      }]
    })
  },
}
```

### Uso nos Componentes

```typescript
// Em componentes de produto
import { events } from '@/lib/analytics'

// Ao ver um produto
events.viewItem({ id: '123', name: 'Morango', price: 5.90 })

// Ao adicionar ao carrinho
events.addToCart({ id: '123', name: 'Morango', price: 5.90 })

// Ao iniciar checkout
events.beginCheckout(45.90)

// Ao finalizar pedido
events.purchase({ id: 'ORD-123', total: 45.90, items: 3 })

// Ao buscar
events.search('morango', 12)
```

---

## 2. Dashboard de Métricas

### Componente (`src/components/ui/analytics-dashboard.tsx`)

```typescript
'use client'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

function MetricCard({ title, value, change, trend }: MetricCardProps) {
  const isPositive = trend === 'up'
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  )
}

export function AnalyticsDashboard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Receita D-1"
        value="R$ 2.450,00"
        change="+12%"
        trend="up"
      />
      <MetricCard
        title="Pedidos D-1"
        value="147"
        change="+8%"
        trend="up"
      />
      <MetricCard
        title="Ticket Médio"
        value="R$ 16,67"
        change="-2%"
        trend="down"
      />
      <MetricCard
        title="Taxa Conversão"
        value="3.2%"
        change="+0.5%"
        trend="up"
      />
    </div>
  )
}
```

---

## 3. KPIs para Dashboard Lojista

| Métrica | Fórmula | Meta | Prioridade |
|---------|---------|------|------------|
| Receita diária | SUM(orders.total) | Crescimento 10% | Alta |
| Pedidos por dia | COUNT(orders) | > 50 | Alta |
| Ticket médio | AVG(orders.total) | > R$ 30 | Média |
| Tempo separação | AVG(order.updatedAt - order.createdAt) | < 15 min | Alta |
| Avaliação média | AVG(reviews.rating) | > 4.5 | Média |
| Taxa cancelamento | COUNT(cancelled) / COUNT(total) | < 5% | Alta |
| Taxa devolução | COUNT(returns) / COUNT(total) | < 2% | Média |
| CAC | SUM(marketing_costs) / COUNT(new_customers) | Redução | Alta |
| LTV | AVG(customer.total_spent) | > 3x CAC | Alta |
| Produtividade | AVG(orders.processed_per_seller) | > 20/hora | Média |

---

## 4. Funis de Conversão

### Funil Principal (E-commerce)
```
Home → Busca → Produto → Carrinho → Checkout → Pedido
 100%    60%      40%       25%       15%       10%
```

### Funil do Vendedor
```
Cadastro → KYC → Primeiro Pedido → 5 Pedidos → Ativo
  100%      70%      50%           30%        20%
```

### Funil de Pagamento
```
Checkout → Forma Pagto → Confirmação → Pago
  100%       80%          70%          65%
```

---

## 5. Eventos GA4 a Implementar

| Evento | Quando | Parâmetros | Categoria |
|--------|--------|------------|-----------|
| page_view | Cada página | page_location, page_title | Navegação |
| view_item | Ver produto | item_id, item_name, price, category | E-commerce |
| add_to_cart | Adicionar carrinho | value, currency, items | E-commerce |
| remove_from_cart | Remover carrinho | item_id, value | E-commerce |
| begin_checkout | Iniciar checkout | value, currency | E-commerce |
| add_payment_info | Info pagamento | payment_type | E-commerce |
| purchase | Pedido concluído | transaction_id, value, items | E-commerce |
| search | Busca realizada | search_term, results_count | Discovery |
| select_item | Selecionar item da lista | item_id, item_list_name | Discovery |
| view_item_list | Ver lista/categoria | item_list_name, items | Discovery |
| sign_up | Cadastro | method | Engagement |
| login | Login | method | Engagement |
| share | Compartilhar | method, content_type, item_id | Engagement |

---

## 6. Configuração Enhanced Ecommerce

```typescript
// Product Impression
gtag('event', 'view_item_list', {
  item_list_name: 'Produtos em Destaque',
  items: [
    { item_id: '123', item_name: 'Morango', price: 5.90, item_category: 'Frutas' },
    // ...
  ]
})

// Add to Cart
gtag('event', 'add_to_cart', {
  currency: 'BRL',
  value: 5.90,
  items: [{ item_id: '123', item_name: 'Morango', price: 5.90 }]
})

// Purchase
gtag('event', 'purchase', {
  transaction_id: 'ORD-123',
  affiliation: 'Feirinha Express',
  currency: 'BRL',
  value: 45.90,
  tax: 0,
  shipping: 5.00,
  items: [
    { item_id: '123', item_name: 'Morango', price: 5.90, quantity: 2 },
    { item_id: '456', item_name: 'Cebola', price: 3.50, quantity: 1 }
  ]
})
```

---

## 7. Google Tag Manager (GTM)

### Configuração GTM
- Container ID: GTM-XXXXXXX
- Trigger em todas as páginas
- Variáveis: GA_MEASUREMENT_ID, user_id, order_total

### Data Layer Events
```javascript
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORD-123',
    value: 45.90,
    currency: 'BRL',
    items: [...]
  }
})
```

---

## 8. Dashboard Admin - Métricas Operacionais

### Métricas em Tempo Real
- Pedidos por status (novo, preparando, pronto, entregue)
- Tempo médio de resposta
- Produtos mais vendidos (última hora)

### Métricas Diárias
- Receita bruta e líquida
- Pedidos por período
- Cancellation rate
- Average order value

### Métricas de Sazonalidade
- Heatmap de vendas por hora
- Ranking de dias da semana
- Tendência mensal

---

## 9. Ferramentas Recomendadas

| Ferramenta | Uso | Custo |
|------------|-----|-------|
| Google Analytics 4 | Analytics principal | Grátis |
| Google Tag Manager | Gerenciar tags | Grátis |
| Google Data Studio | Dashboards customizados | Grátis |
| Hotjar | Gravação de sessões | Freemium |
| Mixpanel | Análise de funil avançada | Freemium |
| Amplitude | Product analytics | Freemium |

---

## 10. Configuração de Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## 11. Checklist de Implementação

- [ ] Configurar GA4 property no Google Analytics
- [ ] Adicionar script de tracking no layout.tsx
- [ ] Criar arquivo src/lib/analytics.ts
- [ ] Implementar page_view em app router
- [ ] Adicionar eventos em ProductCard
- [ ] Adicionar eventos em Cart
- [ ] Adicionar eventos em Checkout
- [ ] Adicionar eventos em Purchase confirmation
- [ ] Criar dashboard de métricas admin
- [ ] Configurar GTM se necessário
- [ ] Testar eventos no GA Debug
- [ ] Validar dados no GA4 realtime
