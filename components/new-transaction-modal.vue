<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <div>Hello</div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel({ default: false });

const emit = defineEmits(["close"]);
</script>
