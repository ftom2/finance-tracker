<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar :src="avatarLink" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="isUploading"
      :disabled="isUploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const { user, avatarLink } = useUser();

// We need to get the actual avatar URL
const { showSuccess, showError } = useToastMessages();

const isUploading = ref(false);
const fileInput = ref();

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0];

  if (!file) {
    showError({
      title: "Please choose an image to upload",
    });
    return;
  }

  const oldAvatarUrl = user.value.user_metadata?.avatar_url;
  // get the file extension from the file name
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  try {
    isUploading.value = true;
    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value.user_metadata?.avatar_url;

    // 2. Upload the image to avatars bucket
    const { data: uploadData, error } = await supabase.storage
      .from("avatars")
      .upload(`${fileName}`, file);

    if (error) throw error;

    // 3. Update the user metadata with the avatar URL
    const data = {
      data: {
        avatar_url: fileName,
      },
    };
    const { error: updateError } = await supabase.auth.updateUser(data);

    if (updateError) {
      showError({
        title: "Error updating avatar URL",
        description: updateError.message,
      });
    }
    // 4. (OPTIONALLY) remove the old avatar file
    if (oldAvatarUrl) {
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([oldAvatarUrl]);

      if (deleteError) {
        throw error;
      }
    }
    // 5. Reset the file input

    showSuccess({
      title: "Avatar uploaded",
    });
  } catch (error) {
    showError({
      title: "Error uploading avatar",
      description: error.message,
    });
  } finally {
    isUploading.value = false;
  }
};
</script>
