<template>
  <div class="container mx-auto max-w-4xl px-10">
    <main class="my-10">
      <AppHeader v-if="user" />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
  ],
});

const user = useSupabaseUser();
</script>

<style>
body {
  font-family: "Inter", sans-serif;
  @apply bg-white dark:bg-gray-900;
}
</style>
