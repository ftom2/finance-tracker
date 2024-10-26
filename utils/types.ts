export interface ITransaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  created_at: string;
  type: TransactionType;
}

export type TransactionType = "Income" | "Expense";
