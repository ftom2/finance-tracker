<template>
  <div>
    <div class="font-bold" :class="color">{{ title }}</div>
    <div class="font-extrabold text-2xl text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>
        {{ formattedAmount }}
      </div>
    </div>
    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex gap-1 items-center text-sm">
        <UIcon :name="icon" class="size-6" :class="color" />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentage }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TrendProps {
  title: string;
  amount: number;
  lastAmount: number;
  loading: boolean;
  currency?: string;
}

const {
  title,
  amount,
  lastAmount,
  loading = true,
  currency = "ILS",
} = defineProps<TrendProps>();

const { format } = useCurrency(currency);

const formattedAmount = computed(() => format(amount));

const percentage = computed(() => {
  if (amount === 0 || lastAmount === 0) {
    return "∞";
  }
  const change = Math.abs((amount - lastAmount) / lastAmount);
  return new Intl.NumberFormat(undefined, {
    style: "percent",
  }).format(Math.ceil(change * 100) / 100);
});

const isTrendingUp = computed(() => amount > lastAmount);

const icon = computed(() => {
  return isTrendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down";
});

const color = computed(() => {
  return isTrendingUp.value ? "green" : "red";
});
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
