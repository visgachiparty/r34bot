<script setup lang="ts">
import { ref } from 'vue'
import { useProfilesStore } from '../stores/profile'

const profilesStore = useProfilesStore()
const newTag = ref('')

function addTag() {
  const tag = newTag.value.trim()
  if (tag) {
    profilesStore.addToBanList(tag)
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  profilesStore.removeFromBanList(tag)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="text-xl font-bold mb-4 flex-shrink-0">Ban List</h2>

    <!-- Add new tag form -->
    <div class="flex gap-2 mb-4 flex-shrink-0">
      <input
        v-model="newTag"
        @keyup.enter="addTag"
        type="text"
        placeholder="Add tag to ban..."
        class="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        @click="addTag"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Add
      </button>
    </div>

    <!-- Ban list -->
    <div v-if="!profilesStore.activeProfile || profilesStore.activeProfile.banList.length === 0" class="text-muted-foreground text-sm">
      No banned tags yet.
    </div>
    <div v-else class="flex flex-col gap-1 overflow-y-auto flex-1">
      <div
        v-for="tag in profilesStore.activeProfile.banList"
        :key="tag"
        class="flex justify-between items-center px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors flex-shrink-0 group"
      >
        <span class="text-sm truncate flex-1">{{ tag }}</span>
        <button
          @click="removeTag(tag)"
          class="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Remove tag"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
