import type { TransactionType } from "~/constants";

export interface ITransaction {
  id?: number;
  amount: number;
  category: string;
  description: string;
  created_at: string;
  type: TransactionType;
}
