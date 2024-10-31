<template>
  <UForm :state="state" :schema="schema" class="flex flex-col gap-4">
    <UFormGroup label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup
      label="Email"
      name="email"
      help="You will receive a confirmation email for both the old and the new email address"
    >
      <UInput v-model="state.email" type="email" />
    </UFormGroup>

    <UButton
      :loading="isLoading"
      class="self-start"
      type="submit"
      color="black"
      @click="saveProfile"
      >Save</UButton
    >
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { showError, showSuccess } = useToastMessages();
const isLoading = ref(false);

const state = ref({
  name: user.value?.user_metadata.full_name || "",
  email: user.value?.email || "",
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email(),
});

const saveProfile = async () => {
  isLoading.value = true;
  type Data = {
    full_name: string;
    email?: string;
  };

  const data: Data = {
    full_name: state.value.name,
  };
  if (state.value.email !== user.value?.email) {
    data.email = state.value.email;
  }

  try {
    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;
    showSuccess({ description: "Profile updated successfully" });
  } catch (error) {
    showError({ description: (error as Error).message });
  } finally {
    isLoading.value = false;
  }
};
</script>
