<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/src/components/ui/card'
import { useProfilesStore } from '@/src/stores/profiles'

const profilesStore = useProfilesStore()

const favoriteImages = computed(() => {
  return profilesStore.activeProfile?.favorites || []
})

const removeFromFavorites = (fileUrl: string) => {
  profilesStore.removeFromFavorites(fileUrl)
}
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold mb-6">Favorites</h1>

    <div v-if="favoriteImages.length === 0" class="text-center py-12">
      <p class="text-muted-foreground text-lg">No favorites yet</p>
    </div>

    <div v-else class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      <Card
        v-for="imageUrl in favoriteImages"
        :key="imageUrl"
        class="relative overflow-hidden px-4 pb-4 pt-12 break-inside-avoid mb-6"
      >
        <CardContent class="p-0">
          <div class="w-full max-h-[80vh] overflow-y-auto">
            <img
              :src="imageUrl"
              alt="Favorite image"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <button
            @click="removeFromFavorites(imageUrl)"
            class="absolute top-2 right-2 px-3 py-1 bg-destructive text-black rounded-md hover:bg-destructive/90"
          >
            Remove
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
