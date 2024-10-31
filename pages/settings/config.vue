<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveSettings">
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    >
      <USelect
        v-model="state.transactionView"
        :options="transactionViewOptions"
      />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </UForm>
</template>

<script setup>
import { z } from "zod";
import { transactionViewOptions } from "~/constants";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { showSuccess, showError } = useToastMessages();
const isLoading = ref(false);
const state = ref({
  transactionView:
    user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1],
});
const schema = z.object({
  transactionView: z.enum(transactionViewOptions),
});

const saveSettings = async () => {
  isLoading.value = true;

  const data = {
    data: {
      transaction_view: state.value.transactionView,
    },
  };
  try {
    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;
    showSuccess({
      title: "Settings updated",
    });
  } catch (error) {
    showError({
      title: "Error updating settings",
      description: error.message,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
