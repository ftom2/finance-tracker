import { DEFAULT_AVATAR } from "~/constants";

export function useUser() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const avatarLink = ref(DEFAULT_AVATAR);
  watch(
    () => user.value?.user_metadata?.avatar_url,
    (newValue) => {
      const { data } = supabase.storage.from("avatars").getPublicUrl(newValue);

      avatarLink.value = data.publicUrl ?? DEFAULT_AVATAR;
    },
    { immediate: true }
  );

  return { user, avatarLink };
}
