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
      :amount="amounts?.incomeThisYear"
      :last-amount="amounts?.incomeLastYear"
      :loading="false"
      title="Income"
    />
    <Trend
      :amount="amounts?.expenseThisYear"
      :last-amount="amounts?.expenseLastYear"
      :loading="isLoading"
      title="Expense"
    />
    <Trend
      :amount="amounts?.investmentsThisYear"
      :last-amount="amounts?.investmentsLastYear"
      :loading="isLoading"
      title="Investments"
    />
    <Trend
      :amount="amounts?.savingsThisYear"
      :last-amount="amounts?.savingsLastYear"
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
      <NewTransactionModal
        v-model="isNewTransactionModalOpen"
        @saved="refreshTransactions"
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
        @deleted="refreshTransactions"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup lang="ts">
import { TransactionType, transactionViewOptions } from "~/constants";
import type { ITransaction } from "~/utils/types";
const amounts = ref();
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
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
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

/**
 * get the amounts for each transaction type
 * based on this year and last year
 */
function getAmounts(transactionsGroupedByDate: Record<string, ITransaction[]>) {
  let incomeThisYear = 0;
  let incomeLastYear = 0;
  let expenseThisYear = 0;
  let expenseLastYear = 0;
  let savingsThisYear = 0;
  let savingsLastYear = 0;
  let investmentsThisYear = 0;
  let investmentsLastYear = 0;
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  for (const date in transactionsGroupedByDate) {
    const year = new Date(date).getFullYear();
    for (const transaction of transactionsGroupedByDate[date]) {
      if (transaction.type === TransactionType.Income) {
        if (year === currentYear) {
          incomeThisYear += transaction.amount;
        } else if (year === lastYear) {
          incomeLastYear += transaction.amount;
        }
      } else if (transaction.type === TransactionType.Expense) {
        if (year === currentYear) {
          expenseThisYear += transaction.amount;
        } else if (year === lastYear) {
          expenseLastYear += transaction.amount;
        }
      } else if (transaction.type === TransactionType.Savings) {
        if (year === currentYear) {
          savingsThisYear += transaction.amount;
        } else if (year === lastYear) {
          savingsLastYear += transaction.amount;
        }
      } else if (transaction.type === TransactionType.Investment) {
        if (year === currentYear) {
          investmentsThisYear += transaction.amount;
        } else if (year === lastYear) {
          investmentsLastYear += transaction.amount;
        }
      }
    }
  }
  return {
    incomeThisYear,
    incomeLastYear,
    expenseThisYear,
    expenseLastYear,
    savingsThisYear,
    savingsLastYear,
    investmentsThisYear,
    investmentsLastYear,
  };
}

async function refreshTransactions() {
  transactions.value = await fetchTransactions();
  amounts.value = getAmounts(transactionsGroupedByDate.value);
}
refreshTransactions();
</script>
