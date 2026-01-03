<!-- Application shell wrapping all authenticated views -->
<template>
  <div class="min-h-screen bg-brand-bg text-brand-dark">
    <AppHeader /> 

    <!-- Main content area where routed views are rendered -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
</script>
