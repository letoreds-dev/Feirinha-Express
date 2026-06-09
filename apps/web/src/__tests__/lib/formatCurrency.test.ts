import { formatCurrency, money, formatDate, generateId, cn } from '@/lib/utils'

describe('formatCurrency / money', () => {
  it('deve formatar valor em BRL', () => {
    expect(formatCurrency(10)).toContain('10,00')
    expect(formatCurrency(99.99)).toContain('99,99')
    expect(formatCurrency(1000)).toContain('1.000,00')
  })

  it('deve formatar valores decimais corretamente', () => {
    expect(formatCurrency(1.5)).toContain('1,50')
    expect(formatCurrency(99.9)).toContain('99,90')
    expect(formatCurrency(0.01)).toContain('0,01')
  })

  it('deve formatar valores grandes', () => {
    expect(formatCurrency(10000)).toContain('10.000,00')
    expect(formatCurrency(999999.99)).toContain('999.999,99')
  })

  it('deve formatar zero', () => {
    expect(formatCurrency(0)).toContain('0,00')
  })

  it('money deve ser alias de formatCurrency', () => {
    expect(money).toBe(formatCurrency)
  })
})

describe('formatDate', () => {
  it('deve formatar objeto Date', () => {
    const date = new Date(2024, 0, 15) // 15 de Janeiro de 2024
    expect(formatDate(date)).toBe('15/01/2024')
  })

  it('deve formatar string de data', () => {
    const date = new Date('2024-06-20T00:00:00')
    expect(formatDate(date)).toContain('06/2024')
  })

  it('deve formatar data com dia e mês de dígito único', () => {
    const date = new Date(2024, 0, 5) // 5 de Janeiro
    expect(formatDate(date)).toBe('05/01/2024')
  })
})

describe('generateId', () => {
  it('deve gerar ID não vazio', () => {
    const id = generateId()
    expect(id.length).toBeGreaterThan(0)
  })

  it('deve gerar IDs únicos', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    // Pode haver colisões, mas muito improvável com100
    expect(ids.size).toBeGreaterThan(90)
  })
})

describe('cn (classnames)', () => {
  it('deve combinar classes simples', () => {
    const result = cn('class-a', 'class-b')
    expect(result).toContain('class-a')
    expect(result).toContain('class-b')
  })

  it('deve lidar com valores condicionais', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
  })

  it('deve filtrar valores falsy', () => {
    const isDisabled = false
    const result = cn('base-class', isDisabled && 'disabled-class')
    expect(result).toContain('base-class')
    expect(result).not.toContain('disabled-class')
  })

  it('deve lidar com undefined e null', () => {
    const result = cn('class-a', undefined, null, 'class-b')
    expect(result).toContain('class-a')
    expect(result).toContain('class-b')
  })
})
