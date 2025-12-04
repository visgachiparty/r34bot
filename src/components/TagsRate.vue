<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfilesStore } from '../stores/profile'

const profilesStore = useProfilesStore()

enum ViewMode {
  Top = 'top',
  Worst = 'worst',
}

const viewMode = ref<ViewMode>(ViewMode.Top)

const sortedTags = computed(() => {
  const activeProfile = profilesStore.activeProfile
  if (!activeProfile) return []

  const entries = Object.entries(activeProfile.tagsRate)

  if (viewMode.value === ViewMode.Top) {
    return entries.sort(([, a], [, b]) => b - a).slice(0, 50)
  } else {
    return entries.sort(([, a], [, b]) => a - b).slice(0, 50)
  }
})

const newTagName = ref('')
const newTagRate = ref(0)

const changeTagRate = () => {
  const trimmedTagName = newTagName.value.trim()
  if (trimmedTagName) {
    if (profilesStore.activeProfile) {
      profilesStore.activeProfile.tagsRate[trimmedTagName] =
        newTagRate.value > 0 ? Math.min(100, newTagRate.value) : Math.max(-100, newTagRate.value)
      newTagName.value = ''
      newTagRate.value = 0
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4 flex-shrink-0 gap-4">
      <h2 class="text-xl font-bold">Tags Rating</h2>
      <select
        v-model="viewMode"
        class="px-3 py-1.5 text-sm rounded-md border border-input bg-background hover:bg-secondary/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option :value="ViewMode.Top">Top 50</option>
        <option :value="ViewMode.Worst">Worst 50</option>
      </select>
    </div>
    <div class="flex flex-col items-center gap-2 mb-4">
      <input
        v-model="newTagName"
        type="text"
        placeholder="Tag name"
        class="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring flex-1"
      />
      <input
        v-model.number="newTagRate"
        type="number"
        placeholder="Rate"
        step="1"
        class="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        @click="changeTagRate"
        class="w-full px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        Change Rate
      </button>
    </div>
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
        <div class="flex items-center gap-2">
          <span
            class="text-sm font-medium"
            :class="{
              'text-green-500': rating > 0,
              'text-red-500': rating < 0,
              'text-muted-foreground': rating === 0,
            }"
          >
            {{ rating > 0 ? '+' : '' }}{{ rating }}
          </span>
          <button
            v-if="viewMode === ViewMode.Worst"
            @click="profilesStore.resetTagRating(tag)"
            class="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
