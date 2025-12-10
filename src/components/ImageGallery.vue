<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/src/components/ui/card'
import { Dialog, DialogContent } from '@/src/components/ui/dialog'
import MasonryWall from '@yeger/vue-masonry-wall'
import { Download, Trash2 } from 'lucide-vue-next'

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
const isVertical = ref(false)

const openImage = (imageUrl: string) => {
  selectedImage.value = imageUrl
  isDialogOpen.value = true
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  isVertical.value = img.naturalHeight > img.naturalWidth
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
        <Card class="overflow-hidden p-0">
          <CardContent class="p-4">
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
            <div class="flex justify-end mt-4">
              <button
                @click="onRemove(imageUrl)"
                class="p-2 bg-destructive text-black rounded-md hover:bg-destructive/90"
                :title="removeButtonText"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </CardContent>
        </Card>
      </template>
    </MasonryWall>
    <Dialog v-model:open="isDialogOpen">
      <DialogContent
        show-overlay-close-button
        :show-close-button="false"
        :class="[
          'border-0 rounded-none p-0 bg-transparent',
          isVertical ? 'max-h-[80vh]' : 'min-w-[90vw] max-w-[90vw] lg:min-w-[60vw] lg:max-w-[60vw]',
        ]"
      >
        <div v-if="selectedImage" class="flex items-center justify-center p-0">
          <img
            :src="selectedImage"
            :alt="`${altTextPrefix} full size`"
            class="object-contain h-[80vh]"
            crossorigin="anonymous"
            @load="handleImageLoad"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
