<script setup lang="ts">
import { ref } from 'vue'
import TagsRate from './TagsRate.vue'
import BanList from './BanList.vue'
import Profiles from './Profiles.vue'

enum Tab {
  Tags = 'tags',
  Ban = 'ban',
  Profiles = 'profiles',
}

const activeTab = ref<Tab>(Tab.Tags)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex gap-2 mb-4 flex-shrink-0">
      <button
        @click="activeTab = Tab.Tags"
        :class="[
          'flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
          activeTab === Tab.Tags
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
      >
        Tags
      </button>
      <button
        @click="activeTab = Tab.Ban"
        :class="[
          'flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
          activeTab === Tab.Ban
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
      >
        Ban
      </button>
      <button
        @click="activeTab = Tab.Profiles"
        :class="[
          'flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
          activeTab === Tab.Profiles
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
      >
        Profiles
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <TagsRate v-if="activeTab === Tab.Tags" />
      <BanList v-else-if="activeTab === Tab.Ban" />
      <Profiles v-else-if="activeTab === Tab.Profiles" />
    </div>
  </div>
</template>
