<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UForm
        :state="state"
        :schema="schema"
        @submit="submit"
        ref="form"
        class="flex flex-col gap-4"
      >
        <UFormGroup label="Transaction type" name="type" :required="true">
          <USelect
            :options="TRANSACTION_TYPES"
            :disabled="isEditing"
            placeholder="Select a Type"
            v-model="state.type"
          />
        </UFormGroup>
        <UFormGroup label="Amount" required name="amount">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <UFormGroup label="Transaction date" required name="created_at">
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup
          v-if="state.type === TransactionType.Expense"
          label="Category"
          name="category"
          required
        >
          <USelect
            :options="Array.from(CATEGORIES)"
            placeholder="Select a Category"
            v-model="state.category"
          />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UInput placeholder="description" v-model="state.description" />
        </UFormGroup>
        <div class="flex gap-3 items-center">
          <UButton
            color="black"
            variant="solid"
            type="submit"
            :label="buttonLabel"
            :loading="isLoading"
          />
          <UButton
            color="gray"
            variant="solid"
            type="button"
            label="Cancel"
            size="md"
            @click="isOpen = false"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import {
  CATEGORIES,
  TABLE_NAMES,
  TRANSACTION_TYPES,
  TransactionType,
} from "~/constants";
import { transactionSchema } from "~/lib/schemas/transaction-schema";

const emit = defineEmits(["close", "saved", "closed"]);
const props = defineProps<{ editedTransaction: ITransaction | null }>();

const { showSuccess, showError } = useToastMessages();
const supabase = useSupabaseClient();
const isLoading = ref(false);
const isOpen = defineModel({ default: false });
const form = ref<null | HTMLFormElement>(null);
const isEditing = computed(() => !!props.editedTransaction);
const initialState = {
  type: "",
  amount: 0,
  created_at: "",
  description: "",
  category: "",
};
// when editing, there is a watcher that will update the state with the edited transaction
const state = ref({ ...initialState });
const schema = transactionSchema;

const buttonLabel = computed(() => {
  return isEditing.value ? "Update" : "Save";
});

const resetForm = () => {
  state.value = { ...initialState };
  form.value?.clear();
};

async function submit() {
  isLoading.value = true;

  const data = { ...state.value };
  try {
    const { error } = await supabase
      .from(TABLE_NAMES.transactions)
      // @ts-ignore
      .upsert({ ...data });

    if (error) {
      throw error;
    }
    showSuccess({
      description: isEditing.value
        ? "Transaction updated successfully"
        : "Transaction added successfully",
    });
    emit("saved");
    isOpen.value = false;
  } catch (error) {
    console.error(error);
    showError({
      title: isEditing.value
        ? "Failed to update transaction"
        : "Failed to add transaction",
      description: (error as Error).message,
    });
  } finally {
    isLoading.value = false;
  }
}

watch(isOpen, (newIsOpen) => {
  if (!newIsOpen) {
    resetForm();
    emit("closed");
  }
});

watch(
  () => state.value.type,
  (newType) => {
    if (newType !== TransactionType.Expense) {
      state.value.category = "";
    }
  }
);

watch(
  () => props.editedTransaction,
  (newTransaction) => {
    if (newTransaction) {
      state.value = {
        ...newTransaction,
        created_at: newTransaction.created_at.split("T")[0],
      };
    }
  }
);
</script>
