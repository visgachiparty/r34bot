<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useProfilesStore } from '../stores/profiles'
import { useLineStore } from '../stores/line'
import PostCard from './posts/PostCard.vue'
import type { Post } from '../types/post'

const LIMIT = 100

const profilesStore = useProfilesStore()
const lineStore = useLineStore()

const loading = ref(false)
const isLoadingMore = ref(false)

const apiKey = import.meta.env.VITE_RULE_34_API_KEY
const userId = import.meta.env.VITE_RULE_34_API_USER_ID
const baseUrl = import.meta.env.VITE_RULE_34_API_POST_LIST_URL

async function fetchPosts(page: number): Promise<Post[]> {
  const banListString = profilesStore.activeProfile?.banList.join(' ') || ''
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

  if (lineStore.searchTags !== '') {
    url += '+' + lineStore.searchTags.split(' ').join('+')
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
      if (lineStore.currentIndex >= LIMIT || lineStore.posts.length === 0) {
        lineStore.currentIndex = 0
        const fetchedPosts = await fetchPosts(lineStore.currentPage)

        if (fetchedPosts.length === 0) {
          return null
        }

        lineStore.posts = fetchedPosts
        lineStore.currentPage++
      }

      const post = lineStore.posts[lineStore.currentIndex]
      lineStore.currentIndex++

      if (post) {
        const atLeastOneTagInBanList = post.tags.some((tag) =>
          profilesStore.activeProfile?.banList.includes(tag),
        )
        const total = post.tags.reduce(
          (sum, tag) => sum + (profilesStore.activeProfile?.tagsRate[tag] ?? 0),
          0,
        )
        if (atLeastOneTagInBanList || (total < 0 && profilesStore.activeProfile?.isLocked)) {
          profilesStore.addToViewed(post.id)
          continue
        }
        if (!profilesStore.isViewed(post.id) && post.tags.length >= 10) {
          profilesStore.addToViewed(post.id)
          return post
        }
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
    lineStore.displayedPosts.push(post)

    await nextTick()
    // Scroll to the bottom of the page
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }, 150)
  }

  isLoadingMore.value = false
}

async function handleLike() {
  const lastPost = lineStore.displayedPosts[lineStore.displayedPosts.length - 1]
  if (lastPost) {
    profilesStore.like(lastPost.tags)
  }
  await loadNextPost()
}

async function handleDislike() {
  const lastPost = lineStore.displayedPosts[lineStore.displayedPosts.length - 1]
  if (lastPost) {
    profilesStore.dislike(lastPost.tags)
  }
  await loadNextPost()
}

async function handleSkip() {
  await loadNextPost()
}

watch(
  () => lineStore.displayedPosts.length,
  (newLength) => {
    if (newLength === 0) {
      loadNextPost()
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <PostCard
      v-for="post in lineStore.displayedPosts"
      :key="post.id"
      :post="post"
      class="post-card"
    />

    <div class="w-full max-w-2xl mx-auto flex gap-4" v-if="lineStore.displayedPosts.length > 0">
      <button
        @click="handleLike"
        :disabled="isLoadingMore"
        class="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {{ isLoadingMore ? 'Loading...' : '❤️' }}
      </button>
      <button
        @click="handleSkip"
        :disabled="isLoadingMore"
        class="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {{ isLoadingMore ? 'Loading...' : 'Skip' }}
      </button>
      <button
        @click="handleDislike"
        :disabled="isLoadingMore"
        class="bg-white flex-1 px-6 py-3 text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {{ isLoadingMore ? 'Loading...' : '👎' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
