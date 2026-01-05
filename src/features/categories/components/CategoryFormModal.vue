<template>
    <!-- Overlay -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <!-- Modal box -->
      <div
        class="bg-white rounded-xl shadow-soft w-full max-w-md p-6"
      >
        <!-- Header -->
        <h2 class="text-2xl font-semibold mb-6">
          {{ isEdit ? 'Edit category' : 'Add category' }}
        </h2>
  
        <!-- Form -->
        <form class="space-y-5" @submit.prevent="onSubmit">
          <!-- Category name -->
          <div>
            <label class="block mb-1">Category name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border rounded-full"
            />
          </div>
  
          <!-- Description -->
          <div>
            <label class="block mb-1">Short description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 border rounded-xl"
            />
          </div>
  
          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <BaseButton type="submit">Save</BaseButton>
            <BaseButton type="button" variant="secondary" @click="$emit('close')">
              Cancel
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </template>  

<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories.store'
import BaseButton from '@/components/ui/BaseButton.vue'

// Props and emits control mode and edited categor
const props = defineProps({
  mode: String,
  category: Object,
})

const emit = defineEmits(['close', 'saved'])
const categories = useCategoriesStore()

// Derived edit mode
const isEdit = computed(() => props.mode === 'edit')

// Form state
const form = reactive({
  name: '',
  description: '',
})

// Lock scroll and populate form if editing
onMounted(() => {
  document.body.style.overflow = 'hidden'

  if (isEdit.value && props.category) {
    form.name = props.category.name
    form.description = props.category.description || ''
  }
})

// Unlock scroll on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Submit handler for create or update
async function onSubmit() {
  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
  }

  if (isEdit.value) {
    await categories.update(props.category.id, payload)
  } else {
    await categories.create(payload)
  }

  // Notify parent and close modal
  emit('saved')
  emit('close')
}
</script>
