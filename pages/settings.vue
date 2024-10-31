<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: "Profile",
    avatar: {
      src: "https://avatars.githubusercontent.com/u/739984?v=4",
    },
    to: "/settings/profile",
  },
  {
    label: "Avatar",
    icon: "i-heroicons-home",
    to: "/settings/avatar",
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog-8-tooth",
    to: "/settings/config",
  },
];
</script>
