import { computed } from "vue";

export function useCurrency(currency: string = "ILS") {
  const formatter = computed(() => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    });
  });

  function format(amount: number): string {
    return formatter.value.format(amount);
  }

  return {
    currency,
    format,
  };
}
