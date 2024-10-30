export function useLogIn(redirectUrl = "/") {
  const user = useSupabaseUser();

  watch(
    user,
    (newUser) => {
      if (newUser) {
        return navigateTo(redirectUrl);
      }
    },
    { immediate: true }
  );

  return { user };
}
