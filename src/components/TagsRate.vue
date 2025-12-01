<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()

const sortedTags = computed(() => {
  return Object.entries(profileStore.tagsRate)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50) // Show top 50 tags
})
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="text-xl font-bold mb-4 flex-shrink-0">Tags Rating</h2>
    <div v-if="sortedTags.length === 0" class="text-muted-foreground text-sm">
      No ratings yet. Start liking or disliking posts!
    </div>
    <div v-else class="flex flex-col gap-1 overflow-y-auto flex-1">
      <div
        v-for="[tag, rating] in sortedTags"
        :key="tag"
        class="flex justify-between items-center px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors flex-shrink-0"
      >
        <span class="text-sm truncate flex-1">{{ tag }}</span>
        <span
          class="text-sm font-medium ml-2"
          :class="{
            'text-green-500': rating > 0,
            'text-red-500': rating < 0,
            'text-muted-foreground': rating === 0
          }"
        >
          {{ rating > 0 ? '+' : '' }}{{ rating }}
        </span>
      </div>
    </div>
  </div>
</template>
