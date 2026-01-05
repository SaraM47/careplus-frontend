<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">List of categories</h1>
    </div>

    <!-- Loading -->
    <div
      v-if="categories.loading"
      class="bg-white rounded-xl shadow-soft p-6 text-xl flex items-center"
    >
      <i class="fa-solid fa-spinner fa-spin mr-2"></i>
      Loading categories...
    </div>

    <!-- Error -->
    <div
      v-else-if="categories.error"
      class="bg-white rounded-xl shadow-soft p-6 text-red-700"
      role="alert"
    >
      {{ categories.error }}
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Desktop table -->
      <div class="hidden md:block space-y-4">
        <!-- header -->
        <div class="grid grid-cols-4 gap-4 px-6 text-sm font-medium text-gray-600">
          <div>Category name</div>
          <div>Short description</div>
          <div>Product quantity</div>
          <div>Action</div>
        </div>

        <!-- rows -->
        <div
          v-for="c in categories.items"
          :key="c.id"
          class="grid grid-cols-4 gap-4 items-center bg-white px-6 py-4 shadow-(--shadow-row)"
        >
          <div class="font-medium">{{ c.name }}</div>
          <div class="text-sm text-gray-500">
            {{ c.description || '—' }}
          </div>
          <div class="font-medium">
            {{ c._count?.products ?? 0 }}
          </div>

          <div class="flex gap-3">
            <!-- Edit (admin only) -->
            <button v-if="isAdmin" @click="openEdit(c)" aria-label="Edit category">
              <i class="fa-solid fa-pen"></i>
            </button>

            <!-- Delete (admin only) -->
            <button v-if="isAdmin" @click="openDelete(c)" aria-label="Delete category">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden space-y-4">
        <div
          v-for="c in categories.items"
          :key="c.id"
          class="bg-white px-6 py-4 shadow-(--shadow-row)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2 class="font-medium text-lg">{{ c.name }}</h2>
              <p class="text-sm text-gray-500 mt-1">
                {{ c.description || '—' }}
              </p>
              <p class="mt-3 text-sm">
                Products:
                <span class="font-medium">
                  {{ c._count?.products ?? 0 }}
                </span>
              </p>
            </div>

            <div class="flex gap-3">
              <!-- Edit (admin only) -->
              <button v-if="isAdmin" @click="openEdit(c)" aria-label="Edit category">
                <i class="fa-solid fa-pen"></i>
              </button>

              <!-- Delete (admin only) -->
              <button v-if="isAdmin" @click="openDelete(c)" aria-label="Delete category">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add new (admin only) -->
    <div v-if="isAdmin" class="flex justify-end pt-6 mb-25">
      <BaseButton icon="fa-solid fa-plus" @click="openCreate"> Add new </BaseButton>
    </div>

    <!-- Category form modal for create / edit -->
    <CategoryFormModal
      v-if="showFormModal"
      :mode="formMode"
      :category="selectedCategory"
      @close="showFormModal = false"
      @saved="onSaved"
    />

    <!-- Delete confirm modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete category"
      :message="`Are you sure you want to delete '${categoryToDelete?.name}'?`"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCategoriesStore } from '@/stores/categories.store'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'

import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import CategoryFormModal from '@/features/categories/components/CategoryFormModal.vue'

// Stores
const categories = useCategoriesStore()
const auth = useAuthStore()
const toast = useToastStore()

// Permission helper
const isAdmin = computed(() => auth.user?.role === 'admin')

// Form modal state
const showFormModal = ref(false)
const formMode = ref('create') // 'create' | 'edit'
const selectedCategory = ref(null)

// Delete modal state
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)

// Open create modal
function openCreate() {
  formMode.value = 'create'
  selectedCategory.value = null
  showFormModal.value = true
}

// Open edit modal
function openEdit(category) {
  formMode.value = 'edit'
  selectedCategory.value = category
  showFormModal.value = true
}

// Open delete modal
function openDelete(category) {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

// Confirm delete action
async function confirmDelete() {
  try {
    await categories.delete(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null

    toast.success('Category deleted')
  } catch {
    toast.error('Could not delete category')
  }
}

// Refetch after create or edit
async function onSaved() {
  try {
    showFormModal.value = false
    await categories.fetchAll()

    toast.success(
      formMode.value === 'create'
        ? 'Category created'
        : 'Category updated'
    )
  } catch {
    toast.error('Something went wrong')
  }
}

// Fetch categories on mount
onMounted(() => {
  categories.fetchAll()
})
</script>
