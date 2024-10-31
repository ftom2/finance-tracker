<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <ClientOnly>
        <USelectMenu
          :options="transactionViewOptions as any"
          v-model="selectedView"
        />
      </ClientOnly>
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
import { transactionViewOptions, type TimePeriod } from "~/constants";

const user = useSupabaseUser();
const selectedView = ref<TimePeriod>(
  user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1]
);
const isNewTransactionModalOpen = ref(false);
const { current, previous } = useSelectedTimePeriod(selectedView);
const {
  isLoading,
  transactionsGroupedByDate,
  incomeTotal,
  expenseTotal,
  incomeCount,
  expenseCount,
  savingsTotal,
  investmentsTotal,
  refresh,
} = useTransactions(current);
const {
  incomeTotal: prevIncomeTotal,
  expenseTotal: prevExpenseTotal,
  savingsTotal: prevSavingsTotal,
  investmentsTotal: prevInvestmentsTotal,
  refresh: refreshPrevious,
} = useTransactions(previous);

const trends = computed(() => {
  return [
    {
      title: "Income",
      amount: incomeTotal.value,
      lastAmount: prevIncomeTotal.value,
      loading: false,
    },
    {
      title: "Expense",
      amount: expenseTotal.value,
      lastAmount: prevExpenseTotal.value,
      loading: isLoading.value,
    },
    {
      title: "Investments",
      amount: investmentsTotal.value,
      lastAmount: prevInvestmentsTotal.value,
      loading: isLoading.value,
    },
    {
      title: "Savings",
      amount: savingsTotal.value,
      lastAmount: prevSavingsTotal.value,
      loading: isLoading.value,
    },
  ];
});

await Promise.all([refresh(), refreshPrevious()]);
</script>
