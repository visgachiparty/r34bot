import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type ProfileSnapshot = {
  id: string
  name: string
  banList: string[]
  tagsRate: Record<string, number>
  isActive: boolean
  isLocked: boolean
}

const STORAGE_KEY = 'r34-profiles'

const generateId = (): string => crypto.randomUUID()

const loadProfiles = (): ProfileSnapshot[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveProfiles = (profiles: ProfileSnapshot[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<ProfileSnapshot[]>(loadProfiles())
  const activeProfileId = ref<string>('')

  // Auto-save to localStorage on every change
  watch(
    profiles,
    (newProfiles) => {
      saveProfiles(newProfiles)
    },
    { deep: true },
  )

  const activeProfile = computed(() =>
    profiles.value.find((profile) => profile.id === activeProfileId.value),
  )

  const addToBanList = (tag: string) => {
    const profile = activeProfile.value
    if (profile && !profile.banList.includes(tag)) {
      profile.banList.push(tag)
    }
  }

  const removeFromBanList = (tag: string) => {
    const profile = activeProfile.value
    if (profile) {
      const index = profile.banList.indexOf(tag)
      if (index > -1) {
        profile.banList.splice(index, 1)
      }
    }
  }

  const resetTagRating = (tag: string) => {
    const profile = activeProfile.value
    if (profile && profile.tagsRate[tag] !== undefined) {
      profile.tagsRate[tag] = 0
    }
  }

  const like = (tags: string[]) => {
    const profile = activeProfile.value
    if (profile && !profile.isLocked) {
      tags.forEach((tag) => {
        if (!profile.tagsRate[tag]) {
          profile.tagsRate[tag] = 0
        }
        profile.tagsRate[tag]++
      })
    }
  }

  const dislike = (tags: string[]) => {
    const profile = activeProfile.value
    if (profile && !profile.isLocked) {
      tags.forEach((tag) => {
        if (!profile.tagsRate[tag]) {
          profile.tagsRate[tag] = 0
        }
        profile.tagsRate[tag]--
        if (profile.tagsRate[tag] < -100) {
          addToBanList(tag)
        }
      })
    }
  }

  const loadProfile = (targetId: string) => {
    profiles.value.forEach((profile) => {
      profile.isActive = profile.id === targetId
    })
    activeProfileId.value = targetId
  }

  const createNewProfile = (newName: string) => {
    const newProfile: ProfileSnapshot = {
      id: generateId(),
      name: newName,
      banList: [],
      tagsRate: {},
      isActive: false,
      isLocked: false,
    }

    profiles.value.push(newProfile)
    loadProfile(newProfile.id)
  }

  const deleteProfile = (targetId: string) => {
    const index = profiles.value.findIndex((profile) => profile.id === targetId)
    if (index === -1) return

    profiles.value.splice(index, 1)

    if (targetId === activeProfileId.value) {
      const firstProfile = profiles.value[0]
      if (firstProfile) {
        loadProfile(firstProfile.id)
      } else {
        createNewProfile('Default')
      }
    }
  }

  const renameProfile = (targetId: string, newName: string) => {
    const profile = profiles.value.find((p) => p.id === targetId)
    if (profile) {
      profile.name = newName
    }
  }

  const toggleLock = (targetId: string) => {
    const profile = profiles.value.find((p) => p.id === targetId)
    if (profile) {
      profile.isLocked = !profile.isLocked
    }
  }

  const init = () => {
    if (profiles.value.length === 0) {
      createNewProfile('Default')
      return
    }

    const savedActiveProfile = profiles.value.find((profile) => profile.isActive)
    if (savedActiveProfile) {
      activeProfileId.value = savedActiveProfile.id
    } else {
      const firstProfile = profiles.value[0]
      if (firstProfile) {
        loadProfile(firstProfile.id)
      }
    }
  }

  init()

  return {
    profiles,
    activeProfileId,
    activeProfile,
    addToBanList,
    removeFromBanList,
    resetTagRating,
    like,
    dislike,
    loadProfile,
    createNewProfile,
    deleteProfile,
    renameProfile,
    toggleLock,
  }
})
