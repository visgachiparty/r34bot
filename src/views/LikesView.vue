<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/src/components/ui/card'
import { useProfilesStore } from '@/src/stores/profiles'
import MasonryWall from '@yeger/vue-masonry-wall'

const profilesStore = useProfilesStore()

const likedImages = computed(() => profilesStore.activeProfile?.liked || [])

const removeFromLiked = (fileUrl: string) => {
  profilesStore.removeFromLiked(fileUrl)
}
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold mb-6">Likes</h1>
    <div v-if="likedImages.length === 0" class="text-center py-12">
      <p class="text-muted-foreground text-lg">No likes yet</p>
    </div>
    <MasonryWall :items="likedImages" :column-width="300" :gap="24">
      <template #default="{ item: imageUrl }">
        <Card class="relative overflow-hidden px-4 pb-4 pt-12">
          <CardContent class="p-0">
            <div class="w-full max-h-[80vh] overflow-y-auto">
              <img
                :src="imageUrl"
                alt="Liked image"
                class="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <button
              @click="removeFromLiked(imageUrl)"
              class="absolute top-2 right-2 px-3 py-1 bg-destructive text-black rounded-md hover:bg-destructive/90"
            >
              Remove
            </button>
          </CardContent>
        </Card>
      </template>
    </MasonryWall>
  </div>
</template>
