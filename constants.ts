export const transactionViewOptions = ["Yearly", "Monthly", "Daily"] as const;

export type TimePeriod = (typeof transactionViewOptions)[number];

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

export const DEFAULT_AVATAR =
  "https://avatars.githubusercontent.com/u/739984?v=4";
