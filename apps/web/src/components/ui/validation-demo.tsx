'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { ValidatedInput, ValidatedTextarea, ValidatedField, PasswordStrengthIndicator } from '@/lib/validation/hooks'
import { useValidation, usePasswordStrength } from '@/lib/validation/hooks'
import { RegisterSchema, LoginSchema, AddressSchema } from '@/lib/validation/schemas'
import { formatPhone, formatCEP, formatCPF, formatCardNumber, formatExpiry } from '@/lib/validation/schemas'
import { AnimatedNumber, AnimatedText, LoadingDots, PulseRing, SuccessAnimation } from '@/lib/animations/micro-interactions'
import { useCountUp, useTypingEffect, useShake, useStaggeredAnimation, useInView } from '@/lib/animations/micro-interactions'

// ==================== DEMO: FORMS WITH VALIDATION ====================

export function ValidationFormsDemo() {
  return (
    <div className="space-y-8">
      <RegisterFormDemo />
      <LoginFormDemo />
      <AddressFormDemo />
    </div>
  )
}

function RegisterFormDemo() {
  const form = useValidation({
    schema: RegisterSchema,
    initialData: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validateOnChange: true,
  })

  const passwordStrength = usePasswordStrength(form.data.password as string)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.submit((data) => {
      console.log('Register data:', data)
    })
  }

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">📝 Formulário de Cadastro</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ValidatedInput
          name="name"
          label="Nome completo"
          placeholder="Seu nome"
          value={form.data.name as string}
          onChange={(e) => form.setField('name', e.target.value)}
          error={form.getError('name')}
          required
        />

        <ValidatedInput
          name="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          value={form.data.email as string}
          onChange={(e) => form.setField('email', e.target.value)}
          error={form.getError('email')}
          required
        />

        <ValidatedInput
          name="phone"
          type="tel"
          label="Telefone"
          placeholder="(11) 99999-9999"
          value={form.data.phone as string}
          onChange={(e) => form.setField('phone', formatPhone(e.target.value))}
          error={form.getError('phone')}
          required
        />

        <div>
          <ValidatedInput
            name="password"
            type="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={form.data.password as string}
            onChange={(e) => form.setField('password', e.target.value)}
            error={form.getError('password')}
            required
          />
          <div className="mt-2">
            <PasswordStrengthIndicator password={form.data.password as string} />
          </div>
        </div>

        <ValidatedInput
          name="confirmPassword"
          type="password"
          label="Confirmar senha"
          placeholder="Repita a senha"
          value={form.data.confirmPassword as string}
          onChange={(e) => form.setField('confirmPassword', e.target.value)}
          error={form.getError('confirmPassword')}
          required
        />

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.data.acceptTerms as boolean}
            onChange={(e) => form.setField('acceptTerms', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-brand-line text-brand-red focus:ring-brand-red"
          />
          <span className="text-sm text-brand-ink">
            Li e aceito os <a href="#" className="text-brand-red">Termos de Uso</a> e <a href="#" className="text-brand-red">Política de Privacidade</a>
          </span>
        </label>
        {form.getError('acceptTerms') && (
          <p className="text-sm text-red-500">{form.getError('acceptTerms')}</p>
        )}

        <Button type="submit" className="w-full" loading={form.isSubmitting}>
          Criar Conta
        </Button>
      </form>
    </Card>
  )
}

function LoginFormDemo() {
  const form = useValidation({
    schema: LoginSchema,
    initialData: {
      email: '',
      password: '',
    },
    validateOnBlur: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.submit((data) => {
      console.log('Login data:', data)
    })
  }

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">🔐 Formulário de Login</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ValidatedInput
          name="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          value={form.data.email as string}
          onChange={(e) => form.setField('email', e.target.value)}
          onBlur={() => form.validateField('email')}
          error={form.getError('email')}
          required
        />

        <ValidatedInput
          name="password"
          type="password"
          label="Senha"
          placeholder="Sua senha"
          value={form.data.password as string}
          onChange={(e) => form.setField('password', e.target.value)}
          error={form.getError('password')}
          required
        />

        <Button type="submit" className="w-full" loading={form.isSubmitting}>
          Entrar
        </Button>
      </form>
    </Card>
  )
}

function AddressFormDemo() {
  const form = useValidation({
    schema: AddressSchema,
    initialData: {
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '',
      instructions: '',
      isDefault: false,
    },
    validateOnChange: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.validateAll()) {
      console.log('Address data:', form.data)
    }
  }

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">📍 Formulário de Endereço</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ValidatedInput
            name="label"
            label="Nome"
            placeholder="Casa, Trabalho..."
            value={form.data.label as string}
            onChange={(e) => form.setField('label', e.target.value)}
            error={form.getError('label')}
            required
          />
          <ValidatedInput
            name="postalCode"
            label="CEP"
            placeholder="00000-000"
            value={form.data.postalCode as string}
            onChange={(e) => form.setField('postalCode', formatCEP(e.target.value))}
            error={form.getError('postalCode')}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <ValidatedInput
              name="street"
              label="Endereço"
              placeholder="Rua, Avenida..."
              value={form.data.street as string}
              onChange={(e) => form.setField('street', e.target.value)}
              error={form.getError('street')}
              required
            />
          </div>
          <ValidatedInput
            name="number"
            label="Número"
            placeholder="123"
            value={form.data.number as string}
            onChange={(e) => form.setField('number', e.target.value)}
            error={form.getError('number')}
            required
          />
        </div>

        <ValidatedInput
          name="complement"
          label="Complemento"
          placeholder="Apto, Bloco..."
          value={form.data.complement as string}
          onChange={(e) => form.setField('complement', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <ValidatedInput
            name="neighborhood"
            label="Bairro"
            placeholder="Bairro"
            value={form.data.neighborhood as string}
            onChange={(e) => form.setField('neighborhood', e.target.value)}
            error={form.getError('neighborhood')}
            required
          />
          <ValidatedInput
            name="state"
            label="UF"
            placeholder="SP"
            value={form.data.state as string}
            onChange={(e) => form.setField('state', e.target.value.toUpperCase().slice(0, 2))}
            error={form.getError('state')}
            required
          />
        </div>

        <ValidatedTextarea
          name="instructions"
          label="Instruções de entrega"
          placeholder="Próximo ao mercado,interfone..."
          value={form.data.instructions as string}
          onChange={(e) => form.setField('instructions', e.target.value)}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.data.isDefault as boolean}
            onChange={(e) => form.setField('isDefault', e.target.checked)}
            className="w-5 h-5 rounded border-brand-line text-brand-red focus:ring-brand-red"
          />
          <span className="text-sm text-brand-ink">Definir como endereço padrão</span>
        </label>

        <Button type="submit" className="w-full" loading={form.isSubmitting}>
          Salvar Endereço
        </Button>
      </form>
    </Card>
  )
}

// ==================== DEMO: ANIMATIONS ====================

export function AnimationsDemo() {
  const { ref, isInView } = useInView(0.3)
  const staggerCount = useStaggeredAnimation(5, 100)

  return (
    <div className="space-y-8">
      {/* Animated Numbers */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">🔢 Números Animados</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-brand-soft rounded-xl">
            <AnimatedNumber value={1500} prefix="R$ " suffix=",00" className="text-2xl font-extrabold text-brand-red" />
            <p className="text-sm text-brand-muted">Pedidos hoje</p>
          </div>
          <div className="p-4 bg-brand-soft rounded-xl">
            <AnimatedNumber value={89.9} decimals={1} prefix="" suffix="%" className="text-2xl font-extrabold text-emerald-500" />
            <p className="text-sm text-brand-muted">Entregas no prazo</p>
          </div>
          <div className="p-4 bg-brand-soft rounded-xl">
            <AnimatedNumber value={4.8} decimals={1} suffix=" ⭐" className="text-2xl font-extrabold text-yellow-500" />
            <p className="text-sm text-brand-muted">Avaliação média</p>
          </div>
        </div>
      </Card>

      {/* Typed Text */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">⌨️ Texto Animado</h3>
        <div className="p-4 bg-brand-soft rounded-xl">
          <AnimatedText
            text="Bem-vindo ao Feirinha Express! 🍎"
            speed={80}
            className="text-lg font-medium"
          />
        </div>
      </Card>

      {/* Loading States */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">⏳ Estados de Carregamento</h3>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <LoadingDots size="sm" />
            <p className="text-xs text-brand-muted mt-2">Pequeno</p>
          </div>
          <div className="text-center">
            <LoadingDots size="md" />
            <p className="text-xs text-brand-muted mt-2">Médio</p>
          </div>
          <div className="text-center">
            <LoadingDots size="lg" />
            <p className="text-xs text-brand-muted mt-2">Grande</p>
          </div>
        </div>
      </Card>

      {/* Pulse Ring */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">💫 Anel de Pulso</h3>
        <div className="flex items-center justify-center gap-8">
          <PulseRing color="#FF6B6B" size={40} />
          <PulseRing color="#4ECDC4" size={60} />
          <PulseRing color="#FFE66D" size={80} />
        </div>
      </Card>

      {/* Staggered Animation */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📋 Animação Escalonada</h3>
        <div className="space-y-2" ref={ref}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`p-4 bg-brand-soft rounded-xl transition-all duration-300 ${
                i <= staggerCount
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              Item {i} - {i <= staggerCount ? 'Visível' : 'Oculto'}
            </div>
          ))}
        </div>
      </Card>

      {/* In View Animation */}
      <Card padding="md" className={isInView ? 'animate-fade-up' : 'opacity-50'}>
        <h3 className="font-bold text-brand-ink mb-4">👁️ Animação ao Entrar na Tela</h3>
        <p className="text-brand-muted">
          Role para baixo para ver a animação! {isInView ? '🎉 Visível!' : ''}
        </p>
      </Card>

      {/* Success Animation */}
      <SuccessAnimationDemo />
    </div>
  )
}

function SuccessAnimationDemo() {
  const [show, setShow] = useState(false)

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-4">✅ Animação de Sucesso</h3>
      <Button onClick={() => setShow(true)} className="w-full">
        Mostrar Animação
      </Button>
      <SuccessAnimation show={show} onComplete={() => setShow(false)} />
    </Card>
  )
}

// ==================== DEMO PAGE ====================

export default function ValidationDemoPage() {
  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      <div className="px-4 py-6 max-w-[390px] mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold text-brand-ink">
          🎨 Demonstração de Validação e Animações
        </h1>

        <ValidationFormsDemo />
        <AnimationsDemo />
      </div>
    </div>
  )
}
