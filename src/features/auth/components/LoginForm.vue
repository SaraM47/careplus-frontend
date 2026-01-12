<template>
  <form class="space-y-6" @submit.prevent="onSubmit" novalidate aria-labelledby="tab-login">
    <!-- Email -->
    <div>
      <label for="login-email" class="block text-lg font-medium mb-2"> Email </label>

      <input
        id="login-email"
        v-model.trim="email"
        type="email"
        autocomplete="email"
        autofocus
        :disabled="auth.loading"
        :aria-disabled="auth.loading"
        class="w-full px-4 py-3 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
        :aria-invalid="errors.email ? 'true' : 'false'"
        :aria-describedby="errors.email ? 'login-email-error' : undefined"
        @blur="validateEmail"
      />

      <p v-if="errors.email" id="login-email-error" class="text-red-600 text-sm mt-2" role="alert">
        {{ errors.email }}
      </p>
    </div>

    <!-- Password -->
    <div>
      <label for="login-password" class="block text-lg font-medium mb-2"> Password </label>

      <div class="relative">
        <input
          id="login-password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          :disabled="auth.loading"
          :aria-disabled="auth.loading"
          class="w-full px-4 py-3 border border-black rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-black"
          :aria-invalid="errors.password ? 'true' : 'false'"
          :aria-describedby="
            errors.password ? 'login-password-error' : auth.error ? 'login-error' : undefined
          "
          @blur="validatePassword"
        />

        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-black"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
        </button>
      </div>

      <p
        v-if="errors.password"
        id="login-password-error"
        class="text-red-600 text-sm mt-2"
        role="alert"
      >
        {{ errors.password }}
      </p>
    </div>

    <!-- Backend cold start info -->
    <p v-if="auth.startingBackend" class="text-gray-600 text-sm" role="status">
      Starting server, may take up to 1 minute...
    </p>

    <!-- Backend error -->
    <p v-if="auth.error" id="login-error" class="text-red-600 text-sm" role="alert">
      {{ auth.error }}
    </p>

    <!-- Submit -->
    <div class="flex justify-center">
      <BaseButton
        type="submit"
        class="w-40 justify-center text-center"
        :disabled="auth.loading"
        aria-disabled="auth.loading"
      >
        {{ auth.loading ? 'Logging in…' : 'Log in' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { watch } from 'vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import BaseButton from '@/components/ui/BaseButton.vue'

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Clear auth error on input change
watch(email, () => {
  auth.error = ''
})

watch(password, () => {
  auth.error = ''
})

// Validation errors
const errors = reactive({
  email: '',
  password: '',
})

// Auth store and router instances
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// Validation functions
function validateEmail() {
  errors.email = ''
  if (!email.value) {
    errors.email = 'Email is required'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Enter a valid email'
  }
}

// Password validation
function validatePassword() {
  errors.password = ''
  if (!password.value) {
    errors.password = 'Password is required'
  }
}

// Validate all fields
function validateAll() {
  validateEmail()
  validatePassword()
  return !errors.email && !errors.password
}

// Form submission handler
async function onSubmit() {
  auth.error = ''
  if (!validateAll()) return

  // Attempt login
  try {
    await auth.login(email.value, password.value)
    router.push(route.query.next || '/app/products')
  } catch {}
}
</script>
