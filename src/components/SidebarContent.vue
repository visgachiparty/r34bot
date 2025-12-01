<script setup lang="ts">
import { ref } from 'vue'
import TagsRate from './TagsRate.vue'
import BanList from './BanList.vue'
import Profiles from './Profiles.vue'

type Tab = 'tags' | 'ban' | 'profiles'

const activeTab = ref<Tab>('tags')
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Tabs -->
    <div class="flex gap-2 mb-4 flex-shrink-0">
      <button
        @click="activeTab = 'tags'"
        :class="[
          'flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
          activeTab === 'tags'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        ]"
      >
        Tags
      </button>
      <button
        @click="activeTab = 'ban'"
        :class="[
          'flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
          activeTab === 'ban'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        ]"
      >
        Ban
      </button>
      <button
        @click="activeTab = 'profiles'"
        :class="[
          'flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
          activeTab === 'profiles'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        ]"
      >
        Profiles
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-hidden">
      <TagsRate v-if="activeTab === 'tags'" />
      <BanList v-else-if="activeTab === 'ban'" />
      <Profiles v-else-if="activeTab === 'profiles'" />
    </div>
  </div>
</template>
