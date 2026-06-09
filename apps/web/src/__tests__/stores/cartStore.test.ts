import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/store/cart'

describe('useCartStore', () => {
  // Reset store antes de cada teste
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.clearCart()
    })
  })

  describe('addItem', () => {
    it('deve adicionar item ao carrinho', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].title).toBe('Produto Teste')
      expect(result.current.items[0].price).toBe(10.0)
      expect(result.current.items[0].quantity).toBe(1)
    })

    it('deve incrementar quantidade se item já existe', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        }, 2)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(3)
    })

    it('deve adicionar quantidade customizada', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        }, 5)
      })

      expect(result.current.items[0].quantity).toBe(5)
    })
  })

  describe('removeItem', () => {
    it('deve remover item do carrinho', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      const itemId = result.current.items[0].id

      act(() => {
        result.current.removeItem(itemId)
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('deve manter outros itens ao remover um', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto 1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
        result.current.addItem({
          productId: 'prod-2',
          title: 'Produto 2',
          price: 20.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      const itemIdToRemove = result.current.items[0].id

      act(() => {
        result.current.removeItem(itemIdToRemove)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].productId).toBe('prod-2')
    })
  })

  describe('updateQuantity', () => {
    it('deve atualizar quantidade de um item', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      const itemId = result.current.items[0].id

      act(() => {
        result.current.updateQuantity(itemId, 5)
      })

      expect(result.current.items[0].quantity).toBe(5)
    })

    it('deve remover item se quantidade for zero ou menor', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto Teste',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      const itemId = result.current.items[0].id

      act(() => {
        result.current.updateQuantity(itemId, 0)
      })

      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('deve limpar todos os itens do carrinho', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'Produto 1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
        result.current.addItem({
          productId: 'prod-2',
          title: 'Produto 2',
          price: 20.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.items).toHaveLength(0)
 })
  })

  describe('getSubtotal', () => {
    it('deve calcular subtotal corretamente', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        }, 2)
        result.current.addItem({
          productId: 'prod-2',
          title: 'P2',
          price: 5.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        }, 3)
      })

      //10 * 2 + 5 * 3 = 20 + 15 = 35
      expect(result.current.getSubtotal()).toBe(35)
    })

    it('deve retornar 0 para carrinho vazio', () => {
      const { result } = renderHook(() => useCartStore())
      expect(result.current.getSubtotal()).toBe(0)
    })
  })

  describe('getDeliveryFee', () => {
    it('deve calcular taxa de entrega base', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      // Taxa base é 4.90
      expect(result.current.getDeliveryFee()).toBe(4.9)
    })

    it('deve adicionar taxa extra para múltiplas lojas', () => {
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
          price: 10.0,
          storeId: 'store-2',
          storeName: 'Loja 2',
        })
      })

      // 4.90 base + 2.90 extra = 7.80
      expect(result.current.getDeliveryFee()).toBeCloseTo(7.8, 2)
    })

    it('deve retornar 0 para carrinho vazio', () => {
      const { result } = renderHook(() => useCartStore())
      expect(result.current.getDeliveryFee()).toBe(0)
    })
  })

  describe('getDiscount', () => {
    it('deve calcular desconto de5% (PIX)', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 100.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      // 5% de100 = 5
      expect(result.current.getDiscount()).toBe(5)
    })
  })

  describe('getTotal', () => {
    it('deve calcular total corretamente (subtotal + entrega - desconto)', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 100.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      // subtotal: 100, entrega: 4.90, desconto: 5
      // total: 100 + 4.90 - 5 = 99.90
      expect(result.current.getTotal()).toBe(99.9)
    })
  })

  describe('getCount', () => {
    it('deve retornar quantidade total de itens', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        }, 3)
        result.current.addItem({
          productId: 'prod-2',
          title: 'P2',
          price: 20.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        }, 2)
      })

      expect(result.current.getCount()).toBe(5)
    })
  })

  describe('getItemsByStore', () => {
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
        result.current.addItem({
          productId: 'prod-3',
          title: 'P3',
          price: 30.0,
          storeId: 'store-1',
          storeName: 'Loja 1',
        })
      })

      const itemsByStore = result.current.getItemsByStore()

      expect(itemsByStore.size).toBe(2)
      expect(itemsByStore.get('store-1')).toHaveLength(2)
      expect(itemsByStore.get('store-2')).toHaveLength(1)
    })
  })

  describe('hasItems', () => {
    it('deve retornar true se há itens', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      expect(result.current.hasItems()).toBe(true)
    })

    it('deve retornar false se carrinho vazio', () => {
      const { result } = renderHook(() => useCartStore())
      expect(result.current.hasItems()).toBe(false)
    })
  })

  describe('addItemWithOptions', () => {
    it('deve adicionar item com opções', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItemWithOptions(
          {
            productId: 'prod-1',
            title: 'Hambúrguer',
            price: 25.0,
            storeId: 'store-1',
            storeName: 'Loja Teste',
          },
          [{ id: 'opt-1', name: 'Bacon', price: 3.0 }],
1,
          'Sem cebola'
        )
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].options).toHaveLength(1)
      expect(result.current.items[0].options![0].name).toBe('Bacon')
      expect(result.current.items[0].notes).toBe('Sem cebola')
    })
  })

  describe('getCheckoutItems', () => {
    it('deve retornar itens formatados para checkout', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          productId: 'prod-1',
          title: 'P1',
          price: 10.0,
          storeId: 'store-1',
          storeName: 'Loja Teste',
        })
      })

      const checkoutItems = result.current.getCheckoutItems()

      expect(checkoutItems).toHaveLength(1)
      expect(checkoutItems[0]).toEqual({
        productId: 'prod-1',
        quantity: 1,
        options: undefined,
        notes: undefined,
      })
    })
  })
})
