<script setup lang="ts">
import { computed } from 'vue'
import { useProfilesStore } from '@/src/stores/profiles'
import ImageGallery from '@/src/components/ImageGallery.vue'

const profilesStore = useProfilesStore()

const favoriteImages = computed(() => {
  return profilesStore.activeProfile?.favorites || []
})

const removeFromFavorites = (fileUrl: string) => {
  profilesStore.removeFromFavorites(fileUrl)
}
</script>

<template>
  <ImageGallery
    :images="favoriteImages"
    title="Favorites"
    empty-message="No favorites yet"
    alt-text-prefix="Favorite image"
    :on-remove="removeFromFavorites"
  />
</template>
