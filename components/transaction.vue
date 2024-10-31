<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-100"
  >
    <div class="flex items-center justify-between gap-4 col-span-2">
      <div class="flex items-center gap-2">
        <UIcon :name="icon" :class="color" />
        <div class="flex flex-col gap-2 items-start">
          <UBadge variant="soft">{{ transaction.type }}</UBadge>
          <p>{{ transaction.description }}</p>
        </div>
      </div>
      <div v-if="transaction.category">
        <UBadge color="white">{{ transaction.category }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            :loading="isLoading"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            variant="ghost"
            color="white"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITransaction } from "~/utils/types";

const { showSuccess, showError } = useToastMessages();
const supabase = useSupabaseClient();

const { transaction } = defineProps<{ transaction: ITransaction }>();

const { format } = useCurrency();

const currency = computed(() => format(transaction.amount));

const isIncome = computed(() => transaction.type === "Income");

const isLoading = ref(false);

const icon = computed(() => {
  return isIncome.value
    ? "i-heroicons-arrow-up-right"
    : "i-heroicons-arrow-down-left";
});

const color = computed(() => {
  return isIncome.value ? "green" : "red";
});

const emit = defineEmits(["deleted"]);

async function deleteTransaction() {
  try {
    isLoading.value = true;
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transaction.id);

    if (error) {
      throw new Error();
    }
    showSuccess({
      description: "Transaction deleted",
    });
    emit("deleted");
  } catch (error) {
    showError({
      description: "Error deleting transaction",
    });
    console.error("Error deleting transaction:", error);
  } finally {
    isLoading.value = false;
  }
}

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
