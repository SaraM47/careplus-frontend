<!-- Top navbar -->
<template>
  <header class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
    <div class="text-sm text-gray-600">
      Inventory
    </div>

    <!-- Logout button -->
    <button
      class="px-3 py-2 rounded bg-gray-900 text-white text-sm hover:opacity-90"
      @click="onLogout"
    >
      Logga ut
    </button>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

// Router and auth store instances
const router = useRouter();
const auth = useAuthStore();

// Log out user and redirect to login page
function onLogout() {
  auth.logout();
  router.push({ name: "login" });
}
</script>
