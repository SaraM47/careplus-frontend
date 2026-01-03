<template>
  <!-- Desktop header -->
  <header
    class="hidden md:block bg-brand-bg border-b border-gray-200 bg-white bg-opacity-75 backdrop-blur-sm shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <img src="@/assets/logo.svg" alt="CarePlus logo" class="h-10 w-10" />
        <span
          class="text-3xl tracking-wide"
          style="font-family: var(--font-logo)"
        >
          CarePlus
        </span>
      </div>

      <!-- Desktop navigation -->
      <nav class="flex items-center gap-3">
        <NavButton to="/app/products" icon="fa-solid fa-boxes-stacked">
          Products
        </NavButton>

        <NavButton to="/app/categories" icon="fa-solid fa-tags">
          Category
        </NavButton>

        <NavButton :onClick="logout" icon="fa-solid fa-right-from-bracket">
          Log out
        </NavButton>
      </nav>
    </div>
  </header>

  <!-- Mobile top header -->
<header class="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
  <div class="flex items-center justify-center py-3 backdrop-blur-sm shadow-sm">
    <img src="@/assets/logo.svg" alt="CarePlus logo" class="h-7 w-7" />
    <span
          class="text-2xl tracking-wide"
          style="font-family: var(--font-logo)"
        >
          CarePlus
        </span>
  </div>
</header>

  <!-- Mobile bottom navigation bar -->
  <nav
  class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white"
>
  <div
    class="grid grid-cols-3 h-24 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
  >
    <NavButton
      to="/app/products"
      icon="fa-solid fa-boxes-stacked"
      mobile
    >
      Products
    </NavButton>

    <NavButton
      to="/app/categories"
      icon="fa-solid fa-tags"
      mobile
    >
      Category
    </NavButton>

    <NavButton
      :onClick="logout"
      icon="fa-solid fa-right-from-bracket"
      mobile
    >
      Log out
    </NavButton>
  </div>
</nav>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import NavButton from '@/components/navigation/NavButton.vue'

// Access authentication store and router instance
const auth = useAuthStore()
const router = useRouter()

// Logout function to log the user out and redirect to login page
function logout() {
  auth.logout()
  router.push('/login')
}
</script>
