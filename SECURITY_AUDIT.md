# Security Audit - Feirinha Express

**Data:** 24 de Junho de 2026

---

## Resumo Executivo

 foram encontradas **9 vulnerabilidades** no projeto:
 - **1 Crítica**
 - **6 Altas**
 - **2 Moderadas**

---

## Vulnerabilidades Críticas

### fast-jwt (<=6.2.3)
| CVE | Descrição |
|-----|-----------|
| GHSA-gm45-q3v2-6cf8 | Fast-JWT Improperly Validates iss Claims |
| GHSA-hm7r-c7qw-ghp6 | Fast-JWT accepts unknown `crit` header extensions (RFC 7515 violation) |
| GHSA-mvf2-f6gm-w987 | JWT Algorithm Confusion via Whitespace-Prefixed RSA Public Key |
| GHSA-rp9m-7r4c-75qg | Cache Confusion via cacheKeyBuilder Collisions Can Return Claims From a Different Token |
| GHSA-3j8v-cgw4-2g6q | Stateful RegExp causes non-deterministic allowed-claim validation (logical DoS) |
| GHSA-gmvf-9v4p-v8jc | JWT auth bypass due to empty HMAC secret accepted by async key resolver |

**Impacto:** Autenticação JWT comprometida - permite bypass de autenticação e roubo de identidade.

**Pacote afetado:** `@fastify/jwt` (depende de fast-jwt)

**Recomendação:** Atualizar para `@fastify/jwt@10.1.0` (breaking change)

---

## Vulnerabilidades Altas

### fast-uri (<=3.1.1)
| CVE | Descrição |
|-----|-----------|
| GHSA-q3j6-qgpj-74h6 | Path traversal via percent-encoded dot segments |
| GHSA-v39h-62p7-jpjc | Host confusion via percent-encoded authority delimiters |

**Impacto:** Possível path traversal e ataques de confusão de host.

**Pacote afetado:** `fastify`, `fast-json-stringify`, `@fastify/ajv-compiler`

**Recomendação:** Atualizar para `fastify@5.8.5` (breaking change)

### next (9.3.4-canary.0 - 16.3.0-canary.5)
| CVE | Descrição |
|-----|-----------|
| GHSA-9g9p-9gw9-jx7f | DoS via Image Optimizer remotePatterns configuration |
| GHSA-h25m-26qc-wcjf | HTTP request deserialization leading to DoS |
| GHSA-ggv3-7p47-pfv8 | HTTP request smuggling in rewrites |
| GHSA-3x4c-7xq6-9pq8 | Unbounded next/image disk cache growth |
| GHSA-q4gf-8mx6-v5v3 | Denial of Service with Server Components |
| GHSA-8h8q-6873-q5fj | Vulnerable to Denial of Service with Server Components |
| GHSA-3g8h-86w9-wvmq | Middleware/Proxy redirects can be cache-poisoned |
| GHSA-ffhc-5mcf-pf4q | Cross-site scripting in App Router with CSP nonces |
| GHSA-vfv6-92ff-j949 | Cache poisoning via collisions in RSC cache-busting |
| GHSA-gx5p-jg67-6x7h | XSS in beforeInteractive scripts with untrusted input |
| GHSA-h64f-5h5j-jqjh | Denial of Service in Image Optimization API |
| GHSA-c4j6-fc7j-m34r | Server-side request forgery with WebSocket upgrades |
| GHSA-wfc6-r584-vfw7 | Cache poisoning in React Server Component responses |
| GHSA-36qx-fr4f-26g5 | Middleware/Proxy bypass in Pages Router with i18n |

**Impacto:** Múltiplas vulnerabilidades de DoS, XSS, cache poisoning e SSRF.

**Recomendação:** Atualizar para `next@16.2.7` (breaking change)

---

## Vulnerabilidades Moderadas

### postcss (<8.5.10)
| CVE | Descrição |
|-----|-----------|
| GHSA-qx2v-qp2m-jg93 | XSS via Unescaped </style> in CSS Stringify Output |

**Impacto:** Possível cross-site scripting via CSS.

**Recomendação:** Atualizar para `postcss@8.5.10+` (resolvido via update do next)

---

## Pacotes Desatualizados

### Root Workspace
| Pacote | Atual | Latest |
|--------|-------|--------|
| @typescript-eslint/eslint-plugin | ^7.0.0 | ^8.61.0 |
| @typescript-eslint/parser | ^7.0.0 | ^8.61.0 |
| eslint | ^8.57.0 | ^10.4.1 |
| prettier | ^3.2.0 | ^3.8.4 |
| typescript | ^5.4.0 | ^6.0.3 |

### apps/web
| Pacote | Atual | Latest |
|--------|-------|--------|
| @react-three/drei | ^9.99.0 | ^10.7.7 |
| @react-three/fiber | ^8.15.0 | ^9.6.1 |
| @tanstack/react-query | ^5.28.0 | ^5.101.0 |
| @types/node | ^20.11.0 | ^25.9.2 |
| @types/react | ^18.2.0 | ^19.2.17 |
| @types/react-dom | ^18.2.0 | ^19.2.3 |
| @types/three | ^0.162.0 | ^0.184.1 |
| autoprefixer | ^10.4.0 | ^10.5.0 |
| axios | ^1.6.0 | ^1.17.0 |
| clsx | ^2.1.0 | ^2.1.1 |
| next | ^14.1.0 | ^16.2.7 |
| postcss | ^8.4.0 | ^8.5.15 |
| react | ^18.2.0 | ^19.2.7 |
| react-dom | ^18.2.0 | ^19.2.7 |
| tailwind-merge | ^2.2.0 | ^3.6.0 |
| tailwindcss | ^3.4.0 | ^4.3.0 |
| three | ^0.162.0 | ^0.184.0 |
| typescript | ^5.4.0 | ^6.0.3 |
| zod | ^3.22.0 | ^4.4.3 |
| zustand | ^4.5.0 | ^5.0.14 |

### apps/api
| Pacote | Atual | Latest |
|--------|-------|--------|
| @fastify/cors | ^9.0.0 | ^11.2.0 |
| @fastify/jwt | ^8.0.0 | ^10.1.0 |
| @fastify/rate-limit | ^9.0.0 | ^11.0.0 |
| @prisma/client | ^5.10.0 | ^7.8.0 |
| @types/bcryptjs | ^2.4.6 | ^3.0.0 |
| @types/node | ^20.11.0 | ^25.9.2 |
| bcryptjs | ^2.4.3 | ^3.0.3 |
| dotenv | ^16.4.0 | ^17.4.2 |
| fastify | ^4.26.0 | ^5.8.5 |
| prisma | ^5.10.0 | ^7.8.0 |
| tsx | ^4.7.0 | ^4.22.4 |
| typescript | ^5.4.0 | ^6.0.3 |
| zod | ^3.22.0 | ^4.4.3 |

---

## Recomendações

### Prioridade CRÍTICA (Ação Imediata)
1. **Atualizar @fastify/jwt** para resolver vulnerabilidades críticas de autenticação JWT
   - Requer breaking change para `@fastify/jwt@10.1.0`
   - Testar thoroughly toda a autenticação após update

### Prioridade ALTA (Ação Breve)
2. **Atualizar fastify** para resolver path traversal em fast-uri
   - Requer breaking change para `fastify@5.8.5`
   - Verificar plugins de validação após update

3. **Atualizar next** para resolver 14 vulnerabilidades (DoS, XSS, SSRF)
   - Requer breaking change para `next@16.2.7`
   - Testar rotas, middleware e Image Optimization após update

### Prioridade MÉDIA (Planejado)
4. Atualizar postcss para >=8.5.10 (resolvido automaticamente com next update)

### Prioridade BAIXA (Manutenção Regular)
5. Atualizar todos os pacotes desatualizados em cronograma regular
   - Sugiro atualizar em lotes, testando após cada batch
   - Atenção especial para: react@19, tailwindcss@4, zod@4 (breaking changes)

---

## Notas Importantes

- Várias atualizações requerem **breaking changes** -Planeje tempo para migração e testes
- Atualizações de segurança crítica (fast-jwt, fast-uri, next) são **obrigatórias**
- Recomendo criar branch de release专门的 para estas atualizações
- Execute testes automatizados e manuais após cada atualização
- Considere usar `npm audit fix --force` para resolver vulnerabilidades automaticamente (com testes)

---

*Relatório gerado por SECURIX - Auditor de Dependências*
