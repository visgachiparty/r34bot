<script setup lang="ts">
import { useLineStore } from '../stores/line'
import { useProfilesStore } from '../stores/profiles'

const lineStore = useLineStore()
const profilesStore = useProfilesStore()

const handleSearch = () => {
  profilesStore.addToSearchHistory(lineStore.searchTags)
  lineStore.reset()
}

const handleClear = () => {
  lineStore.searchTags = ''
  lineStore.reset()
}

const handleHistoryClick = (query: string) => {
  lineStore.searchTags = query
  handleSearch()
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col gap-4">
      <div class="mb-4 shrink-0 flex flex-col gap-4">
        <h2 class="text-xl font-bold">Search Tags</h2>
        <textarea
          v-model="lineStore.searchTags"
          placeholder="Enter search tags separated by spaces..."
          class="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          rows="3"
        ></textarea>
        <button
          @click="handleSearch"
          class="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
        <button
          @click="handleClear"
          class="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Clear
        </button>
      </div>

      <div
        v-if="profilesStore.activeProfile?.searchHistory.length ?? 0 > 0"
        class="flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Search History</h3>
          <button
            @click="profilesStore.clearSearchHistory"
            class="px-3 py-1 bg-destructive text-black rounded-md text-xs font-medium hover:bg-destructive/90 transition-colors"
          >
            Clear All
          </button>
        </div>
        <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
          <div
            v-for="(query, index) in profilesStore.activeProfile?.searchHistory"
            :key="index"
            class="flex items-center justify-between gap-2 px-3 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors group"
          >
            <button
              @click="handleHistoryClick(query)"
              class="flex-1 text-left text-sm text-secondary-foreground truncate"
              :title="query"
            >
              {{ query }}
            </button>
            <button
              @click="profilesStore.deleteSearchHistoryItem(index)"
              class="shrink-0 px-2 py-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
