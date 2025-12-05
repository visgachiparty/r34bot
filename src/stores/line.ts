import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post } from '../types/post'

export const useLineStore = defineStore('line', () => {
  const searchTags = ref<string>('')
  const posts = ref<Post[]>([])
  const displayedPosts = ref<Post[]>([])
  const currentPage = ref(0)
  const currentIndex = ref(0)
  const savedScrollPosition = ref(0)

  const reset = () => {
    posts.value = []
    displayedPosts.value = []
    currentPage.value = 0
    currentIndex.value = 0
    savedScrollPosition.value = 0
  }

  return {
    searchTags,
    posts,
    displayedPosts,
    currentPage,
    currentIndex,
    savedScrollPosition,
    reset,
  }
})
