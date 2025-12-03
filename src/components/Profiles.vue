<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProfilesStore } from '../stores/profile'

const profilesStore = useProfilesStore()
const newProfileName = ref('')

const createProfile = () => {
  const name = newProfileName.value.trim()
  if (name) {
    profilesStore.createNewProfile(name)
    newProfileName.value = ''
  }
}

const toggleProfileLock = (event: Event) => {
  event.stopPropagation()
  const active = profilesStore.activeProfile
  if (active) {
    profilesStore.toggleLock(active.id)
  }
}

const deleteProfile = (id: string, e: Event) => {
  e.stopPropagation()
  if (confirm('Are you sure you want to delete this profile?')) {
    profilesStore.deleteProfile(id)
  }
}

const updateCurrentProfileName = (event: Event) => {
  const newName = (event.target as HTMLInputElement).value
  const name = newName.trim()
  const active = profilesStore.activeProfile
  if (name && active && name !== active.name) {
    profilesStore.renameProfile(active.id, name)
  }
}

const loadProfile = (id: string) => {
  if (id === profilesStore.activeProfileId) return
  profilesStore.loadProfile(id)
}

watch(
  () => profilesStore.activeProfile,
  () => {
    console.log('profilesStore.activeProfile', profilesStore.activeProfile)
  },
)
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="text-xl font-bold mb-4 flex-shrink-0">Profiles</h2>

    <!-- Current Profile Info -->
    <div
      v-if="profilesStore.activeProfile"
      class="mb-4 p-3 bg-secondary/50 rounded-md flex-shrink-0"
    >
      <div class="text-xs text-muted-foreground mb-1">Current Profile</div>
      <div class="flex items-center gap-2">
        <input
          :value="profilesStore.activeProfile.name"
          @change="updateCurrentProfileName($event)"
          type="text"
          class="font-medium flex-1 bg-transparent border border-transparent rounded px-1 -mx-1 focus:border-primary focus:outline-none"
        />
        <button
          @click="toggleProfileLock($event)"
          :class="[
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0',
            profilesStore.activeProfile.isLocked ? 'bg-primary' : 'bg-secondary',
          ]"
          :title="
            profilesStore.activeProfile.isLocked
              ? 'Locked (ratings disabled)'
              : 'Unlocked (ratings enabled)'
          "
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              profilesStore.activeProfile.isLocked ? 'translate-x-5' : 'translate-x-0.5',
            ]"
          />
        </button>
      </div>
    </div>

    <!-- Add new profile form -->
    <div class="flex gap-2 mb-4 flex-shrink-0">
      <input
        v-model="newProfileName"
        @keyup.enter="createProfile"
        type="text"
        placeholder="New profile name..."
        class="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        @click="createProfile"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Add
      </button>
    </div>

    <!-- Profiles list -->
    <div v-if="profilesStore.profiles.length === 0" class="text-muted-foreground text-sm">
      No profiles yet.
    </div>
    <div v-else class="flex flex-col gap-2 overflow-y-auto flex-1">
      <div
        v-for="profile in profilesStore.profiles"
        :key="profile.id"
        @click="loadProfile(profile.id)"
        :class="[
          'p-3 rounded-md transition-colors flex-shrink-0 border',
          profile.id === profilesStore.activeProfileId
            ? 'bg-primary/20 border-primary cursor-default'
            : 'bg-secondary/30 hover:bg-secondary/50 border-transparent cursor-pointer',
        ]"
      >
        <div class="flex justify-between items-center">
          <div class="flex-1">
            <div class="font-medium text-sm">{{ profile.name }}</div>
            <div class="text-xs text-muted-foreground mt-1">
              {{ Object.keys(profile.tagsRate).length }} tags rated, {{ profile.banList.length }}
              banned
            </div>
          </div>
          <div class="flex gap-1 ml-2">
            <button
              @click="deleteProfile(profile.id, $event)"
              class="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
              title="Delete profile"
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
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
