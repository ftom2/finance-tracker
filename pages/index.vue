<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>
  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      v-for="trend in trends"
      :key="trend.title"
      :amount="trend.amount"
      :last-amount="trend.lastAmount"
      :loading="isLoading"
      :title="trend.title"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <p class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </p>
    </div>
    <div>
      <NewTransactionModal
        v-model="isNewTransactionModalOpen"
        @saved="refresh"
      />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        size="xs"
        @click="isNewTransactionModalOpen = true"
      >
        Add
      </UButton>
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactions, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :transactions="transactions" :date="date" />
      <Transaction
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup lang="ts">
import { useTransactions } from "~/composables/useTransactions";
import { transactionViewOptions } from "~/constants";

const {
  isLoading,
  transactionsGroupedByDate,
  amounts,
  incomeCount,
  expenseCount,
  refresh,
} = useTransactions();

const selectedView = ref(transactionViewOptions[1]);
const isNewTransactionModalOpen = ref(false);

const trends = computed(() => {
  return [
    {
      title: "Income",
      amount: amounts.value?.incomeThisYear,
      lastAmount: amounts.value?.incomeLastYear,
      loading: false,
    },
    {
      title: "Expense",
      amount: amounts.value?.expenseThisYear,
      lastAmount: amounts.value?.expenseLastYear,
      loading: isLoading.value,
    },
    {
      title: "Investments",
      amount: amounts.value?.investmentsThisYear,
      lastAmount: amounts.value?.investmentsLastYear,
      loading: isLoading.value,
    },
    {
      title: "Savings",
      amount: amounts.value?.savingsThisYear,
      lastAmount: amounts.value?.savingsLastYear,
      loading: isLoading.value,
    },
  ];
});

// Initial fetch
await refresh();
</script>
