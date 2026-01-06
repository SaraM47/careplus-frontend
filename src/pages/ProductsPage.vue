<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">Inventory</h1>
      <h2 class="text-2xl my-8 -mb-5">Search</h2>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row gap-4 my-10">
      <!-- Search -->
      <form role="search" @submit.prevent class="relative flex-1">
        <label for="product-search" class="sr-only">Search products</label>

        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        ></i>

        <input
          id="product-search"
          v-model="products.query.q"
          type="search"
          placeholder="Search products"
          class="w-full pl-12 pr-4 py-3 border border-gray-500 rounded-full text-sm"
        />
      </form>

      <!-- Filter toggle -->
      <button
        type="button"
        @click="showFilters = !showFilters"
        class="inline-flex items-center gap-2 px-5 py-3 border border-gray-500 rounded-full text-sm bg-white hover:bg-gray-50"
      >
        <i class="fa-solid fa-filter"></i>
        Filter
      </button>

      <!-- Add new -->
      <BaseButton v-if="isAdmin" icon="fa-solid fa-plus" @click="openCreate"> Add new </BaseButton>
    </div>

    <!-- Filter panel -->
    <ProductsFilter
      v-if="showFilters"
      :categories="categories.items"
      :initialQuery="products.query"
      @applied="onFiltersApplied"
    />

    <!-- Loading -->
    <div
      v-if="products.loading"
      class="bg-white rounded-xl shadow-soft p-6 text-xl flex items-center"
    >
      <i class="fa-solid fa-spinner fa-spin mr-2 text-2xl"></i>
      Loading products...
    </div>

    <!-- Error -->
    <div
      v-else-if="products.error"
      class="bg-white rounded-xl shadow-soft p-6 text-xl text-red-700 flex items-center"
    >
      <i class="fa-solid fa-triangle-exclamation mr-2"></i>
      {{ products.error }}
    </div>

    <!-- Desktop table -->
    <div v-else class="hidden md:block space-y-4">
      <div class="grid grid-cols-7 gap-4 px-4 text-sm font-medium text-black-600">
        <div>Product image</div>
        <div>Product name</div>
        <div>Short description</div>
        <div>Category</div>
        <div>Price</div>
        <div>Stock balance</div>
        <div>Actions</div>
      </div>

      <div
        v-for="p in products.items"
        :key="p.id"
        class="grid grid-cols-7 gap-4 items-center bg-white px-4 py-4 shadow-(--shadow-row)"
      >
        <div class="w-16 h-16 rounded bg-gray-200 overflow-hidden">
          <img
            v-if="p.imagePath"
            :src="p.imagePath"
            alt=""
            aria-hidden="true"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="font-medium">{{ p.name }}</div>

        <div class="text-sm text-gray-500">
          {{ p.description || '—' }}
        </div>

        <div>
          <CategoryBadge>{{ categoryName(p.categoryId) }}</CategoryBadge>
        </div>

        <div>{{ formatPrice(p.price) }}</div>

        <div>
          <div class="flex items-center gap-2 border rounded-full px-2 py-1 w-fit">
            <button
              type="button"
              :aria-label="`Decrease stock for ${p.name}`"
              :disabled="!canAdjustStock || p.stock <= 0"
              @click="products.adjustStock(p.id, -1)"
              class="w-6 h-6 rounded-full border flex items-center justify-center"
            >
              <i class="fa-solid fa-minus" aria-hidden="true"></i>
            </button>

            <span class="min-w-5 text-center text-sm">{{ p.stock }}</span>

            <button
              type="button"
              :aria-label="`Increase stock for ${p.name}`"
              :disabled="!canAdjustStock"
              @click="products.adjustStock(p.id, +1)"
              class="w-6 h-6 rounded-full border flex items-center justify-center"
            >
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <button type="button" :aria-label="`Edit ${p.name}`" @click="openView(p)">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button v-if="isAdmin" type="button" :aria-label="`Edit`" @click="openEdit(p)">
            <i class="fa-solid fa-pen" aria-hidden="true"></i>
          </button>
          <button
            v-if="isAdmin"
            type="button"
            :aria-label="`Delete ${p.name}`"
            @click="openDelete(p)"
          >
            <i class="fa-solid fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-4">
      <div
        v-for="p in products.items"
        :key="p.id"
        class="bg-white rounded-xl shadow-soft p-4 space-y-3"
      >
        <div class="flex gap-4">
          <div class="w-16 h-16 rounded bg-gray-200 overflow-hidden">
            <img
              v-if="p.imagePath"
              :src="p.imagePath"
              alt=""
              aria-hidden="true"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1">
            <div class="font-medium">{{ p.name }}</div>
            <div class="text-sm text-gray-500">{{ p.description || '—' }}</div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <CategoryBadge>{{ categoryName(p.categoryId) }}</CategoryBadge>
          <div class="font-medium">{{ formatPrice(p.price) }}</div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 border rounded-full px-2 py-1">
            <button
              type="button"
              :aria-label="`Decrease stock for ${p.name}`"
              :disabled="!canAdjustStock || p.stock <= 0"
              @click="products.adjustStock(p.id, -1)"
              class="w-6 h-6 rounded-full border flex items-center justify-center"
            >
              <i class="fa-solid fa-minus" aria-hidden="true"></i>
            </button>

            <span class="min-w-5 text-center text-sm">{{ p.stock }}</span>

            <button
              type="button"
              :aria-label="`Increase stock for ${p.name}`"
              :disabled="!canAdjustStock"
              @click="products.adjustStock(p.id, +1)"
              class="w-6 h-6 rounded-full border flex items-center justify-center"
            >
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
          </div>

          <div class="flex gap-4">
            <button type="button" :aria-label="`View ${p.name}`" @click="openView(p)">
              <i class="fa-solid fa-eye" aria-hidden="true"></i>
            </button>
            <button
              v-if="isAdmin"
              type="button"
              :aria-label="`Edit ${p.name}`"
              @click="openEdit(p)"
            >
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </button>
            <button
              v-if="isAdmin"
              type="button"
              :aria-label="`Delete ${p.name}`"
              @click="openDelete(p)"
            >
              <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center pt-4 mb-25">
      <PaginationBar
        :page="products.query.page"
        :pageCount="products.pageCount"
        :total="products.total"
        @go="goToPage"
      />
    </div>

    <!-- Create/edit/view modal -->
    <ProductFormModal
      v-if="showEditModal"
      :mode="modalMode"
      :product="selectedProduct"
      @close="showEditModal = false"
      @saved="products.fetchList()"
    />

    <!-- Delete confirmation -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete product"
      :message="`Are you sure you want to delete '${productToDelete?.name}'?`"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
// Vue imports 
import { computed, onMounted, ref, watch } from 'vue'

import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { useAuthStore } from '@/stores/auth.store'

import { useDebounce } from '@/composables/useDebounce'

// UI components
import ProductsFilter from '@/features/products/components/ProductsFilter.vue'
import PaginationBar from '@/features/products/components/PaginationBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CategoryBadge from '@/components/ui/CategoryBadge.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import ProductFormModal from '@/features/products/components/ProductFormModal.vue'

// Stores
const products = useProductsStore()
const categories = useCategoriesStore()
const auth = useAuthStore()

// UI state
const showFilters = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedProduct = ref(null)
const productToDelete = ref(null)
const modalMode = ref('create') // create | edit | view

// Permission helpers
const isAdmin = computed(() => auth.user?.role === 'admin')
const canAdjustStock = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'staff')

// Debounced search triggers list fetch
const qRef = computed(() => products.query.q)
const qDebounced = useDebounce(qRef, 350)

// Watch debounced search query
watch(qDebounced, () => {
  products.setQuery({ page: 1 })
  products.fetchList()
})

// Apply-only filter panel
function onFiltersApplied(filters) {
  products.setQuery(filters)
  products.fetchList()
  showFilters.value = false
}

// Page navigation
function goToPage(page) {
  products.setQuery({ page })
  products.fetchList()
}

// Resolve category name for display
function categoryName(categoryId) {
  return categories.items.find((c) => c.id === categoryId)?.name || '—'
}

// Format price as SEK
function formatPrice(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  }).format(Number(value))
}

// Modal handlers
// Open create modal
function openCreate() {
  modalMode.value = 'create'
  selectedProduct.value = null
  showEditModal.value = true
}

// Open edit modal
function openEdit(product) {
  modalMode.value = 'edit'
  selectedProduct.value = product
  showEditModal.value = true
}

// Open view modal
function openView(product) {
  modalMode.value = 'view'
  selectedProduct.value = product
  showEditModal.value = true
}

// Open delete modal
function openDelete(product) {
  productToDelete.value = product
  showDeleteModal.value = true
}

// Confirm delete action
async function confirmDelete() {
  await products.deleteProduct(productToDelete.value.id)
  showDeleteModal.value = false
  productToDelete.value = null
}

// Initial data fetch
onMounted(async () => {
  if (categories.items.length === 0) {
    await categories.fetchAll()
  }
  await products.fetchList()
})
</script>
