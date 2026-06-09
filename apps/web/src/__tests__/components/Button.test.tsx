import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  describe('renderização', () => {
    it('deve renderizar children', () => {
      render(<Button>Clique aqui</Button>)
      expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
    })

    it('deve renderizar com texto', () => {
      render(<Button>Enviar</Button>)
      expect(screen.getByText('Enviar')).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('deve aplicar classe primary por padrão', () => {
      render(<Button>Botão</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-brand-red')
    })

    it('deve aplicar variant secondary', () => {
      render(<Button variant="secondary">Secundário</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-white')
      expect(button).toHaveClass('text-brand-red')
    })

    it('deve aplicar variant ghost', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
    })

    it('deve aplicar variant danger', () => {
      render(<Button variant="danger">Perigoso</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })

    it('deve aplicar variant outline', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
    })
  })

  describe('sizes', () => {
    it('deve aplicar size sm', () => {
      render(<Button size="sm">Pequeno</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('text-sm')
    })

    it('deve aplicar size md por padrão', () => {
      render(<Button>Médio</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
    })

    it('deve aplicar size lg', () => {
      render(<Button size="lg">Grande</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-14')
      expect(button).toHaveClass('text-lg')
    })
  })

  describe('estados', () => {
    it('deve estar desabilitado quando disabled=true', () => {
      render(<Button disabled>Desabilitado</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('deve mostrar estado de loading', () => {
      render(<Button loading>Carregando</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })

    it('deve mostrar ícone de loading animado', () => {
      render(<Button loading>Carregando</Button>)
      const spinner = screen.getByText('⟳')
      expect(spinner).toHaveClass('animate-spin')
    })
  })

  describe('interatividade', () => {
    it('deve chamar onClick quando clicado', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Clique</Button>)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('não deve chamar onClick quando desabilitado', async () => {
      const handleClick = jest.fn()
      render(<Button disabled onClick={handleClick}>Clique</Button>)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('não deve chamar onClick quando em loading', async () => {
      const handleClick = jest.fn()
      render(<Button loading onClick={handleClick}>Clique</Button>)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibilidade', () => {
    it('deve ser um botão acessível', () => {
      render(<Button>Teste</Button>)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })

    it('deve aceitar aria-label', () => {
      render(<Button aria-label="Botão de ação">Ação</Button>)
      expect(screen.getByLabelText('Botão de ação')).toBeInTheDocument()
    })
  })
})
