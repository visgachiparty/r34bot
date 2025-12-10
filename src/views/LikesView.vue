<script setup lang="ts">
import { computed } from 'vue'
import { useProfilesStore } from '@/src/stores/profiles'
import ImageGallery from '@/src/components/ImageGallery.vue'

const profilesStore = useProfilesStore()

const likedImages = computed(() => profilesStore.activeProfile?.liked || [])

const removeFromLiked = (fileUrl: string) => {
  profilesStore.removeFromLiked(fileUrl)
}
</script>

<template>
  <ImageGallery
    :images="likedImages"
    title="Likes"
    empty-message="No likes yet"
    alt-text-prefix="Liked image"
    :on-remove="removeFromLiked"
  />
</template>
