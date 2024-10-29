import { TransactionType } from "~/constants";
import type { ITransaction } from "~/utils/types";

export function useTransactions() {
  const supabase = useSupabaseClient<ITransaction>();
  const isLoading = ref(false);
  const transactions = ref<ITransaction[]>([]);

  async function fetchTransactions() {
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      transactions.value = data || [];
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

  const amounts = computed(() => {
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

    for (const date in transactionsGroupedByDate.value) {
      const year = new Date(date).getFullYear();
      for (const transaction of transactionsGroupedByDate.value[date]) {
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
  });

  async function refresh() {
    await fetchTransactions();
  }

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

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  return {
    transactions,
    isLoading,
    fetchTransactions,
    transactionsGroupedByDate,
    amounts,
    refresh,
    incomeCount,
    expenseCount,
  };
}
