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
    <Trend :amount="3000" :last-amount="4000" :loading="false" title="Income" />
    <Trend
      :amount="5000"
      :last-amount="3000"
      :loading="false"
      title="Expense"
    />
    <Trend
      :amount="2000"
      :last-amount="3000"
      :loading="false"
      title="Investments"
    />
    <Trend
      :amount="4000"
      :last-amount="3000"
      :loading="false"
      title="Savings"
    />
  </section>

  <section>
    <Transaction
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </section>
</template>

<script setup lang="ts">
import { transactionViewOptions } from "~/constants";
import type { ITransaction } from "~/utils/types";
const selectedView = ref(transactionViewOptions[1]);
const transactions = ref<ITransaction[]>([]);

const supabase = useSupabaseClient<ITransaction[]>();

const { data, status } = useAsyncData("transactions", async () => {
  const { data, error } = await supabase.from("transactions").select("*");
  if (error) {
    return [];
  }
  return data;
});
console.log(status.value);
transactions.value = data.value || [];
</script>
