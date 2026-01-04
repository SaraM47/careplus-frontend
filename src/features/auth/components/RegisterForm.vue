<template>
    <form
      class="space-y-6"
      @submit.prevent="onSubmit"
      novalidate
      aria-labelledby="tab-signup"
    >
      <!-- Email -->
      <div>
        <label for="signup-email" class="block text-lg font-medium mb-2">
          Email
        </label>
  
        <input
          id="signup-email"
          v-model.trim="email"
          type="email"
          autocomplete="email"
          autofocus
          :disabled="auth.loading"
          :aria-disabled="auth.loading"
          class="w-full px-4 py-3 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          :aria-invalid="errors.email ? 'true' : 'false'"
          :aria-describedby="errors.email ? 'signup-email-error' : undefined"
          @blur="validateEmail"
        />
  
        <p v-if="errors.email" id="signup-email-error" class="text-red-600 text-sm mt-2" role="alert">
          {{ errors.email }}
        </p>
      </div>
  
      <!-- Password -->
      <div>
        <label for="signup-password" class="block text-lg font-medium mb-2">
          Password
        </label>
  
        <div class="relative">
          <input
            id="signup-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :disabled="auth.loading"
            :aria-disabled="auth.loading"
            class="w-full px-4 py-3 border border-black rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-black"
            :aria-invalid="errors.password ? 'true' : 'false'"
            :aria-describedby="errors.password ? 'signup-password-error' : undefined"
            @blur="validatePassword"
          />
  
          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
  
        <p v-if="errors.password" id="signup-password-error" class="text-red-600 text-sm mt-2" role="alert">
          {{ errors.password }}
        </p>
      </div>
  
      <!-- Confirm password -->
      <div>
        <label for="signup-password-confirm" class="block text-lg font-medium mb-2">
          Confirm password
        </label>
  
        <input
          id="signup-password-confirm"
          v-model="passwordConfirm"
          type="password"
          autocomplete="new-password"
          :disabled="auth.loading"
          :aria-disabled="auth.loading"
          class="w-full px-4 py-3 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          :aria-invalid="errors.passwordConfirm ? 'true' : 'false'"
          :aria-describedby="errors.passwordConfirm ? 'signup-password-confirm-error' : undefined"
          @blur="validatePasswordConfirm"
        />
  
        <p
          v-if="errors.passwordConfirm"
          id="signup-password-confirm-error"
          class="text-red-600 text-sm mt-2"
          role="alert"
        >
          {{ errors.passwordConfirm }}
        </p>
      </div>
  
      <!-- Backend error -->
      <p v-if="auth.error" class="text-red-600 text-sm" role="alert">
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
          {{ auth.loading ? 'Creating account…' : 'Sign up' }}
        </BaseButton>
      </div>
    </form>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import BaseButton from '@/components/ui/BaseButton.vue'
  
  // Form state 
  const email = ref('')
  const password = ref('')
  const passwordConfirm = ref('')
  const showPassword = ref(false)
  
  // Validation errors 
  const errors = reactive({
    email: '',
    password: '',
    passwordConfirm: '',
  })
  
  // Auth store and router
  const auth = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  
  // Validation functions
  function validateEmail() {
    errors.email = ''
    if (!email.value) return (errors.email = 'Email is required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errors.email = 'Enter a valid email'
    }
  }
  
  // Function to validate password
  function validatePassword() {
    errors.password = ''
    if (!password.value) return (errors.password = 'Password is required')
    if (password.value.length < 6) errors.password = 'Minimum 6 characters'
  }
  
  // Function to validate password confirmation
  function validatePasswordConfirm() {
    errors.passwordConfirm = ''
    if (!passwordConfirm.value) return (errors.passwordConfirm = 'Confirm your password')
    if (passwordConfirm.value !== password.value) {
      errors.passwordConfirm = 'Passwords do not match'
    }
  }
  
  // Function to validate all fields
  function validateAll() {
    validateEmail()
    validatePassword()
    validatePasswordConfirm()
    return !errors.email && !errors.password && !errors.passwordConfirm
  }
  
  // Form submission handler
  async function onSubmit() {
    auth.error = ''
    if (!validateAll()) return
  
    try {
      await auth.register(email.value, password.value)
      router.push(route.query.next || '/app/products')
    } catch {}
  }
  </script>
  