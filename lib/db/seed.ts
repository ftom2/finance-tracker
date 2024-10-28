import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { CATEGORIES, TransactionType } from "~/constants";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

enum TransactionTypeWithoutExpense {
  Income = "Income",
  Savings = "Savings",
  Investment = "Investment",
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

function generateTransaction() {
  // make sure that 85% of the time, the transaction type is an expense
  // since expenses are the most common type of transaction
  const factor = Math.random() > 0.85;
  let type = TransactionType.Expense;
  if (factor) {
    type = faker.helpers.enumValue(
      TransactionTypeWithoutExpense
    ) as unknown as TransactionType;
  }

  let amount: number;
  switch (type) {
    case TransactionType.Income:
      amount = faker.number.int({ min: 8000, max: 15000 });
      break;
    case TransactionType.Expense:
      amount = faker.number.int({ min: 100, max: 2000 });
      break;
    case TransactionType.Savings:
    case TransactionType.Investment:
      amount = faker.number.int({ min: 5000, max: 10000 });
      break;

    default:
      amount = 0;
  }

  const baseTransaction = {
    amount,
    description: faker.lorem.sentence(),
    created_at: faker.date.recent({ days: 700 }).toISOString(),
    type,
  };

  if (type === TransactionType.Expense) {
    return {
      ...baseTransaction,
      category: faker.helpers.arrayElement(CATEGORIES),
    };
  }

  return baseTransaction;
}

async function seed(count: number = 50) {
  // Delete existing transactions before seeding
  const { error: deleteError } = await supabase
    .from("transactions")
    .delete()
    .gte("id", 0);
  if (deleteError) {
    console.error("Error deleting existing data:", deleteError);
    return;
  }

  const transactions = Array.from({ length: count }, generateTransaction);

  const { error } = await supabase.from("transactions").insert(transactions);

  if (error) {
    console.error("Error seeding data:", error);
    return;
  }

  console.log(`Successfully seeded ${count} transactions`);
}

// Run the seed function
seed()
  .catch(console.error)
  .finally(() => process.exit(0));
