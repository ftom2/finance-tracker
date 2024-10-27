<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400 font-semibold pr-10"
  >
    <div class="flex items-center justify-between">{{ date }}</div>
    <div class="flex items-center justify-end">{{ format(sum) }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ITransaction } from "~/utils/types";

const { transactions, date } = defineProps<{
  transactions: ITransaction[];
  date: string;
}>();

const { format } = useCurrency();

const sum = computed(() => {
  return transactions.reduce((acc, transaction) => {
    return transaction.type === "Income"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);
});
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
