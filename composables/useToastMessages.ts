type ToastMessage = { title?: string; description?: string };

export function useToastMessages() {
  const toast = useToast();

  function showSuccess({ title = "Success", description }: ToastMessage) {
    toast.add({
      title,
      description,
      timeout: 2000,
      color: "green",
      icon: "i-heroicons-check-circle",
    });
  }

  function showError({ title = "Error", description }: ToastMessage) {
    toast.add({
      title,
      description,
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
