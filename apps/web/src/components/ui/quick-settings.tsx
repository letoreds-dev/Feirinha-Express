/**
 * Feirinha Express - Quick Actions & Shortcuts
 * Floating action buttons and keyboard shortcuts
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== QUICK ACTIONS TYPES ====================

interface QuickAction {
  id: string
  icon: string
  label: string
  description?: string
  href?: string
  onClick?: () => void
  color?: string
  badge?: string
}

interface QuickActionGroup {
  title: string
  actions: QuickAction[]
}

// ==================== FLOATING ACTION BUTTON ====================

interface FloatingActionButtonProps {
  icon?: string
  onClick?: () => void
  expanded?: boolean
  actions?: QuickAction[]
  position?: 'bottom-right' | 'bottom-left'
}

export function FloatingActionButton({
  icon = '⚡',
  onClick,
  expanded = false,
  actions = [],
  position = 'bottom-right',
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(expanded)

  const positionClasses = position === 'bottom-right'
    ? 'bottom-24 right-4'
    : 'bottom-24 left-4'

  return (
    <div className={`fixed ${positionClasses} z-40 flex flex-col items-end gap-3`}>
      {/* Expanded actions */}
      {isOpen && actions.length > 0 && (
        <div className="flex flex-col gap-2 items-end">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick?.()
                setIsOpen(false)
              }}
              className="flex items-center gap-3 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="px-3 py-1.5 bg-white rounded-full shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {action.label}
              </span>
              <div
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-110"
                style={{ backgroundColor: action.color || '#FF6B6B' }}
              >
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => {
          if (actions.length > 0) {
            setIsOpen(!isOpen)
          } else {
            onClick?.()
          }
        }}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all ${
          isOpen ? 'rotate-45 bg-brand-red-dark' : 'bg-brand-red hover:bg-brand-red-dark'
        }`}
        style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
      >
        {icon}
      </button>
    </div>
  )
}

// ==================== QUICK ACTIONS PANEL ====================

export function QuickActionsPanel() {
  const groups: QuickActionGroup[] = [
    {
      title: 'Pedidos',
      actions: [
        { id: '1', icon: '🛒', label: 'Novo Pedido', href: '/user' },
        { id: '2', icon: '📦', label: 'Meus Pedidos', href: '/user/orders' },
        { id: '3', icon: '🔄', label: 'Rastrear', href: '/user/tracking' },
      ],
    },
    {
      title: 'Conta',
      actions: [
        { id: '4', icon: '👤', label: 'Perfil', href: '/user/profile' },
        { id: '5', icon: '💳', label: 'Pagamentos', href: '/user/payments' },
        { id: '6', icon: '📍', label: 'Endereços', href: '/user/addresses' },
      ],
    },
    {
      title: 'Explorar',
      actions: [
        { id: '7', icon: '🔍', label: 'Buscar', href: '/user/search-page' },
        { id: '8', icon: '🏪', label: 'Lojas', href: '/user/stores-explore' },
        { id: '9', icon: '🎁', label: 'Promoções', href: '/user/promotions' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {groups.map((group, gIndex) => (
        <div key={gIndex}>
          <h3 className="font-bold text-brand-ink mb-3">{group.title}</h3>
          <div className="grid grid-cols-3 gap-3">
            {group.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => action.href && (window.location.href = action.href)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-brand-line hover:border-brand-red hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-brand-ink text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ==================== KEYBOARD SHORTCUTS ====================

interface KeyboardShortcut {
  key: string
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  description: string
  action: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const modifiersMatch = shortcut.modifiers?.every(mod => {
          if (mod === 'ctrl') return e.ctrlKey
          if (mod === 'alt') return e.altKey
          if (mod === 'shift') return e.shiftKey
          if (mod === 'meta') return e.metaKey
          return false
        }) ?? true

        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && modifiersMatch) {
          e.preventDefault()
          shortcut.action()
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}

export function KeyboardShortcutsHelp() {
  const shortcuts: { key: string; description: string }[] = [
    { key: 'Ctrl + K', description: 'Abrir busca' },
    { key: 'Ctrl + N', description: 'Novo pedido' },
    { key: 'Esc', description: 'Fechar modal' },
    { key: 'Enter', description: 'Confirmar ação' },
  ]

  return (
    <Card padding="md">
      <h3 className="font-bold text-brand-ink mb-3">⌨️ Atalhos</h3>
      <div className="space-y-2">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">{s.description}</span>
            <kbd className="px-2 py-1 bg-brand-soft rounded text-xs font-mono">
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ==================== THEME SWITCHER ====================

type Theme = 'light' | 'dark' | 'system'

interface ThemeSwitcherProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Claro', icon: '☀️' },
    { value: 'dark', label: 'Escuro', icon: '🌙' },
    { value: 'system', label: 'Sistema', icon: '💻' },
  ]

  return (
    <div className="flex gap-2">
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => onThemeChange(theme.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            currentTheme === theme.value
              ? 'bg-brand-red text-white'
              : 'bg-brand-soft text-brand-ink hover:bg-brand-line'
          }`}
        >
          <span>{theme.icon}</span>
          <span className="text-sm font-medium">{theme.label}</span>
        </button>
      ))}
    </div>
  )
}

// ==================== COLOR ACCENT PICKER ====================

const accentColors = [
  { name: 'Vermelho', value: '#FF6B6B' },
  { name: 'Azul', value: '#4ECDC4' },
  { name: 'Roxo', value: '#9B59B6' },
  { name: 'Verde', value: '#27AE60' },
  { name: 'Laranja', value: '#F39C12' },
  { name: 'Rosa', value: '#E91E63' },
  { name: 'Indigo', value: '#3F51B5' },
  { name: 'Teal', value: '#00BCD4' },
]

interface AccentColorPickerProps {
  currentColor: string
  onColorChange: (color: string) => void
}

export function AccentColorPicker({ currentColor, onColorChange }: AccentColorPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-brand-ink">Cor de Destaque</p>
      <div className="flex flex-wrap gap-2">
        {accentColors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
              currentColor === color.value ? 'ring-4 ring-offset-2 ring-brand-ink' : ''
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== APPEARANCE SETTINGS PAGE ====================

export function AppearanceSettings() {
  const [theme, setTheme] = useState<Theme>('light')
  const [accentColor, setAccentColor] = useState('#FF6B6B')
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [reducedMotion, setReducedMotion] = useState(false)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-brand-ink">🎨 Aparência</h2>

      {/* Theme */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Tema</h3>
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
      </Card>

      {/* Accent Color */}
      <Card padding="md">
        <AccentColorPicker currentColor={accentColor} onColorChange={setAccentColor} />
      </Card>

      {/* Font Size */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-3">Tamanho da Fonte</h3>
        <div className="flex gap-2">
          {[
            { value: 'sm' as const, label: 'Pequeno', size: 'text-sm' },
            { value: 'md' as const, label: 'Médio', size: 'text-base' },
            { value: 'lg' as const, label: 'Grande', size: 'text-lg' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFontSize(option.value)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                fontSize === option.value
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-soft text-brand-ink'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={`mt-2 text-brand-muted ${fontSize === 'sm' ? 'text-sm' : fontSize === 'md' ? 'text-base' : 'text-lg'}`}>
          Este é um exemplo de como o texto aparecerá.
        </p>
      </Card>

      {/* Reduced Motion */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-brand-ink">Movimento Reduzido</h3>
            <p className="text-sm text-brand-muted">
              Desativa animações para melhor acessibilidade
            </p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-14 h-8 rounded-full transition-colors ${
              reducedMotion ? 'bg-brand-red' : 'bg-brand-line'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                reducedMotion ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Preview */}
      <Card padding="md" className="bg-gradient-to-br from-brand-paper to-brand-soft">
        <h3 className="font-bold text-brand-ink mb-3">Preview</h3>
        <div className="space-y-3">
          <Button className="w-full" style={{ backgroundColor: accentColor }}>
            Botão Primário
          </Button>
          <Button variant="secondary" className="w-full">
            Botão Secundário
          </Button>
          <Badge variant="success">Badge de Sucesso</Badge>
          <Badge variant="warning">Badge de Aviso</Badge>
        </div>
      </Card>
    </div>
  )
}

// ==================== CUSTOMIZATION PAGE ====================

export default function CustomizationPage() {
  return (
    <div className="min-h-screen bg-brand-paper pb-20">
      <div className="px-4 py-6 max-w-[390px] mx-auto">
        <AppearanceSettings />
        <div className="mt-6">
          <KeyboardShortcutsHelp />
        </div>
      </div>
    </div>
  )
}