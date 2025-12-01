import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface ProfileSnapshot {
  id: string
  name: string
  banList: string[]
  tagsRate: Record<string, number>
  isActive: boolean
  isLocked: boolean
}

const STORAGE_KEY = 'r34-profiles'

function generateId(): string {
  return crypto.randomUUID()
}

function loadProfiles(): ProfileSnapshot[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveProfiles(profiles: ProfileSnapshot[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export const useProfileStore = defineStore('profile', () => {
  const profileId = ref<string>(generateId())
  const profileName = ref<string>('Default')
  const banList = ref<string[]>([])
  const tagsRate = ref<Record<string, number>>({})
  const isLocked = ref<boolean>(false)

  // Auto-save current profile to localStorage
  watch(
    [profileName, banList, tagsRate, isLocked],
    () => {
      saveCurrentProfile()
    },
    { deep: true }
  )

  function addToBanList(tag: string) {
    if (!banList.value.includes(tag)) {
      banList.value.push(tag)
    }
  }

  function removeFromBanList(tag: string) {
    const index = banList.value.indexOf(tag)
    if (index > -1) {
      banList.value.splice(index, 1)
    }
  }

  function like(tags: string[]) {
    if (!isLocked.value) {
      tags.forEach((tag) => {
        if (!tagsRate.value[tag]) {
          tagsRate.value[tag] = 0
        }
        tagsRate.value[tag]++
      })
    }
  }

  function dislike(tags: string[]) {
    if (!isLocked.value) {
      tags.forEach((tag) => {
        if (!tagsRate.value[tag]) {
          tagsRate.value[tag] = 0
        }
        tagsRate.value[tag]--
      })
    }
  }

  function saveCurrentProfile() {
    const profiles = loadProfiles()

    // Mark all profiles as inactive
    const updatedProfiles = profiles.map((p) => ({ ...p, isActive: false }))

    const existingIndex = updatedProfiles.findIndex((p) => p.id === profileId.value)

    const snapshot: ProfileSnapshot = {
      id: profileId.value,
      name: profileName.value,
      banList: [...banList.value],
      tagsRate: { ...tagsRate.value },
      isActive: true,
      isLocked: isLocked.value,
    }

    if (existingIndex >= 0) {
      updatedProfiles[existingIndex] = snapshot
    } else {
      updatedProfiles.push(snapshot)
    }

    saveProfiles(updatedProfiles)
  }

  function loadProfile(snapshot: ProfileSnapshot) {
    profileId.value = snapshot.id
    profileName.value = snapshot.name
    banList.value = [...snapshot.banList]
    tagsRate.value = { ...snapshot.tagsRate }
    isLocked.value = snapshot.isLocked ?? false

    // Update all profiles to mark this one as active
    const profiles = loadProfiles().map((p) => ({
      ...p,
      isActive: p.id === snapshot.id,
    }))
    saveProfiles(profiles)
  }

  function createNewProfile(name: string) {
    // Save current profile before switching
    const profiles = loadProfiles()
    const existingIndex = profiles.findIndex((p) => p.id === profileId.value)

    const currentSnapshot: ProfileSnapshot = {
      id: profileId.value,
      name: profileName.value,
      banList: [...banList.value],
      tagsRate: { ...tagsRate.value },
      isActive: false,
      isLocked: isLocked.value,
    }

    if (existingIndex >= 0) {
      profiles[existingIndex] = currentSnapshot
    } else {
      profiles.push(currentSnapshot)
    }

    // Create new profile
    const newProfile: ProfileSnapshot = {
      id: generateId(),
      name,
      banList: [],
      tagsRate: {},
      isActive: true,
      isLocked: false,
    }

    profiles.push(newProfile)
    saveProfiles(profiles)

    // Switch to new profile
    profileId.value = newProfile.id
    profileName.value = newProfile.name
    banList.value = []
    tagsRate.value = {}
    isLocked.value = false
  }

  function deleteProfile(id: string) {
    const profiles = loadProfiles().filter((p) => p.id !== id)
    saveProfiles(profiles)

    // If deleting current profile, switch to first available or create new
    if (id === profileId.value) {
      const firstProfile = profiles[0]
      if (firstProfile) {
        loadProfile(firstProfile)
      } else {
        createNewProfile('Default')
      }
    }
  }

  function renameProfile(name: string) {
    profileName.value = name
    saveCurrentProfile()
  }

  function getAllProfiles(): ProfileSnapshot[] {
    return loadProfiles()
  }

  function toggleLock() {
    isLocked.value = !isLocked.value
  }

  // Initialize: Load last active profile or create default
  function init() {
    const profiles = loadProfiles()

    // Find active profile
    const activeProfile = profiles.find((p) => p.isActive)
    if (activeProfile) {
      profileId.value = activeProfile.id
      profileName.value = activeProfile.name
      banList.value = [...activeProfile.banList]
      tagsRate.value = { ...activeProfile.tagsRate }
      isLocked.value = activeProfile.isLocked ?? false
      return
    }

    // No active profile found, use first profile or create default
    const firstProfile = profiles[0]
    if (firstProfile) {
      loadProfile(firstProfile)
    } else {
      saveCurrentProfile() // Save initial default profile
    }
  }

  // Initialize on store creation
  init()

  return {
    profileId,
    profileName,
    banList,
    tagsRate,
    isLocked,
    addToBanList,
    removeFromBanList,
    like,
    dislike,
    saveCurrentProfile,
    loadProfile,
    createNewProfile,
    deleteProfile,
    renameProfile,
    getAllProfiles,
    toggleLock,
  }
})
