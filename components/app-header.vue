<template>
  <header
    class="flex justify-between items-center my-10 border-b dark:border-gray-800 pb-3"
  >
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <div class="flex items-center gap-4">
      <UserDropdown :items />
      <ThemeSwitch />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSwitch from "./theme-switch.vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const items = computed(() => [
  [
    {
      label: user.value?.email || "",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      click: () => {
        navigateTo("/settings/profile");
      },
    },
  ],

  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",

      click: async () => {
        await supabase.auth.signOut();
        return navigateTo("/login");
      },
    },
  ],
]);
</script>
