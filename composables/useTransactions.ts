import { TransactionType } from "~/constants";
import type { ITransaction } from "~/utils/types";

export function useTransactions(
  period: ComputedRef<{
    from: Date;
    to: Date;
  }>
) {
  const supabase = useSupabaseClient<ITransaction>();
  const isLoading = ref(false);
  const transactions = ref<ITransaction[]>([]);

  async function fetchTransactions() {
    isLoading.value = true;
    try {
      const key = `transactions-${period.value.from.toDateString()}- ${period.value.to.toDateString()}`;
      const { data, error } = await useAsyncData(key, async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .gte("created_at", period.value.from.toISOString())
          .lte("created_at", period.value.to.toISOString())
          .order("created_at", { ascending: false });
        if (error) return [];
        return data;
      });

      transactions.value = (data.value as unknown as ITransaction[]) || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      transactions.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  const transactionsGroupedByDate = computed(() => {
    const grouped: Record<string, ITransaction[]> = {};
    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    }
    return grouped;
  });

  async function refresh() {
    await fetchTransactions();
  }

  watch(period, async () => await refresh());
  const income = computed(() => {
    return transactions.value.filter(
      (transaction) => transaction.type === TransactionType.Income
    );
  });

  const expense = computed(() => {
    return transactions.value.filter(
      (transaction) => transaction.type === TransactionType.Expense
    );
  });

  const savings = computed(() => {
    return transactions.value.filter(
      (transaction) => transaction.type === TransactionType.Savings
    );
  });

  const investments = computed(() => {
    return transactions.value.filter(
      (transaction) => transaction.type === TransactionType.Investment
    );
  });

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  const incomeTotal = computed(() => {
    return income.value.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  });

  const expenseTotal = computed(() => {
    return expense.value.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  });

  const savingsTotal = computed(() => {
    return savings.value.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  });

  const investmentsTotal = computed(() => {
    return investments.value.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  });
  return {
    transactions,
    isLoading,
    transactionsGroupedByDate,
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    savingsTotal,
    investmentsTotal,
    fetchTransactions,
    refresh,
  };
}
