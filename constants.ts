export const transactionViewOptions = ["Yearly", "Monthly", "Daily"];

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Education",
  "Utilities",
  "Others",
] as const;

export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
  Savings = "Savings",
  Investment = "Investment",
}
export const TRANSACTION_TYPES: TransactionType[] = [
  TransactionType.Income,
  TransactionType.Expense,
  TransactionType.Savings,
  TransactionType.Investment,
];
