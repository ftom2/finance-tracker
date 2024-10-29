<template>
  <UCard v-if="!success">
    <template #header>
      <h2 class="text-lg font-semibold">Sign-in to Finance Tracker</h2>
    </template>

    <form>
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

      <UButton
        type="submit"
        variant="solid"
        color="black"
        @click.prevent="onSignIn"
      >
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

function onSignIn() {
  success.value = true;
}
</script>
