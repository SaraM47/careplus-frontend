<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Logo -->
    <header class="p-6">
      <div class="flex items-center gap-2">
        <img
          src="@/assets/logo.svg"
          alt="CarePlus logo"
          class="h-10 w-10"
        />
        <span
          class="text-2xl"
          style="font-family: var(--font-logo)"
        >
          CarePlus
        </span>
      </div>
    </header>

    <!-- Auth container -->
    <main class="flex flex-1 items-center justify-center">
      <section class="w-full max-w-md px-4">

        <h1 class="sr-only">Authentication</h1>
      <!-- Login / signup tabs -->
        <div
          class="flex justify-center gap-16 mb-10"
          role="tablist"
          aria-label="Authentication"
        >
          <button
            id="tab-login"
            role="tab"
            type="button"
            :aria-selected="activeTab === 'login'"
            :tabindex="activeTab === 'login' ? 0 : -1"
            :class="tabClass('login')"
            @click="activeTab = 'login'"
          >
            Log in
          </button>

          <button
            id="tab-signup"
            role="tab"
            type="button"
            :aria-selected="activeTab === 'signup'"
            :tabindex="activeTab === 'signup' ? 0 : -1"
            :class="tabClass('signup')"
            @click="activeTab = 'signup'"
          >
            Sign up
          </button>
        </div>

        <!-- Active form panel -->
        <div
          role="tabpanel"
          :aria-labelledby="activeTab === 'login' ? 'tab-login' : 'tab-signup'"
        >
          <LoginForm v-if="activeTab === 'login'" />
          <RegisterForm v-else />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/features/auth/components/LoginForm.vue'
import RegisterForm from '@/features/auth/components/RegisterForm.vue'

// Currently active auth tab
const activeTab = ref('login')

// Returns the classes for a tab button based on whether it's active
function tabClass(tab) {
  return [
    'text-2xl font-medium pb-1 focus:outline-none',
    activeTab.value === tab
      ? 'border-b-2 border-black'
      : 'text-gray-400 hover:text-black'
  ]
}
</script>
