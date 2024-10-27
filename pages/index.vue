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
      :amount="incomeTotal"
      :last-amount="400"
      :loading="false"
      title="Income"
    />
    <Trend
      :amount="expenseTotal"
      :last-amount="500"
      :loading="isLoading"
      title="Expense"
    />
    <Trend
      :amount="2000"
      :last-amount="3000"
      :loading="isLoading"
      title="Investments"
    />
    <Trend
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
      title="Savings"
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
      <NewTransactionModal v-model="isNewTransactionModalOpen" />
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
        @deleted="refreshTransactions"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup lang="ts">
import { transactionViewOptions } from "~/constants";
import type { ITransaction } from "~/utils/types";
const selectedView = ref(transactionViewOptions[1]);
const transactions = ref<ITransaction[]>([]);
const isNewTransactionModalOpen = ref(false);

const supabase = useSupabaseClient<ITransaction[]>();
const isLoading = ref(false);

const income = computed(() => {
  return transactions.value.filter(
    (transaction) => transaction.type === "Income"
  );
});

const expense = computed(() => {
  return transactions.value.filter(
    (transaction) => transaction.type === "Expense"
  );
});

const incomeTotal = computed(() => {
  return income.value.reduce((acc, transaction) => acc + transaction.amount, 0);
});

const expenseTotal = computed(() => {
  return expense.value.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
});

const incomeCount = computed(() => {
  return income.value.length;
});

const expenseCount = computed(() => {
  return expense.value.length;
});

async function fetchTransactions(): Promise<ITransaction[]> {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transactions").select("*");
      if (error) {
        return [];
      }
      return data;
    });
    return data.value as ITransaction[];
  } finally {
    isLoading.value = false;
  }
}

const transactionsGroupedByDate = computed(() => {
  let grouped: Record<string, ITransaction[]> = {};
  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }
  return grouped;
});

async function refreshTransactions() {
  transactions.value = await fetchTransactions();
}
refreshTransactions();
</script>
