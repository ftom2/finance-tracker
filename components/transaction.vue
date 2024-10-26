<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-100"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon :name="icon" :class="color" />
        <div>{{ transaction.description }}</div>
      </div>
      <div v-if="transaction.category">
        <UBadge color="white">{{ transaction.category }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            trailing-icon="i-heroicons-ellipsis-horizontal"
            variant="ghost"
            color="white"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITransaction } from "~/utils/types";

const { transaction } = defineProps<{ transaction: ITransaction }>();

const { format } = useCurrency();

const currency = computed(() => format(transaction.amount));

const isExpense = computed(() => transaction.type === "Expense");

const icon = computed(() => {
  return isExpense.value
    ? "i-heroicons-arrow-down-left"
    : "i-heroicons-arrow-up-right";
});

const color = computed(() => {
  return isExpense.value ? "red" : "green";
});

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => console.log("Delete"),
    },
  ],
];
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
