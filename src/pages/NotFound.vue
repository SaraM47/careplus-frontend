<!-- Fallback page for unknown routes -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h1 class="text-xl font-semibold">404</h1>
      <p class="text-sm text-black-600 mt-2">The page does not exist.</p>

      <!-- navigation back to main app -->
      <RouterLink
        to="/app/products"
        class="inline-block mt-4 px-3 py-2 rounded bg-black-900 text-white"
      >
        To products
      </RouterLink>
    </div>
  </div>
</template>
