import { defineStore } from "pinia"
import { categoriesApi } from "@/api/categories.api"

// Categories state and crud actions
export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    items: [],
    loading: false,
    error: "",
  }),

  actions: {
    // Fetch all categories and deduplicate by id
    async fetchAll() {
      this.loading = true
      this.error = ""

      try {
        const res = await categoriesApi.list()

        const list = res.data ?? res.items ?? res ?? []

        // Safe deduplication using id as key
        this.items = Array.from(
          new Map(list.map(c => [c.id, c])).values()
        )
      } catch (e) {
        this.error = "Kunde inte hämta kategorier"
      } finally {
        this.loading = false
      }
    },

    // Create a new category
    async create(payload) {
      this.loading = true
      this.error = ""

      try {
        await categoriesApi.create(payload)
      } catch (e) {
        this.error = "Kunde inte skapa kategori"
        throw e
      } finally {
        this.loading = false
      }
    },

    // Update an existing category
    async update(categoryId, payload) {
      this.loading = true
      this.error = ""

      try {
        await categoriesApi.update(categoryId, payload)
      } catch (e) {
        this.error = "Kunde inte uppdatera kategori"
        throw e
      } finally {
        this.loading = false
      }
    },

    // Delete category and remove locally
    async delete(categoryId) {
      this.loading = true
      this.error = ""

      try {
        await categoriesApi.remove(categoryId)

        this.items = this.items.filter(c => c.id !== categoryId)
      } catch (e) {
        this.error = "Kunde inte ta bort kategori"
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
