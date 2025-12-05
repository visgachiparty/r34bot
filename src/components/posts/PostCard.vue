<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardFooter } from '@/src/components/ui/card'
import { useProfilesStore } from '@/src/stores/profiles'
import type { Post } from '@/src/types/post'
import { toast } from 'vue-sonner'

const props = defineProps<{
  post: Post
}>()

const profilesStore = useProfilesStore()
const showAllTags = ref(false)

const visibleTags = computed(() => {
  if (showAllTags.value || props.post.tags.length <= 10) {
    return props.post.tags
  }
  return props.post.tags.slice(0, 10)
})

const hasMoreTags = computed(() => props.post.tags.length > 10)
const remainingTagsCount = computed(() => props.post.tags.length - 10)

const isTagBanned = (tag: string) => {
  return profilesStore.activeProfile?.banList.includes(tag) ?? false
}

const getTagRating = (tag: string): number => {
  return profilesStore.activeProfile?.tagsRate[tag] ?? 0
}

const totalRating = computed(() => props.post.tags.reduce((sum, tag) => sum + getTagRating(tag), 0))

const isFavorite = computed(() => {
  return profilesStore.activeProfile?.favorites.includes(props.post.fileUrl) ?? false
})

const toggleFavorite = () => {
  profilesStore.toggleFavorite(props.post.fileUrl)
}

const toggleTagBan = (tag: string) => {
  if (isTagBanned(tag)) {
    profilesStore.removeFromBanList(tag)
  } else {
    profilesStore.addToBanList(tag)
  }
}

const copyTags = async () => {
  const tagsText = props.post.tags.join(' ')
  await navigator.clipboard.writeText(tagsText)
  toast.success('Tags copied to clipboard!')
}
</script>

<template>
  <Card class="w-full max-w-2xl mx-auto">
    <CardContent
      :class="[
        'p-4',
        {
          'max-h-[70vh] overflow-y-auto': post.tags.includes('comics'),
          'max-h-[120vh] overflow-y-auto': !post.tags.includes('comics'),
        },
      ]"
    >
      <img
        :src="post.fileUrl"
        :alt="`Post ${post.id}`"
        class="w-full h-auto rounded-lg"
        loading="lazy"
      />
    </CardContent>
    <CardFooter class="flex flex-col gap-3 p-4">
      <div class="flex flex-wrap gap-2 w-full">
        <button
          @click="toggleFavorite"
          class="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-md hover:bg-secondary/80 transition-colors"
          :class="{ 'text-yellow-500': isFavorite }"
        >
          {{ isFavorite ? '★' : '☆' }}
        </button>
        <div class="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-md">
          Total: {{ totalRating }}
        </div>
        <button
          v-for="tag in visibleTags"
          :key="tag"
          @click="toggleTagBan(tag)"
          class="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
          :class="{ 'bg-destructive/20 text-destructive': isTagBanned(tag) }"
        >
          <span v-if="isTagBanned(tag)" class="mr-1">−</span>{{ tag }}
          <span
            v-if="getTagRating(tag) !== 0"
            class="ml-1 font-semibold"
            :class="{
              'text-green-600': getTagRating(tag) > 0,
              'text-red-600': getTagRating(tag) < 0,
            }"
          >
            {{ getTagRating(tag) > 0 ? '+' : '' }}{{ getTagRating(tag) }}
          </span>
        </button>
        <button
          v-if="hasMoreTags"
          @click="showAllTags = !showAllTags"
          class="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 transition-colors"
        >
          {{ showAllTags ? 'Show less' : `+${remainingTagsCount} more` }}
        </button>
        <button
          @click="copyTags"
          class="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md hover:bg-secondary/80 transition-colors"
        >
          Copy Tags
        </button>
      </div>
    </CardFooter>
  </Card>
</template>
