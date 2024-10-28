export function useToastMessages() {
  const toast = useToast();

  function showSuccess(message: string) {
    toast.add({
      title: message,
      timeout: 2000,
      color: "green",
      icon: "i-heroicons-check-circle",
    });
  }

  function showError(message: string) {
    toast.add({
      title: message,
      timeout: 3000,
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  }

  return {
    showSuccess,
    showError,
  };
}
