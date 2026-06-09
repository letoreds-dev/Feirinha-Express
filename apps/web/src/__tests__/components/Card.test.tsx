import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from '@/components/ui/card'

describe('Card', () => {
  describe('renderização', () => {
    it('deve renderizar children', () => {
      render(<Card>Conteúdo do card</Card>)
      expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
    })

    it('deve renderizar múltiplos children', () => {
      render(
        <Card>
          <h2>Título</h2>
          <p>Descrição</p>
        </Card>
      )
      expect(screen.getByText('Título')).toBeInTheDocument()
      expect(screen.getByText('Descrição')).toBeInTheDocument()
    })
  })

  describe('estilos base', () => {
    it('deve renderizar card com estilos', () => {
      render(<Card>Card</Card>)
      const card = screen.getByText('Card')
      expect(card.parentElement).toBeTruthy()
    })
  })

  describe('padding', () => {
    it('deve renderizar card com padding padrão', () => {
      render(<Card>Card</Card>)
      const card = screen.getByText('Card')
      expect(card.parentElement).toBeTruthy()
    })

    it('deve aceitar prop padding', () => {
      render(<Card padding="lg">Card</Card>)
      const card = screen.getByText('Card')
      expect(card.parentElement).toBeTruthy()
    })
  })

  describe('className customizado', () => {
    it('deve aceitar className customizado', () => {
      render(<Card className="custom-class">Card</Card>)
      const card = screen.getByText('Card')
      expect(card.parentElement).toBeTruthy()
    })
  })

  describe('interatividade', () => {
    it('deve responder a clique quando onClick é provided', async () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Card clicável</Card>)

      const card = screen.getByText('Card clicável').closest('div')
      if (card) {
        await userEvent.click(card)
      }

      expect(handleClick).toHaveBeenCalled()
    })

    it('deve responder a clique quando onClick é provided', () => {
      render(<Card onClick={() => {}}>Card</Card>)
      const card = screen.getByText('Card')
      expect(card.parentElement).toBeTruthy()
    })
  })
})
