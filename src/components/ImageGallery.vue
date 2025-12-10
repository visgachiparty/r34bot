<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/src/components/ui/card'
import { Dialog, DialogContent } from '@/src/components/ui/dialog'
import MasonryWall from '@yeger/vue-masonry-wall'

type Props = {
  images: string[]
  title: string
  emptyMessage?: string
  removeButtonText?: string
  altTextPrefix?: string
  onRemove: (imageUrl: string) => void
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'No images yet',
  removeButtonText: 'Remove',
  altTextPrefix: 'Image',
})

const selectedImage = ref<string | null>(null)
const isDialogOpen = ref(false)

const openImage = (imageUrl: string) => {
  selectedImage.value = imageUrl
  isDialogOpen.value = true
}
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold mb-6">{{ title }}</h1>
    <div v-if="images.length === 0" class="text-center py-12">
      <p class="text-muted-foreground text-lg">{{ emptyMessage }}</p>
    </div>
    <MasonryWall :items="images" :column-width="300" :gap="24">
      <template #default="{ item: imageUrl }">
        <Card class="relative overflow-hidden px-4 pb-4 pt-12">
          <CardContent class="p-0">
            <div
              class="w-full max-h-[80vh] overflow-y-auto cursor-pointer"
              @click="openImage(imageUrl)"
            >
              <img
                :src="imageUrl"
                :alt="`${altTextPrefix} preview`"
                class="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <button
              @click="onRemove(imageUrl)"
              class="absolute top-2 right-2 px-3 py-1 bg-destructive text-black rounded-md hover:bg-destructive/90"
            >
              {{ removeButtonText }}
            </button>
          </CardContent>
        </Card>
      </template>
    </MasonryWall>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent
        class="max-w-none w-screen h-screen border-0 rounded-none p-0 bg-transparent backdrop-blur-3xl"
      >
        <div v-if="selectedImage" class="w-full h-full flex items-center justify-center p-6">
          <img :src="selectedImage" :alt="`${altTextPrefix} full size`" class="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
