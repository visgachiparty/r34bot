<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore, type ProfileSnapshot } from '../stores/profile'

const profileStore = useProfileStore()
const newProfileName = ref('')
const editingProfileId = ref<string | null>(null)
const editingProfileName = ref('')

const profiles = computed(() => profileStore.getAllProfiles())

function createProfile() {
  const name = newProfileName.value.trim()
  if (name) {
    profileStore.createNewProfile(name)
    newProfileName.value = ''
  }
}

function switchProfile(profile: ProfileSnapshot) {
  profileStore.loadProfile(profile)
}

function toggleProfileLock(event: Event) {
  event.stopPropagation() // Prevent triggering profile switch
  profileStore.toggleLock()
}

function deleteProfile(id: string) {
  if (confirm('Are you sure you want to delete this profile?')) {
    profileStore.deleteProfile(id)
  }
}

function startEditing(profile: ProfileSnapshot) {
  editingProfileId.value = profile.id
  editingProfileName.value = profile.name
}

function cancelEditing() {
  editingProfileId.value = null
  editingProfileName.value = ''
}

function saveProfileName() {
  const name = editingProfileName.value.trim()
  if (name && editingProfileId.value) {
    // Update the profile name in storage
    const profiles = profileStore.getAllProfiles()
    const profile = profiles.find((p) => p.id === editingProfileId.value)
    if (profile) {
      profile.name = name
      // If it's the current profile, update current name
      if (editingProfileId.value === profileStore.profileId) {
        profileStore.renameProfile(name)
      } else {
        // Just save to storage
        const allProfiles = profiles.map((p) =>
          p.id === editingProfileId.value ? { ...p, name } : p
        )
        localStorage.setItem('r34-profiles', JSON.stringify(allProfiles))
      }
    }
    cancelEditing()
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="text-xl font-bold mb-4 flex-shrink-0">Profiles</h2>

    <!-- Current Profile Info -->
    <div class="mb-4 p-3 bg-secondary/50 rounded-md flex-shrink-0">
      <div class="text-xs text-muted-foreground mb-1">Current Profile</div>
      <div class="flex items-center gap-2">
        <div class="font-medium flex-1">{{ profileStore.profileName }}</div>
        <button
          @click="toggleProfileLock($event)"
          :class="[
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0',
            profileStore.isLocked ? 'bg-primary' : 'bg-secondary'
          ]"
          :title="profileStore.isLocked ? 'Locked (ratings disabled)' : 'Unlocked (ratings enabled)'"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              profileStore.isLocked ? 'translate-x-5' : 'translate-x-0.5'
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
    <div v-if="profiles.length === 0" class="text-muted-foreground text-sm">
      No profiles yet.
    </div>
    <div v-else class="flex flex-col gap-2 overflow-y-auto flex-1">
      <div
        v-for="profile in profiles"
        :key="profile.id"
        @click="profile.id !== profileStore.profileId && switchProfile(profile)"
        :class="[
          'p-3 rounded-md transition-colors flex-shrink-0 border',
          profile.id === profileStore.profileId
            ? 'bg-primary/20 border-primary cursor-default'
            : 'bg-secondary/30 hover:bg-secondary/50 border-transparent cursor-pointer'
        ]"
      >
        <div v-if="editingProfileId === profile.id" class="flex gap-2">
          <input
            v-model="editingProfileName"
            @keyup.enter="saveProfileName"
            @keyup.escape="cancelEditing"
            type="text"
            class="flex-1 px-2 py-1 bg-background rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autofocus
          />
          <button
            @click="saveProfileName"
            class="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Save
          </button>
          <button
            @click="cancelEditing"
            class="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:opacity-90"
          >
            Cancel
          </button>
        </div>
        <div v-else class="flex justify-between items-center">
          <div class="flex-1">
            <div class="font-medium text-sm">{{ profile.name }}</div>
            <div class="text-xs text-muted-foreground mt-1">
              {{ Object.keys(profile.tagsRate).length }} tags rated, {{ profile.banList.length }}
              banned
            </div>
          </div>
          <div class="flex gap-1 ml-2">
            <button
              v-if="profile.id !== profileStore.profileId"
              @click="switchProfile(profile)"
              class="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
              title="Switch to this profile"
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
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button
              @click="startEditing(profile)"
              class="p-1 text-muted-foreground hover:bg-secondary rounded transition-colors"
              title="Rename profile"
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
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
            </button>
            <button
              @click="deleteProfile(profile.id)"
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
