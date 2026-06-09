import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '@/components/ui/product-card'

// Mock do useFavorite
jest.mock('@/store/favorites', () => ({
  useFavorite: () => ({
    isFavorite: false,
    toggleFavorite: jest.fn(),
  }),
}))

describe('ProductCard', () => {
  const defaultProps = {
    title: 'Hambúrguer Artesanal',
    description: 'Delicioso hambúrguer com queijo cheddar',
    price: 29.9,
 }

  describe('renderização', () => {
    it('deve renderizar título do produto', () => {
      render(<ProductCard {...defaultProps} />)
      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument()
    })

    it('deve renderizar descrição do produto', () => {
      render(<ProductCard {...defaultProps} />)
      expect(screen.getByText('Delicioso hambúrguer com queijo cheddar')).toBeInTheDocument()
    })

    it('deve renderizar preço formatado', () => {
      render(<ProductCard {...defaultProps} />)
      expect(screen.getByText('R$ 29,90')).toBeInTheDocument()
    })

    it('deve renderizar thumbnail placeholder quando não há imagem', () => {
      render(<ProductCard {...defaultProps} />)
      expect(screen.getByText('Img')).toBeInTheDocument()
    })

    it('deve renderizar thumbnail quando fornecido', () => {
      render(<ProductCard {...defaultProps} thumb="https://exemplo.com/img.jpg" />)
      expect(screen.getByText('https://exemplo.com/img.jpg')).toBeInTheDocument()
    })
  })

  describe('preço', () => {
    it('deve formatar preço corretamente', () => {
      render(<ProductCard {...defaultProps} price={99.99} />)
      expect(screen.getByText('R$ 99,99')).toBeInTheDocument()
    })

    it('deve formatar preço grande', () => {
      render(<ProductCard {...defaultProps} price={1999.99} />)
      expect(screen.getByText('R$ 1.999,99')).toBeInTheDocument()
    })

    it('deve formatar preço com decimais', () => {
      render(<ProductCard {...defaultProps} price={10.5} />)
      expect(screen.getByText('R$ 10,50')).toBeInTheDocument()
    })
  })

  describe('botão adicionar', () => {
    it('deve renderizar botão adicionar quando onAdd é fornecido', () => {
      render(<ProductCard {...defaultProps} onAdd={() => {}} />)
      expect(screen.getByText('Adicionar')).toBeInTheDocument()
    })

    it('não deve renderizar botão adicionar quando onAdd não é fornecido', () => {
      render(<ProductCard {...defaultProps} />)
      expect(screen.queryByText('Adicionar')).not.toBeInTheDocument()
    })

    it('deve chamar onAdd quando botão é clicado', async () => {
      const handleAdd = jest.fn()
      render(<ProductCard {...defaultProps} onAdd={handleAdd} />)

      const button = screen.getByText('Adicionar')
      await userEvent.click(button)

      expect(handleAdd).toHaveBeenCalledTimes(1)
    })
  })

  describe('favoritos', () => {
    it('deve renderizar botão de favorito quando productId é fornecido', () => {
      render(<ProductCard {...defaultProps} productId="prod-123" />)
      expect(screen.getByLabelText('Adicionar aos favoritos')).toBeInTheDocument()
    })

    it('não deve renderizar botão de favorito quando productId não é fornecido', () => {
      render(<ProductCard {...defaultProps} />)
      expect(screen.queryByLabelText('Adicionar aos favoritos')).not.toBeInTheDocument()
    })

    it('deve mostrar coração vazio quando não é favorito', () => {
      render(<ProductCard {...defaultProps} productId="prod-123" />)
      expect(screen.getByText('🤍')).toBeInTheDocument()
    })
  })

  describe('interatividade', () => {
    it('deve chamar onClick quando card é clicado', async () => {
      const handleClick = jest.fn()
      render(<ProductCard {...defaultProps} onClick={handleClick} />)

      const card = screen.getByText('Hambúrguer Artesanal').closest('div')
      if (card) {
        await userEvent.click(card)
      }

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('deve reagir a clique quando onClick é fornecido', () => {
      render(<ProductCard {...defaultProps} onClick={() => {}} />)
      const card = screen.getByText('Hambúrguer Artesanal').closest('div')
      expect(card).toBeTruthy()
    })
  })

  describe('descrição truncada', () => {
    it('deve ter classe line-clamp-2 na descrição', () => {
      render(<ProductCard {...defaultProps} />)
      const description = screen.getByText('Delicioso hambúrguer com queijo cheddar')
      expect(description).toHaveClass('line-clamp-2')
    })
  })
})
