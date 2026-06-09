// Exportações do package agents

export * from './types.js'
export { ceo, ceoConfig } from './agents/ceo.js'
export { marketing, marketingConfig } from './agents/marketing.js'
export { tech, techConfig } from './agents/tech.js'
export { customerRel, customerRelConfig } from './agents/customer-rel.js'
export { merchantRel, merchantRelConfig } from './agents/merchant-rel.js'
export { engine, startEngine, stopEngine } from './engine.js'

// Re-export configurações de todos os agentes
import { ceoConfig } from './agents/ceo.js'
import { marketingConfig } from './agents/marketing.js'
import { techConfig } from './agents/tech.js'
import { customerRelConfig } from './agents/customer-rel.js'
import { merchantRelConfig } from './agents/merchant-rel.js'

export const allAgentConfigs = [
  ceoConfig,
  marketingConfig,
  techConfig,
  customerRelConfig,
  merchantRelConfig
]