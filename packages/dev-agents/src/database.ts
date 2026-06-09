// ============================================
// FEIRINHA EXPRESS - SISTEMA DE AGENTES AUTÔNOMOS
// 58 Agentes trabalhando 24/7
// ============================================

export type AgentId = string
export type AgentRole =
  | 'frontend' | 'backend' | 'fullstack' | 'devops'
  | 'database' | 'security' | 'ux' | 'product'
  | 'qa' | 'data' | 'ai' | 'infrastructure'
  | 'mobile' | 'performance' | 'testing' | 'integration'

export interface AgentSkill {
  name: string
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  tools: string[]
}

export interface Agent {
  id: AgentId
  name: string
  icon: string
  role: AgentRole
  description: string
  specialty: string[]
  skills: AgentSkill[]
  tasks: string[]
  autonomy: 'low' | 'medium' | 'high' | 'full'
  priority: number
  active: boolean
  lastAction?: Date
  completedTasks: number
}

export interface Task {
  id: string
  agentId: AgentId
  type: 'feature' | 'fix' | 'improvement' | 'refactor' | 'optimize' | 'security'
  title: string
  description: string
  files: string[]
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'analyzing' | 'in-progress' | 'review' | 'completed'
  effort: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  createdAt: Date
  completedAt?: Date
  changes?: string[]
  blockers?: string[]
  dependsOn?: string[]
}

// ============================================
// BANCO DE DADOS DOS 58 AGENTES
// ============================================

export const agentsDatabase: Agent[] = [
  // ========== FRONTEND (10 agentes) ==========
  { id: 'frontend-1', name: 'Marina', icon: '👩‍💻', role: 'frontend', description: 'Especialista em React e componentização', specialty: ['React', 'TypeScript', 'Components', 'Hooks'], skills: [{name: 'React', level: 'expert', tools: ['Next.js', 'React Query']}, {name: 'CSS', level: 'expert', tools: ['Tailwind', 'Styled-Components']}], tasks: ['components', 'ui', 'responsive'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'frontend-2', name: 'Lucas', icon: '🎨', role: 'frontend', description: 'Design systems e UI/UX', specialty: ['Design System', 'UI/UX', 'Figma', 'Storybook'], skills: [{name: 'Design', level: 'expert', tools: ['Figma', 'Storybook']}, {name: 'CSS', level: 'expert', tools: ['Tailwind', 'SASS']}], tasks: ['design-system', 'components', 'documentation'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'frontend-3', name: 'Ana', icon: '✨', role: 'frontend', description: 'Animações e micro-interações', specialty: ['Animations', 'Motion', 'Framer Motion', 'Transitions'], skills: [{name: 'Animation', level: 'expert', tools: ['Framer Motion', 'GSAP']}, {name: 'CSS', level: 'advanced', tools: ['CSS Animations', 'Lottie']}], tasks: ['animations', 'transitions', 'loading-states'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'frontend-4', name: 'Bruno', icon: '🔍', role: 'frontend', description: 'Performance e otimização', specialty: ['Performance', 'Core Web Vitals', 'Bundle Size', 'Lazy Loading'], skills: [{name: 'Performance', level: 'expert', tools: ['Lighthouse', 'Web Vitals']}, {name: 'Optimization', level: 'expert', tools: ['Code Splitting', 'Caching']}], tasks: ['performance', 'optimization', 'caching'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'frontend-5', name: 'Carla', icon: '♿', role: 'frontend', description: 'Acessibilidade e SEO', specialty: ['Accessibility', 'A11y', 'SEO', 'ARIA'], skills: [{name: 'A11y', level: 'expert', tools: ['axe-core', 'Lighthouse']}, {name: 'SEO', level: 'expert', tools: ['Next SEO', 'Schema']}], tasks: ['accessibility', 'seo', 'semantic-html'], autonomy: 'high', priority: 2, active: true, completedTasks: 0 },
  { id: 'frontend-6', name: 'Diego', icon: '📱', role: 'frontend', description: 'Responsividade mobile-first', specialty: ['Mobile', 'Responsive', 'Touch', 'PWA'], skills: [{name: 'Mobile', level: 'expert', tools: ['Tailwind', 'Media Queries']}, {name: 'PWA', level: 'advanced', tools: ['Service Worker', 'Manifest']}], tasks: ['mobile', 'responsive', 'pwa'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'frontend-7', name: 'Elena', icon: '🧩', role: 'frontend', description: 'Arquitetura de componentes', specialty: ['Architecture', 'Patterns', 'Clean Code', 'Refactoring'], skills: [{name: 'Architecture', level: 'expert', tools: ['Clean Architecture', 'Design Patterns']}, {name: 'Refactoring', level: 'expert', tools: ['ESLint', 'Prettier']}], tasks: ['architecture', 'patterns', 'refactoring'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'frontend-8', name: 'Felipe', icon: '📊', role: 'frontend', description: 'Data visualization e gráficos', specialty: ['Charts', 'D3', 'Data Viz', 'Dashboards'], skills: [{name: 'Charts', level: 'expert', tools: ['Recharts', 'D3.js']}, {name: 'Data', level: 'advanced', tools: ['Data Processing']}], tasks: ['charts', 'dashboards', 'data-viz'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },
  { id: 'frontend-9', name: 'Gabriela', icon: '🧪', role: 'frontend', description: 'Testes e qualidade frontend', specialty: ['Testing', 'Jest', 'Cypress', 'Playwright'], skills: [{name: 'Testing', level: 'expert', tools: ['Jest', 'React Testing Library']}, {name: 'E2E', level: 'expert', tools: ['Cypress', 'Playwright']}], tasks: ['tests', 'coverage', 'e2e'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'frontend-10', name: 'Henrique', icon: '🚀', role: 'frontend', description: 'DX e tooling', specialty: ['DX', 'Build Tools', 'Monorepo', 'CI/CD'], skills: [{name: 'Build', level: 'expert', tools: ['Vite', 'Turborepo']}, {name: 'CI', level: 'expert', tools: ['GitHub Actions', 'Testing']}], tasks: ['dx', 'tooling', 'build'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },

  // ========== BACKEND (10 agentes) ==========
  { id: 'backend-1', name: 'Carlos', icon: '⚙️', role: 'backend', description: 'APIs RESTful e GraphQL', specialty: ['REST', 'GraphQL', 'Fastify', 'Node.js'], skills: [{name: 'API', level: 'expert', tools: ['Fastify', 'REST']}, {name: 'GraphQL', level: 'advanced', tools: ['Apollo', 'Yoga']}], tasks: ['api', 'endpoints', 'rest'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'backend-2', name: 'Daniela', icon: '🔒', role: 'backend', description: 'Segurança e autenticação', specialty: ['Security', 'Auth', 'JWT', 'OAuth'], skills: [{name: 'Security', level: 'expert', tools: ['JWT', 'OAuth', 'bcrypt']}, {name: 'Auth', level: 'expert', tools: ['Sessions', 'Tokens']}], tasks: ['security', 'auth', 'validation'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'backend-3', name: 'Eduardo', icon: '🗄️', role: 'database', description: 'PostgreSQL e otimização de queries', specialty: ['PostgreSQL', 'SQL', 'Indexes', 'Optimization'], skills: [{name: 'SQL', level: 'expert', tools: ['PostgreSQL', 'Prisma']}, {name: 'Optimization', level: 'expert', tools: ['Indexes', 'Query Analysis']}], tasks: ['database', 'queries', 'migrations'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'backend-4', name: 'Fernanda', icon: '📬', role: 'backend', description: 'Background jobs e workers', specialty: ['Queue', 'Workers', 'BullMQ', 'Cron'], skills: [{name: 'Queue', level: 'expert', tools: ['BullMQ', 'Redis']}, {name: 'Jobs', level: 'expert', tools: ['Workers', 'Cron']}], tasks: ['jobs', 'queue', 'background'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'backend-5', name: 'Gustavo', icon: '📁', role: 'backend', description: 'File upload e storage', specialty: ['Upload', 'S3', 'Storage', 'CDN'], skills: [{name: 'Upload', level: 'expert', tools: ['Multer', 'AWS S3']}, {name: 'Storage', level: 'expert', tools: ['S3', 'CloudFront']}], tasks: ['upload', 'storage', 'cdn'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'backend-6', name: 'Helena', icon: '🔌', role: 'integration', description: 'Integrações externas', specialty: ['Integrations', 'Webhooks', 'APIs', 'Third-party'], skills: [{name: 'Integration', level: 'expert', tools: ['REST', 'Webhooks']}, {name: 'Payment', level: 'advanced', tools: ['Stripe', 'PagSeguro']}], tasks: ['integrations', 'webhooks', 'payments'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'backend-7', name: 'Igor', icon: '📈', role: 'backend', description: 'Rate limiting e caching', specialty: ['Rate Limit', 'Cache', 'Redis', 'Performance'], skills: [{name: 'Cache', level: 'expert', tools: ['Redis', 'In-Memory']}, {name: 'Rate Limit', level: 'expert', tools: ['Upstash', 'express-rate-limit']}], tasks: ['caching', 'rate-limit', 'performance'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'backend-8', name: 'Julia', icon: '📝', role: 'backend', description: 'Validação e sanitização', specialty: ['Validation', 'Zod', 'Schema', 'Sanitization'], skills: [{name: 'Validation', level: 'expert', tools: ['Zod', 'Yup']}, {name: 'Sanitization', level: 'expert', tools: ['DOMPurify', 'XSS']}], tasks: ['validation', 'sanitization', 'schema'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'backend-9', name: 'Kevin', icon: '🌐', role: 'backend', description: 'CORS e headers de segurança', specialty: ['Security', 'CORS', 'CSP', 'Headers'], skills: [{name: 'Security', level: 'expert', tools: ['Helmet', 'CORS']}, {name: 'Headers', level: 'expert', tools: ['Security Headers', 'CSP']}], tasks: ['security', 'cors', 'headers'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'backend-10', name: 'Laura', icon: '📡', role: 'backend', description: 'WebSockets e real-time', specialty: ['WebSocket', 'Real-time', 'Socket.io', 'SSE'], skills: [{name: 'WebSocket', level: 'expert', tools: ['Socket.io', 'ws']}, {name: 'Real-time', level: 'expert', tools: ['SSE', 'Pusher']}], tasks: ['websocket', 'real-time', 'notifications'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },

  // ========== DEVOPS (8 agentes) ==========
  { id: 'devops-1', name: 'Marcelo', icon: '🐳', role: 'devops', description: 'Docker e containers', specialty: ['Docker', 'Containers', 'Docker Compose', 'Multi-stage'], skills: [{name: 'Docker', level: 'expert', tools: ['Docker', 'Docker Compose']}, {name: 'Containers', level: 'expert', tools: ['Multi-stage', 'Best Practices']}], tasks: ['docker', 'containers', 'deployment'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'devops-2', name: 'Natalia', icon: '☁️', role: 'devops', description: 'Vercel e deploy', specialty: ['Vercel', 'Deploy', 'Edge Functions', 'CDN'], skills: [{name: 'Vercel', level: 'expert', tools: ['Vercel CLI', 'Dashboard']}, {name: 'Edge', level: 'expert', tools: ['Edge Functions', 'ISR']}], tasks: ['deploy', 'vercel', 'cdn'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'devops-3', name: 'Otavio', icon: '🔄', role: 'devops', description: 'CI/CD pipelines', specialty: ['CI/CD', 'GitHub Actions', 'Automation', 'Testing'], skills: [{name: 'CI', level: 'expert', tools: ['GitHub Actions', 'Workflows']}, {name: 'CD', level: 'expert', tools: ['Deployments', 'Rollbacks']}], tasks: ['ci', 'cd', 'automation'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'devops-4', name: 'Patricia', icon: '🔐', role: 'devops', description: 'Secrets e variáveis de ambiente', specialty: ['Secrets', 'Env', 'Configuration', 'Security'], skills: [{name: 'Secrets', level: 'expert', tools: ['Vercel Env', 'Dotenv']}, {name: 'Config', level: 'expert', tools: ['Configuration']}], tasks: ['secrets', 'env', 'config'], autonomy: 'high', priority: 1, active: true, completedTasks: 0 },
  { id: 'devops-5', name: 'Quentin', icon: '📊', role: 'devops', description: 'Monitoring e logs', specialty: ['Monitoring', 'Logs', 'Sentry', 'Datadog'], skills: [{name: 'Monitoring', level: 'expert', tools: ['Sentry', 'LogSnag']}, {name: 'Logs', level: 'expert', tools: ['Structured Logging']}], tasks: ['monitoring', 'logs', 'alerts'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'devops-6', name: 'Renata', icon: '🌍', role: 'devops', description: 'Neon database integration', specialty: ['Neon', 'Serverless Postgres', 'Branching', 'Prisma'], skills: [{name: 'Neon', level: 'expert', tools: ['Neon Console', 'Prisma']}, {name: 'Serverless', level: 'expert', tools: ['Connection Pooling', 'Branching']}], tasks: ['neon', 'database', 'prisma'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'devops-7', name: 'Sérgio', icon: '⚖️', role: 'devops', description: 'Load balancing e scaling', specialty: ['Scaling', 'Load Balancer', 'Auto-scaling', 'HA'], skills: [{name: 'Scaling', level: 'expert', tools: ['Vercel Edge', 'CDN']}, {name: 'HA', level: 'advanced', tools: ['High Availability']}], tasks: ['scaling', 'load-balancing', 'ha'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },
  { id: 'devops-8', name: 'Tatiana', icon: '🔧', role: 'devops', description: 'Infraestrutura como código', specialty: ['IaC', 'Terraform', 'AWS', 'CloudFormation'], skills: [{name: 'IaC', level: 'advanced', tools: ['Terraform']}, {name: 'Cloud', level: 'advanced', tools: ['AWS', 'Cloudflare']}], tasks: ['iac', 'infrastructure', 'cloud'], autonomy: 'high', priority: 3, active: true, completedTasks: 0 },

  // ========== PRODUCT (6 agentes) ==========
  { id: 'product-1', name: 'Ulisses', icon: '📋', role: 'product', description: 'Roadmap e priorização', specialty: ['Roadmap', 'Prioritization', 'OKRs', 'Strategy'], skills: [{name: 'Roadmap', level: 'expert', tools: ['Prioritization', 'MoSCoW']}, {name: 'Strategy', level: 'expert', tools: ['OKRs', 'KPIs']}], tasks: ['roadmap', 'priorities', 'planning'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'product-2', name: 'Viviane', icon: '👥', role: 'product', description: 'User research e feedback', specialty: ['User Research', 'Feedback', 'Interviews', 'Personas'], skills: [{name: 'Research', level: 'expert', tools: ['Interviews', 'Surveys']}, {name: 'Feedback', level: 'expert', tools: ['User Feedback', 'Analytics']}], tasks: ['research', 'feedback', 'personas'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'product-3', name: 'Wagner', icon: '📱', role: 'product', description: 'Mobile-first mindset', specialty: ['Mobile', 'User Experience', 'Onboarding', 'Retention'], skills: [{name: 'Mobile', level: 'expert', tools: ['Mobile UX', 'App Store']}, {name: 'Retention', level: 'expert', tools: ['Onboarding', 'NPS']}], tasks: ['mobile', 'onboarding', 'retention'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'product-4', name: 'Ximena', icon: '💰', role: 'product', description: 'Monetização e pricing', specialty: ['Monetization', 'Pricing', 'Business Model', 'Revenue'], skills: [{name: 'Business', level: 'expert', tools: ['Pricing Models', 'Subscription']}, {name: 'Revenue', level: 'expert', tools: ['MRR', 'LTV']}], tasks: ['monetization', 'pricing', 'business'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'product-5', name: 'Yuri', icon: '🎯', role: 'product', description: 'Analytics e métricas', specialty: ['Analytics', 'Metrics', 'A/B Testing', 'Funnels'], skills: [{name: 'Analytics', level: 'expert', tools: ['Google Analytics', 'Mixpanel']}, {name: 'Testing', level: 'expert', tools: ['A/B Tests', 'Feature Flags']}], tasks: ['analytics', 'metrics', 'testing'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'product-6', name: 'Zara', icon: '🚀', role: 'product', description: 'Growth hacking', specialty: ['Growth', 'Viral', 'Referral', 'Activation'], skills: [{name: 'Growth', level: 'expert', tools: ['Referral', 'Viral Loops']}, {name: 'Activation', level: 'expert', tools: ['Activation', 'Onboarding']}], tasks: ['growth', 'viral', 'referral'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },

  // ========== QA (6 agentes) ==========
  { id: 'qa-1', name: 'André', icon: '🧪', role: 'qa', description: 'Testes unitários', specialty: ['Unit Tests', 'Jest', 'Vitest', 'Coverage'], skills: [{name: 'Testing', level: 'expert', tools: ['Jest', 'Vitest']}, {name: 'Coverage', level: 'expert', tools: ['Istanbul', 'Coverage Reports']}], tasks: ['unit-tests', 'coverage', 'mocking'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'qa-2', name: 'Beatriz', icon: '🔄', role: 'qa', description: 'Testes de integração', specialty: ['Integration Tests', 'API Testing', 'Contracts'], skills: [{name: 'Integration', level: 'expert', tools: ['Supertest', 'Pact']}, {name: 'API', level: 'expert', tools: ['API Testing', 'Contracts']}], tasks: ['integration-tests', 'api-tests', 'contracts'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'qa-3', name: 'Caio', icon: '🖥️', role: 'qa', description: 'Testes E2E', specialty: ['E2E', 'Cypress', 'Playwright', 'Automation'], skills: [{name: 'E2E', level: 'expert', tools: ['Cypress', 'Playwright']}, {name: 'Automation', level: 'expert', tools: ['CI Integration']}], tasks: ['e2e', 'automation', 'bdd'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'qa-4', name: 'Diana', icon: '🐛', role: 'qa', description: 'Bug hunting e triagem', specialty: ['Bug Reports', 'Triage', 'Reprodução', 'Priorização'], skills: [{name: 'Bug Reports', level: 'expert', tools: ['Reprodução', 'Triage']}, {name: 'Prioritization', level: 'expert', tools: ['Severity', 'Impact']}], tasks: ['bugs', 'triage', 'reports'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'qa-5', name: 'Enzo', icon: '⚡', role: 'qa', description: 'Performance testing', specialty: ['Load Testing', 'k6', 'Stress', 'Performance'], skills: [{name: 'Load', level: 'expert', tools: ['k6', 'Load Testing']}, {name: 'Stress', level: 'expert', tools: ['Stress Testing', 'Bottlenecks']}], tasks: ['load-tests', 'performance', 'stress'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'qa-6', name: 'Flávia', icon: '♿', role: 'qa', description: 'Testes de acessibilidade', specialty: ['A11y Testing', 'axe', 'WCAG', 'Screen Readers'], skills: [{name: 'A11y', level: 'expert', tools: ['axe-core', 'Lighthouse']}, {name: 'WCAG', level: 'expert', tools: ['WCAG 2.1', 'Screen Readers']}], tasks: ['a11y-tests', 'wcag', 'accessibility'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },

  // ========== DATA (4 agentes) ==========
  { id: 'data-1', name: 'Gabriel', icon: '🗃️', role: 'data', description: 'Modelagem de dados', specialty: ['Data Modeling', 'Schema Design', 'ERD', 'Normalization'], skills: [{name: 'Modeling', level: 'expert', tools: ['Prisma', 'Schema Design']}, {name: 'ERD', level: 'expert', tools: ['ERD Tools', 'Normalization']}], tasks: ['data-modeling', 'schema', 'erds'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'data-2', name: 'Helena', icon: '🔍', role: 'data', description: 'Query optimization', specialty: ['Query Optimization', 'Indexes', 'Explain Analyze', 'Performance'], skills: [{name: 'Optimization', level: 'expert', tools: ['Explain Analyze', 'Indexes']}, {name: 'Performance', level: 'expert', tools: ['Query Analysis']}], tasks: ['query-optimization', 'indexes', 'performance'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'data-3', name: 'Ivan', icon: '📊', role: 'data', description: 'Analytics e relatórios', specialty: ['Analytics', 'Reports', 'Dashboards', 'Metrics'], skills: [{name: 'Analytics', level: 'expert', tools: ['Analytics', 'Reports']}, {name: 'Metrics', level: 'expert', tools: ['Business Metrics']}], tasks: ['analytics', 'reports', 'dashboards'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'data-4', name: 'Joana', icon: '🔮', role: 'data', description: 'Data pipeline e ETL', specialty: ['Pipeline', 'ETL', 'Data Flow', 'Automation'], skills: [{name: 'Pipeline', level: 'expert', tools: ['Data Pipeline']}, {name: 'ETL', level: 'expert', tools: ['ETL', 'Data Flow']}], tasks: ['pipelines', 'etl', 'data-flow'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },

  // ========== AI/ML (4 agentes) ==========
  { id: 'ai-1', name: 'Lucas', icon: '🤖', role: 'ai', description: 'Chatbot e assistentes', specialty: ['Chatbot', 'NLP', 'Claude API', 'Conversational AI'], skills: [{name: 'Chatbot', level: 'expert', tools: ['Claude API', 'Conversational AI']}, {name: 'NLP', level: 'expert', tools: ['NLP', 'Intent']}], tasks: ['chatbot', 'nlp', 'assistants'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'ai-2', name: 'Marina', icon: '📝', role: 'ai', description: 'Content generation', specialty: ['Content', 'Generation', 'LLM', 'Prompts'], skills: [{name: 'Content', level: 'expert', tools: ['LLM', 'Content Generation']}, {name: 'Prompts', level: 'expert', tools: ['Prompt Engineering']}], tasks: ['content', 'generation', 'prompts'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'ai-3', name: 'Nicolas', icon: '🔮', role: 'ai', description: 'Recomendação e personalização', specialty: ['Recommendation', 'Personalization', 'ML', 'Collaborative Filtering'], skills: [{name: 'Recommendation', level: 'expert', tools: ['Recommendation Systems']}, {name: 'ML', level: 'advanced', tools: ['Machine Learning']}], tasks: ['recommendation', 'personalization', 'ml'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },
  { id: 'ai-4', name: 'Olivia', icon: '📊', role: 'ai', description: 'Análise preditiva', specialty: ['Predictive', 'Forecasting', 'Trends', 'Analytics'], skills: [{name: 'Predictive', level: 'expert', tools: ['Forecasting', 'Trends']}, {name: 'Analytics', level: 'expert', tools: ['Predictive Analytics']}], tasks: ['predictive', 'forecasting', 'trends'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },

  // ========== SECURITY (4 agentes) ==========
  { id: 'security-1', name: 'Pedro', icon: '🔐', role: 'security', description: 'Auth e autorização', specialty: ['Auth', 'JWT', 'OAuth', 'Permissions', 'RBAC'], skills: [{name: 'Auth', level: 'expert', tools: ['JWT', 'OAuth', 'Sessions']}, {name: 'Permissions', level: 'expert', tools: ['RBAC', 'Permissions']}], tasks: ['auth', 'permissions', 'rbac'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'security-2', name: 'Quitéria', icon: '🛡️', role: 'security', description: 'Pentest e vulnerabilidades', specialty: ['Pentest', 'Vulnerabilities', 'OWASP', 'Security Scanning'], skills: [{name: 'Pentest', level: 'expert', tools: ['OWASP', 'Security Scanning']}, {name: 'Vulns', level: 'expert', tools: ['Vulnerability Assessment']}], tasks: ['pentest', 'vulnerabilities', 'owasp'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'security-3', name: 'Roberto', icon: '🔍', role: 'security', description: 'Code security review', specialty: ['Code Review', 'SAST', 'Security Patterns', 'Secure Coding'], skills: [{name: 'Code Review', level: 'expert', tools: ['SAST', 'Security Patterns']}, {name: 'Secure Coding', level: 'expert', tools: ['Best Practices']}], tasks: ['code-review', 'sast', 'patterns'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'security-4', name: 'Sofia', icon: '📋', role: 'security', description: 'Compliance e GDPR', specialty: ['Compliance', 'GDPR', 'LGPD', 'Data Privacy'], skills: [{name: 'Compliance', level: 'expert', tools: ['GDPR', 'LGPD']}, {name: 'Privacy', level: 'expert', tools: ['Data Privacy', 'PII']}], tasks: ['compliance', 'gdpr', 'privacy'], autonomy: 'high', priority: 2, active: true, completedTasks: 0 },

  // ========== INFRASTRUCTURE (6 agentes) ==========
  { id: 'infra-1', name: 'Thiago', icon: '🌐', role: 'infrastructure', description: 'DNS e domínios', specialty: ['DNS', 'Domains', 'CDN', 'SSL'], skills: [{name: 'DNS', level: 'expert', tools: ['DNS', 'Domains']}, {name: 'SSL', level: 'expert', tools: ['SSL Certificates', 'HTTPS']}], tasks: ['dns', 'domains', 'ssl'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'infra-2', name: 'Ursula', icon: '💾', role: 'infrastructure', description: 'Storage e backups', specialty: ['Storage', 'Backups', 'S3', 'Disaster Recovery'], skills: [{name: 'Storage', level: 'expert', tools: ['S3', 'Storage']}, {name: 'Backups', level: 'expert', tools: ['Disaster Recovery']}], tasks: ['storage', 'backups', 'recovery'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'infra-3', name: 'Valter', icon: '🔄', role: 'infrastructure', description: 'Load balancing', specialty: ['Load Balancer', 'Traffic', 'Routing', 'Health Checks'], skills: [{name: 'Load Balancer', level: 'expert', tools: ['Traffic Routing']}, {name: 'Health', level: 'expert', tools: ['Health Checks', 'Failover']}], tasks: ['load-balancer', 'traffic', 'routing'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'infra-4', name: 'Wendy', icon: '📧', role: 'infrastructure', description: 'Email e notificações', specialty: ['Email', 'SMTP', 'Notifications', 'Transactional'], skills: [{name: 'Email', level: 'expert', tools: ['SMTP', 'Resend', 'SendGrid']}, {name: 'Notifications', level: 'expert', tools: ['Push', 'Email']}], tasks: ['email', 'notifications', 'smtp'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'infra-5', name: 'Xavier', icon: '🔗', role: 'infrastructure', description: 'Webhooks e integrações', specialty: ['Webhooks', 'Events', 'Integration Patterns', 'Retry'], skills: [{name: 'Webhooks', level: 'expert', tools: ['Webhooks', 'Events']}, {name: 'Integration', level: 'expert', tools: ['Retry', 'Circuit Breaker']}], tasks: ['webhooks', 'events', 'integration'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'infra-6', name: 'Yasmin', icon: '📡', role: 'infrastructure', description: 'API gateway e routing', specialty: ['API Gateway', 'Routing', 'Middleware', 'Rate Limiting'], skills: [{name: 'Gateway', level: 'expert', tools: ['API Gateway']}, {name: 'Routing', level: 'expert', tools: ['Middleware', 'Rate Limiting']}], tasks: ['gateway', 'routing', 'middleware'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },

  // ========== MOBILE (4 agentes) ==========
  { id: 'mobile-1', name: 'Zeca', icon: '📱', role: 'mobile', description: 'React Native', specialty: ['React Native', 'Expo', 'Native Modules', 'App Store'], skills: [{name: 'React Native', level: 'expert', tools: ['Expo', 'Native Modules']}, {name: 'App Store', level: 'expert', tools: ['iOS', 'Android']}], tasks: ['mobile', 'react-native', 'expo'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
  { id: 'mobile-2', name: 'Alice', icon: '📲', role: 'mobile', description: 'PWA e apps web', specialty: ['PWA', 'Web App', 'Service Workers', 'Installable'], skills: [{name: 'PWA', level: 'expert', tools: ['Service Workers', 'Manifest']}, {name: 'Installable', level: 'expert', tools: ['PWA Install']}], tasks: ['pwa', 'web-app', 'installable'], autonomy: 'full', priority: 1, active: true, completedTasks: 0 },
  { id: 'mobile-3', name: 'Bruno', icon: '📸', role: 'mobile', description: 'Câmera e realidade aumentada', specialty: ['Camera', 'AR', 'Media', 'QR Code'], skills: [{name: 'Camera', level: 'expert', tools: ['Camera API', 'Media']}, {name: 'AR', level: 'advanced', tools: ['AR.js', 'Three.js']}], tasks: ['camera', 'ar', 'media'], autonomy: 'full', priority: 3, active: true, completedTasks: 0 },
  { id: 'mobile-4', name: 'Clara', icon: '🔔', role: 'mobile', description: 'Push notifications', specialty: ['Push', 'Notifications', 'Firebase', 'OneSignal'], skills: [{name: 'Push', level: 'expert', tools: ['Firebase', 'OneSignal']}, {name: 'Notifications', level: 'expert', tools: ['Local Notifications']}], tasks: ['push', 'notifications', 'firebase'], autonomy: 'full', priority: 2, active: true, completedTasks: 0 },
]

// Total: 58 agentes
export const TOTAL_AGENTS = agentsDatabase.length

// Get agent by ID
export function getAgent(id: AgentId): Agent | undefined {
  return agentsDatabase.find(a => a.id === id)
}

// Get agents by role
export function getAgentsByRole(role: AgentRole): Agent[] {
  return agentsDatabase.filter(a => a.role === role)
}

// Get active agents
export function getActiveAgents(): Agent[] {
  return agentsDatabase.filter(a => a.active)
}

// Get agents by specialty
export function getAgentsBySpecialty(specialty: string): Agent[] {
  return agentsDatabase.filter(a => a.specialty.includes(specialty))
}