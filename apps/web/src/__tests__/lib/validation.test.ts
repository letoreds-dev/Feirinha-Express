import { z } from 'zod'
import {
  PhoneSchema,
  CPFSchema,
  CEPSchema,
  EmailSchema,
  PasswordSchema,
  LoginSchema,
  RegisterSchema,
  AddressSchema,
  ProductSchema,
  CartItemSchema,
  formatPhone,
  formatCPF,
  formatCEP,
  formatCardNumber,
  formatExpiry,
} from '@/lib/validation/schemas'

describe('PhoneSchema', () => {
  it('deve validar telefone válido com DDD', () => {
    expect(PhoneSchema.parse('(11) 99999-9999')).toBe('(11) 99999-9999')
    expect(PhoneSchema.parse('11999999999')).toBe('11999999999')
    expect(PhoneSchema.parse('(11) 9999-9999')).toBe('(11) 9999-9999')
  })

  it('deve rejeitar telefone inválido', () => {
    expect(() => PhoneSchema.parse('123')).toThrow()
    expect(() => PhoneSchema.parse('abcdefgh')).toThrow()
  })
})

describe('CPFSchema', () => {
  it('deve validar CPF com formato válido', () => {
    // Formato válido (não valida dígito verificador)
    expect(() => CPFSchema.parse('529.982.247-25')).not.toThrow()
  })

  it('deve rejeitar CPF com formato inválido', () => {
    expect(() => CPFSchema.parse('12345678900')).toThrow()
    expect(() => CPFSchema.parse('123.456.789')).toThrow()
  })

  it('deve rejeitar CPF sequencial', () => {
    expect(() => CPFSchema.parse('000.000.000-00')).toThrow()
    expect(() => CPFSchema.parse('111.111.111-11')).toThrow()
  })
})

describe('CEPSchema', () => {
  it('deve validar CEP válido', () => {
    expect(CEPSchema.parse('12345-678')).toBe('12345-678')
    expect(CEPSchema.parse('12345678')).toBe('12345678')
  })

  it('deve rejeitar CEP inválido', () => {
    expect(() => CEPSchema.parse('123')).toThrow()
    expect(() => CEPSchema.parse('abcdefgh')).toThrow()
  })
})

describe('EmailSchema', () => {
  it('deve validar e-mail válido', () => {
    expect(EmailSchema.parse('test@example.com')).toBe('test@example.com')
    expect(EmailSchema.parse('user.name@domain.co.uk')).toBe('user.name@domain.co.uk')
  })

  it('deve rejeitar e-mail inválido', () => {
    expect(() => EmailSchema.parse('invalid')).toThrow()
    expect(() => EmailSchema.parse('invalid@')).toThrow()
    expect(() => EmailSchema.parse('@domain.com')).toThrow()
  })

  it('deve rejeitar e-mail muito curto', () => {
    expect(() => EmailSchema.parse('a@b')).toThrow()
  })
})

describe('PasswordSchema', () => {
  it('deve validar senha com mínimo de caracteres', () => {
    expect(PasswordSchema.parse('123456')).toBe('123456')
    expect(PasswordSchema.parse('abcdefgh')).toBe('abcdefgh')
  })

  it('deve rejeitar senha muito curta', () => {
    expect(() => PasswordSchema.parse('12345')).toThrow()
    expect(() => PasswordSchema.parse('abc')).toThrow()
  })

  it('deve rejeitar senha muito longa', () => {
    expect(() => PasswordSchema.parse('a'.repeat(51))).toThrow()
  })
})

describe('LoginSchema', () => {
  it('deve validar dados de login válidos', () => {
    const result = LoginSchema.parse({
      email: 'test@example.com',
      password: '123456',
    })
    expect(result.email).toBe('test@example.com')
 })

  it('deve rejeitar login com dados inválidos', () => {
    expect(() => LoginSchema.parse({ email: 'invalid', password: '123' })).toThrow()
  })
})

describe('RegisterSchema', () => {
  it('deve validar registro com todos os campos obrigatórios', () => {
    const result = RegisterSchema.parse({
      name: 'Usuario Teste',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      password: '123456',
      confirmPassword: '123456',
      acceptTerms: true,
    })
    expect(result.name).toBe('Usuario Teste')
  })

  it('deve rejeitar quando senhas não coincidem', () => {
    expect(() =>
      RegisterSchema.parse({
        name: 'Usuario Teste',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        password: '123456',
        confirmPassword: 'different',
        acceptTerms: true,
      })
    ).toThrow()
  })

  it('deve rejeitar quando termos não são aceitos', () => {
    expect(() =>
      RegisterSchema.parse({
        name: 'Usuario Teste',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        password: '123456',
        confirmPassword: '123456',
        acceptTerms: false,
      })
    ).toThrow()
  })
})

describe('AddressSchema', () => {
  it('deve validar endereço completo', () => {
    const result = AddressSchema.parse({
      label: 'Casa',
      street: 'Rua Principal',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '12345-678',
    })
    expect(result.label).toBe('Casa')
  })

  it('deve aceitar complemento opcional', () => {
    const result = AddressSchema.parse({
      label: 'Trabalho',
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 501',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01310-100',
    })
    expect(result.complement).toBe('Sala 501')
  })
})

describe('ProductSchema', () => {
  it('deve validar produto com campos obrigatórios', () => {
    const result = ProductSchema.parse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Hambúrguer Artesanal',
      description: 'Delicioso hambúrguer caseiro',
      price: 29.9,
      category: 'Lanches',
      storeId: '550e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.name).toBe('Hambúrguer Artesanal')
    expect(result.price).toBe(29.9)
  })

  it('deve rejeitar preço negativo', () => {
    expect(() =>
      ProductSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Produto',
        description: 'Descrição',
        price: -10,
        category: 'Teste',
        storeId: '550e8400-e29b-41d4-a716-446655440001',
      })
    ).toThrow()
  })
})

describe('CartItemSchema', () => {
  it('deve validar item do carrinho', () => {
    const result = CartItemSchema.parse({
      productId: '550e8400-e29b-41d4-a716-446655440000',
      quantity: 2,
    })
    expect(result.quantity).toBe(2)
  })

  it('deve rejeitar quantidade inválida', () => {
    expect(() =>
      CartItemSchema.parse({
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 0,
      })
    ).toThrow()

    expect(() =>
      CartItemSchema.parse({
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 100,
      })
    ).toThrow()
  })
})

describe('formatPhone', () => {
  it('deve formatar telefone celular', () => {
    expect(formatPhone('11999999999')).toContain('9999-9999')
  })

  it('deve formatar telefone fixo', () => {
    expect(formatPhone('1133333333')).toContain('3333')
  })

  it('deve manter formato quando já formatado', () => {
    expect(formatPhone('(11) 99999-9999')).toContain('9999-9999')
  })
})

describe('formatCPF', () => {
  it('deve formatar CPF', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25')
  })

  it('deve formatar CPF parcialmente', () => {
    expect(formatCPF('529982')).toContain('529')
  })
})

describe('formatCEP', () => {
  it('deve formatar CEP', () => {
    expect(formatCEP('12345678')).toBe('12345-678')
  })

  it('deve formatar CEP parcialmente', () => {
    expect(formatCEP('12345')).toMatch(/^12345/)
  })
})

describe('formatCardNumber', () => {
  it('deve formatar número de cartão', () => {
    expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456')
  })

  it('deve formatar parcialmente', () => {
    expect(formatCardNumber('123456')).toBe('1234 56')
  })
})

describe('formatExpiry', () => {
  it('deve formatar data de validade', () => {
    expect(formatExpiry('1225')).toBe('12/25')
  })

  it('deve formatar data parcialmente', () => {
    expect(formatExpiry('12')).toMatch(/^12/)
  })
})
