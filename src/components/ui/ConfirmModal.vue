<template>
      <!-- Confirmation dialog built on top of BaseModal -->
    <BaseModal @close="$emit('cancel')">
      <h2 class="text-xl font-bold mb-4">
        {{ title }}
      </h2>
  
    <!-- Confirmation message -->
      <p class="text-gray-700 mb-8">
        {{ message }}
      </p>

    <!-- Action buttons -->
      <div class="flex justify-between">
        <BaseButton @click="$emit('confirm')">
          Confirm
        </BaseButton>
  
        <BaseButton @click="$emit('cancel')">
          Cancel
        </BaseButton>
      </div>
    </BaseModal>
  </template>
  
  <script setup>
  import BaseModal from '@/components/ui/BaseModal.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  
  // Modal props for title and message
  defineProps({
    title: String,
    message: String,
  })
  </script>
  