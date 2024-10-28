<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UForm :state="state" class="flex flex-col gap-4">
        <UFormGroup label="Transaction type" name="type" :required="true">
          <USelect
            :options="TRANSACTION_TYPES"
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
        <UFormGroup label="Description" name="description">
          <UInput placeholder="description" v-model="state.description" />
        </UFormGroup>
        <UFormGroup label="Category" name="category" :required="true">
          <USelect
            :options="CATEGORIES"
            placeholder="Select a Category"
            v-model="state.category"
          />
        </UFormGroup>
        <UButton
          color="black"
          variant="solid"
          type="submit"
          label="Save"
          @click="isOpen = false"
          class="self-end"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { CATEGORIES, TRANSACTION_TYPES } from "~/constants";

const isOpen = defineModel({ default: false });
const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const emit = defineEmits(["close"]);
</script>
