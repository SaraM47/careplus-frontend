import { defineStore } from 'pinia'
import { productsApi } from '@/api/products.api'
import { useToastStore } from '@/stores/toast.store'

// Products store definition
export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    total: 0,
    loading: false,
    error: '',

    query: {
      q: '',
      categoryId: '',
      inStock: '',
      priceMin: '',
      priceMax: '',
      sort: 'createdAt_desc',
      page: 1,
      pageSize: 10,
    },
  }),

  getters: {
    // Calculate total number of pages based on total items and page size
    pageCount(state) {
      return Math.max(1, Math.ceil((state.total || 0) / state.query.pageSize))
    },
  },

  actions: {
    // Update query parameters
    setQuery(patch) {
      this.query = { ...this.query, ...patch }
    },

    // Fetch product list based on current query
    async fetchList() {
      this.loading = true
      this.error = ''
      try {
        const res = await productsApi.list(this.query)
        this.items = res.items ?? res.data ?? []
        this.total = res.total ?? res.meta?.total ?? 0
      } catch (e) {
        this.error = 'Could not retrieve products'
      } finally {
        this.loading = false
      }
    },

    // Create new product without image
    async create(payload) {
      const toast = useToastStore()

      try {
        this.loading = true
        this.error = ''

        await productsApi.create(payload)
        toast.success('Produkt skapad')

        await this.fetchList()
      } catch (e) {
        this.error = 'Kunde inte skapa produkt'
        toast.error('Failed to create product')
        throw e
      } finally {
        this.loading = false
      }
    },

    // Create product with optional image upload
    async createWithImage(payload, file) {
      const toast = useToastStore()

      try {
        this.loading = true
        this.error = ''

        const created = await productsApi.create(payload)

        if (file) {
          await productsApi.uploadImage(created.id, file)
        }

        toast.success('Product created')
        await this.fetchList()

        return created
      } catch (e) {
        this.error = 'Kunde inte skapa produkt'
        toast.error('Failed to create product')
        throw e
      } finally {
        this.loading = false
      }
    },

    // Update product with optional image upload
    async updateWithImage(productId, payload, file) {
      const toast = useToastStore()

      try {
        this.loading = true
        this.error = ''

        const updated = await productsApi.update(productId, payload)

        if (file) {
          await productsApi.uploadImage(productId, file)
        }

        toast.success('Produkt uppdaterad')
        await this.fetchList()

        return updated
      } catch (e) {
        this.error = 'Kunde inte uppdatera produkt'
        toast.error('Failed to update product')
        throw e
      } finally {
        this.loading = false
      }
    },

    // Optimistic update of product details for edit
    async updateOptimistic(productId, payload) {
      const toast = useToastStore()

      const index = this.items.findIndex((p) => p.id === productId)
      if (index === -1) return

      const previous = { ...this.items[index] }

      this.items[index] = { ...previous, ...payload }

      try {
        const updated = await productsApi.update(productId, payload)
        this.items[index] = updated
        toast.success('Product updated')
        return updated
      } catch (e) {
        this.items[index] = previous
        this.error = 'Kunde inte uppdatera produkt'
        toast.error('Failed to update product')
        throw e
      }
    },

    // Delete product with optimistic UI update
    async deleteProduct(productId) {
      const toast = useToastStore()

      try {
        this.loading = true
        this.error = ''

        await productsApi.remove(productId)

        this.items = this.items.filter((p) => p.id !== productId)
        this.total = Math.max(0, (this.total || 0) - 1)

        toast.success('Product deleted')
      } catch (e) {
        this.error = 'Kunde inte ta bort produkt'
        toast.error('Failed to remove product')
        throw e
      } finally {
        this.loading = false
      }
    },

    // Adjust stock with optimistic UI update
    async adjustStock(productId, delta) {
      const toast = useToastStore()

      const product = this.items.find((p) => p.id === productId)
      if (!product) return

      const previousStock = product.stock

      product.stock += delta

      try {
        const updated = await productsApi.adjustStock(productId, delta)
        product.stock = updated.stock
        toast.success('Stock updated')
      } catch (e) {
        product.stock = previousStock
        this.error = 'Kunde inte uppdatera lagersaldo'
        toast.error('Failed to update stock balance')
      }
    },
  },
})
