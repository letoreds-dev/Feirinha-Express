import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/store/cart'

// Testes para o hook useCart (alias/wrapper da store)
describe('useCart (cartStore hook)', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.clearCart()
    })
  })

  describe('operações básicas', () => {
    it('deve adicionar item ao carrinho', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 25.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      expect(result.current.items.length).toBeGreaterThan(0)
      expect(result.current.hasItems()).toBe(true)
    })

    it('deve remover item do carrinho', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 25.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      const itemId = result.current.items[0].id

      act(() => {
        result.current.removeItem(itemId)
      })

      expect(result.current.items.length).toBe(0)
    })

    it('deve limpar carrinho', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
        result.current.addItem({
          productId: 'prod-2',
          title: 'P2',
          price: 20.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
      })

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.items.length).toBe(0)
      expect(result.current.hasItems()).toBe(false)
    })
  })

  describe('cálculos', () => {
    it('deve calcular subtotal corretamente', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        }, 2)
        result.current.addItem({
          productId: 'prod-2',
          title: 'P2',
          price: 15.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        }, 3)
      })

      //10 * 2 + 15 * 3 = 20 + 45 = 65
      expect(result.current.getSubtotal()).toBe(65)
    })

    it('deve calcular total com taxa de entrega e desconto', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 100.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
      })

      const subtotal = result.current.getSubtotal()
      const deliveryFee = result.current.getDeliveryFee()
      const discount = result.current.getDiscount()
      const total = result.current.getTotal()

      // Verifica que total = subtotal + entrega - desconto
      expect(total).toBeCloseTo(subtotal + deliveryFee - discount, 2)
    })

    it('deve retornar contagem de itens', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        }, 3)
        result.current.addItem({
          productId: 'prod-2',
          title: 'P2',
          price: 20.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        }, 2)
      })

      expect(result.current.getCount()).toBe(5)
    })
  })

  describe('atualização de quantidade', () => {
    it('deve atualizar quantidade', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
      })

      const itemId = result.current.items[0].id

      act(() => {
        result.current.updateQuantity(itemId, 5)
      })

      expect(result.current.items[0].quantity).toBe(5)
    })

    it('deve remover item quando quantidade é zero', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
      })

      const itemId = result.current.items[0].id

      act(() => {
        result.current.updateQuantity(itemId, 0)
      })

      expect(result.current.items.length).toBe(0)
    })
  })

  describe('itens por loja', () => {
    it('deve agrupar itens por loja', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
        result.current.addItem({
          productId: 'prod-2',
          title: 'P2',
          price: 20.0,
          storeId: 'store-2',
          storeName: 'Loja 2',
        })
      })

      const itemsByStore = result.current.getItemsByStore()

      expect(itemsByStore.size).toBe(2)
      expect(itemsByStore.has('store-1')).toBe(true)
      expect(itemsByStore.has('store-2')).toBe(true)
    })
  })
})
