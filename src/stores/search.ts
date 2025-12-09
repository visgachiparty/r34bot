import { defineStore } from 'pinia'
import { ref } from 'vue'

const MAX_HISTORY_ITEMS = 1000

export const useSearchStore = defineStore('search', () => {
  const history = ref<string[]>([])

  const loadHistory = () => {
    const saved = localStorage.getItem('search-history')
    if (saved) {
      try {
        history.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load search history:', e)
        history.value = []
      }
    }
  }

  const saveHistory = () => {
    localStorage.setItem('search-history', JSON.stringify(history.value))
  }

  const addToHistory = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    const index = history.value.indexOf(trimmed)
    if (index > -1) {
      history.value.splice(index, 1)
    }

    history.value.unshift(trimmed)

    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value = history.value.slice(0, MAX_HISTORY_ITEMS)
    }

    saveHistory()
  }

  const deleteHistoryItem = (index: number) => {
    history.value.splice(index, 1)
    saveHistory()
  }

  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  loadHistory()

  return {
    history,
    addToHistory,
    deleteHistoryItem,
    clearHistory,
  }
})
