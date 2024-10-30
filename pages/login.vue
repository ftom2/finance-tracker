<template>
  <UCard v-if="!success">
    <template #header>
      <h2 class="text-lg font-semibold">Sign-in to Finance Tracker</h2>
    </template>

    <form @submit.prevent="onSignIn">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        required
        help="You will receive an email with a confirmation link"
      >
        <UInput
          type="email"
          placeholder="example@gmail.com"
          v-model="email"
          required
        />
      </UFormGroup>

      <UButton type="submit" variant="solid" color="black" :loading="isLoading">
        Sign in
      </UButton>
    </form>
  </UCard>

  <UCard v-else>
    <template #header>
      <h2 class="text-lg font-semibold text-center">Check your email</h2>
    </template>

    <div class="flex flex-col items-center gap-4">
      <p class="text-center max-w-md">
        We have sent you an email with a confirmation link. Please check your
        inbox and click on the link to sign in.
      </p>
      <p>
        <span class="font-bold">Important</span>: The link will expire in 5
        minutes
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const email = ref("");
const success = ref(false);
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { showError } = useToastMessages();

async function onSignIn() {
  isLoading.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: "http://localhost:3000",
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log({ data });
    success.value = true;
  } catch (error) {
    showError((error as Error).message);
  } finally {
    isLoading.value = false;
  }
}
</script>
