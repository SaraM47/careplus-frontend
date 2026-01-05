<template>
  <BaseModal @close="$emit('close')">
    <!-- Title -->
    <h2 class="text-2xl font-bold mb-8">
      {{
        isView
          ? 'Product details'
          : isEdit
          ? 'Edit product'
          : 'Add new product'
      }}
    </h2>

    <form @submit.prevent="submit" class="grid grid-cols-2 gap-6">
      <!-- Product name -->
      <div>
        <label class="block mb-2 font-medium">Product name</label>
        <input
          v-model="form.name"
          :disabled="isView"
          class="w-full px-4 py-3 border border-black rounded-full text-sm disabled:bg-gray-100"
          @blur="validateField('name')"
        />
        <p v-if="errors.name" class="text-sm text-red-600 mt-2">
          {{ errors.name }}
        </p>
      </div>

      <!-- Image -->
      <div>
        <label class="block mb-2 font-medium">Product image</label>
        <!-- hidden file input triggered by button -->
        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          :disabled="isView"
          @change="onFileChange"
        />

        <button
          type="button"
          :disabled="isView"
          class="
            w-full px-4 py-3 rounded-full
            bg-gray-200
            flex items-center justify-center gap-2
            transition
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
          @click="fileInput?.click()"
        >
          <i class="fa-solid fa-upload"></i>
          {{ imageFile || existingImage ? 'Change image' : 'Select image' }}
        </button>

        <!-- Preview -->
        <div v-if="previewUrl || existingImage" class="mt-3">
          <div class="w-full h-32 rounded-xl overflow-hidden bg-gray-100">
            <img
              :src="previewUrl || existingImage"
              alt="Preview"
              class="w-full h-full object-cover"
            />
          </div>

          <button
            v-if="previewUrl && !isView"
            type="button"
            class="mt-2 text-sm underline"
            @click="clearFile"
          >
            Remove new image
          </button>
        </div>

        <p v-if="errors.image" class="text-sm text-red-600 mt-2">
          {{ errors.image }}
        </p>
      </div>

      <!-- Description -->
      <div class="col-span-2">
        <label class="block mb-2 font-medium">Short description</label>
        <textarea
          v-model="form.description"
          :disabled="isView"
          class="
            w-full px-4 py-3
            border border-black
            rounded-2xl
            text-sm
            min-h-24
            resize-none
            disabled:bg-gray-100
          "
        ></textarea>
      </div>

      <!-- Price -->
      <div>
        <label class="block mb-2 font-medium">Price</label>
        <input
          v-model.number="form.price"
          :disabled="isView"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-4 py-3 border border-black rounded-full text-sm disabled:bg-gray-100"
          @blur="validateField('price')"
        />
        <p v-if="errors.price" class="text-sm text-red-600 mt-2">
          {{ errors.price }}
        </p>
      </div>

      <!-- Stock -->
      <div>
        <label class="block mb-2 font-medium">Stock</label>
        <input
          v-model.number="form.stock"
          :disabled="isView"
          type="number"
          min="0"
          class="w-full px-4 py-3 border border-black rounded-full text-sm disabled:bg-gray-100"
          @blur="validateField('stock')"
        />
        <p v-if="errors.stock" class="text-sm text-red-600 mt-2">
          {{ errors.stock }}
        </p>
      </div>

      <!-- Category -->
      <div>
        <label class="block mb-2 font-medium">Category</label>
        <select
          v-model.number="form.categoryId"
          :disabled="isView"
          class="
            w-full px-4 py-3
            border border-black
            rounded-full
            text-sm bg-white
            disabled:bg-gray-100
          "
          @blur="validateField('categoryId')"
        >
          <option :value="0">Select</option>
          <option v-for="c in categories.items" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="errors.categoryId" class="text-sm text-red-600 mt-2">
          {{ errors.categoryId }}
        </p>
      </div>

      <!-- Form -->
      <div>
        <label class="block mb-2 font-medium">Form</label>
        <input
          v-model="form.form"
          :disabled="isView"
          placeholder="e.g. tablet"
          class="w-full px-4 py-3 border border-black rounded-full text-sm disabled:bg-gray-100"
        />
      </div>

      <!-- Actions -->
      <div class="col-span-2 flex justify-end gap-4 mt-10">
        <BaseButton v-if="!isView" type="submit" :disabled="submitting">
          {{ isEdit ? 'Save changes' : 'Save' }}
        </BaseButton>

        <BaseButton type="button" @click="$emit('close')">
          {{ isView ? 'Close' : 'Cancel' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { productsApi } from '@/api/products.api'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['close', 'saved'])

// Props to control mode and edited product
const props = defineProps({
  mode: { type: String, default: 'create' }, // create | edit | view
  product: { type: Object, default: null },
})

// Derived modes flags
const isEdit = computed(() => props.mode === 'edit')
const isView = computed(() => props.mode === 'view')

// Stores
const products = useProductsStore()
const categories = useCategoriesStore()

// UI state for the form
const submitting = ref(false)
const fileInput = ref(null)
const imageFile = ref(null)
const previewUrl = ref('')

// Existing image URL (for edit/view)
const existingImage = computed(() =>
  isEdit.value || isView.value ? props.product?.imagePath || '' : ''
)

// Form state
const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: 0,
  form: '',
})

// Validation errors
const errors = reactive({
  name: '',
  price: '',
  stock: '',
  categoryId: '',
  image: '',
})

// Hydrate form when editing or viewing
watch(
  () => props.product,
  (p) => {
    if ((isEdit.value || isView.value) && p) {
      form.name = p.name
      form.description = p.description || ''
      form.price = Number(p.price)
      form.stock = Number(p.stock)
      form.categoryId = Number(p.categoryId)
      form.form = p.form || ''
    }
  },
  { immediate: true }
)

// Validate and preview uploaded image
function onFileChange(e) {
  if (isView.value) return

  errors.image = ''
  const file = e.target.files?.[0]
  if (!file) return

  const okTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!okTypes.includes(file.type)) {
    errors.image = 'Endast JPG, PNG eller WEBP är tillåtet.'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errors.image = 'Max 5MB.'
    return
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

// Clear selected file and preview
function clearFile() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  imageFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Field validation for individual fields
function validateField(key) {
  errors[key] = ''

  if (key === 'name' && (!form.name || form.name.trim().length < 2))
    errors.name = 'At least 2 characters.'

  if (key === 'price' && Number(form.price) < 0)
    errors.price = 'Price must be 0 or greater.'

  if (key === 'stock' && Number(form.stock) < 0)
    errors.stock = 'Stock must be 0 or greater.'

  if (key === 'categoryId' && Number(form.categoryId) <= 0)
    errors.categoryId = 'Choose a category.'
}

// Full form validation
function validateAll() {
  validateField('name')
  validateField('price')
  validateField('stock')
  validateField('categoryId')
  return !errors.name && !errors.price && !errors.stock && !errors.categoryId && !errors.image
}

// Form submission for create or edit
async function submit() {
  if (isView.value) return
  if (!validateAll()) return

  submitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || '',
      price: Number(form.price),
      stock: Number(form.stock),
      form: form.form?.trim() || '',
      categoryId: Number(form.categoryId),
    }

    if (isEdit.value) {
      await products.updateOptimistic(props.product.id, payload)

      if (imageFile.value) {
        await productsApi.uploadImage(props.product.id, imageFile.value)
      }
    } else {
      await products.createWithImage(payload, imageFile.value)
    }

    emit('saved')
    emit('close')
  } finally {
    submitting.value = false
  }
}
</script>
