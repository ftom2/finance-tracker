import { z } from "zod";
import { CATEGORIES, TransactionType } from "~/constants";

const baseSchema = z.object({
  amount: z.number().positive("Amount needs to be greater than 0"),
  created_at: z.string({ message: "Transaction date is required" }),
  description: z.string().optional(),
});

const typeSchema = z
  .nativeEnum(TransactionType, {
    errorMap: () => ({ message: "Please select a valid transaction type" }),
  })
  .describe("type");

const incomeSchema = z.object({
  type: z.literal(TransactionType.Income),
});

const expenseSchema = z.object({
  type: z.literal(TransactionType.Expense),
  category: z.enum(CATEGORIES),
});

const investmentSchema = z.object({
  type: z.literal(TransactionType.Investment),
});

const savingsSchema = z.object({
  type: z.literal(TransactionType.Savings),
});

export const transactionSchema = z
  .object({ type: typeSchema })
  .and(baseSchema)
  .and(
    z.discriminatedUnion("type", [
      incomeSchema,
      expenseSchema,
      investmentSchema,
      savingsSchema,
    ])
  );
