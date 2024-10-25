<template>
  <div class="container mx-auto max-w-4xl">
    <main class="my-10">
      <AppHeader />
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
      href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
    },
  ],
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
  @apply bg-white dark:bg-gray-900;
}
</style>
