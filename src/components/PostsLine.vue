<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useProfileStore } from '../stores/profile'
import PostCard from './posts/PostCard.vue'

const LIMIT = 100

export interface Post {
  id: string
  tags: string[]
  fileUrl: string
}

const profileStore = useProfileStore()

const posts = ref<Post[]>([])
const viewed = ref<string[]>([])
const currentPage = ref(0)
const currentIndex = ref(0)
const loading = ref(false)

const displayedPosts = ref<Post[]>([])
const isLoadingMore = ref(false)

const apiKey = import.meta.env.VITE_RULE_34_API_KEY
const userId = import.meta.env.VITE_RULE_34_API_USER_ID
const baseUrl = import.meta.env.VITE_RULE_34_API_POST_LIST_URL

async function fetchPosts(page: number): Promise<Post[]> {
  const banListString = profileStore.banList.join(' ')
  let url =
    baseUrl +
    '&api_key=' +
    apiKey +
    '&user_id=' +
    userId +
    '&pid=' +
    page +
    '&limit=' +
    LIMIT +
    '&tags=-video+-gif'

  if (banListString !== '') {
    url += '+-' + banListString.split(' ').join('+-')
  }

  const response = await fetch(url)
  const text = await response.text()

  // Parse XML response
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(text, 'text/xml')
  const postElements = xmlDoc.querySelectorAll('post')

  const fetchedPosts: Post[] = []
  postElements.forEach((postEl) => {
    const id = postEl.getAttribute('id') || ''
    const tags = (postEl.getAttribute('tags') || '').split(' ')
    const fileUrl = postEl.getAttribute('file_url') || ''

    if (id && tags.length >= 10) {
      fetchedPosts.push({ id, tags, fileUrl })
    }
  })

  return fetchedPosts
}

async function getNextPost(): Promise<Post | null> {
  loading.value = true

  try {
    while (true) {
      // Fetch new posts if we've exhausted the current page
      if (currentIndex.value >= LIMIT || posts.value.length === 0) {
        currentIndex.value = 0
        const fetchedPosts = await fetchPosts(currentPage.value)

        if (fetchedPosts.length === 0) {
          return null // No more posts
        }

        posts.value = fetchedPosts
        currentPage.value++
      }

      const post = posts.value[currentIndex.value]
      currentIndex.value++

      if (post && !viewed.value.includes(post.id) && post.tags.length >= 10) {
        viewed.value.push(post.id)
        return post
      }
    }
  } finally {
    loading.value = false
  }
}

async function loadNextPost() {
  if (isLoadingMore.value) return

  isLoadingMore.value = true
  const post = await getNextPost()

  if (post) {
    displayedPosts.value.push(post)

    // Scroll to the newly added post after it's rendered
    await nextTick()
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }, 200)
  }

  isLoadingMore.value = false
}

async function handleLike() {
  const lastPost = displayedPosts.value[displayedPosts.value.length - 1]
  if (lastPost) {
    profileStore.like(lastPost.tags)
  }
  await loadNextPost()
}

async function handleDislike() {
  const lastPost = displayedPosts.value[displayedPosts.value.length - 1]
  if (lastPost) {
    profileStore.dislike(lastPost.tags)
  }
  await loadNextPost()
}

onMounted(() => {
  // Load first post on mount
  loadNextPost()
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <PostCard v-for="post in displayedPosts" :key="post.id" :post="post" />

    <div class="w-full max-w-2xl mx-auto flex gap-4" v-if="displayedPosts.length > 0">
      <button
        @click="handleLike"
        :disabled="isLoadingMore"
        class="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {{ isLoadingMore ? 'Loading...' : '👍' }}
      </button>
      <button
        @click="handleDislike"
        :disabled="isLoadingMore"
        class="flex-1 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {{ isLoadingMore ? 'Loading...' : '👎' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
