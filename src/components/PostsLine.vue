<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useProfilesStore } from '../stores/profiles'
import { useLineStore } from '../stores/line'
import PostCard from './posts/PostCard.vue'
import type { Post } from '../types/post'
import Spinner from './ui/card/Spinner.vue'

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
    profilesStore.addToViewed(lastPost.id)
    profilesStore.like(lastPost.tags, lastPost.fileUrl)
  }
  await loadNextPost()
}

async function handleDislike() {
  const lastPost = lineStore.displayedPosts[lineStore.displayedPosts.length - 1]
  if (lastPost) {
    profilesStore.addToViewed(lastPost.id)
    profilesStore.dislike(lastPost.tags)
  }
  await loadNextPost()
}

async function handleSkip() {
  const lastPost = lineStore.displayedPosts[lineStore.displayedPosts.length - 1]
  if (lastPost) {
    profilesStore.addToViewed(lastPost.id)
  }
  await loadNextPost()
}

onBeforeUnmount(() => {
  lineStore.savedScrollPosition = window.scrollY
})

onMounted(() => {
  if (lineStore.savedScrollPosition > 0) {
    nextTick(() => {
      window.scrollTo({
        top: lineStore.savedScrollPosition,
        behavior: 'auto',
      })
    })
  }
})

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

    <div
      v-if="lineStore.displayedPosts.length === 0 && !isLoadingMore"
      class="w-full max-w-2xl mx-auto text-center py-12"
    >
      <p class="text-muted-foreground text-lg">No posts found</p>
    </div>

    <div class="w-full max-w-2xl mx-auto" v-if="lineStore.displayedPosts.length > 0">
      <div v-if="isLoadingMore" class="flex justify-center py-3">
        <Spinner class="w-8 h-8 mx-auto" />
      </div>
      <div v-else class="flex gap-4">
        <button
          @click="handleLike"
          class="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          ❤️
        </button>
        <button
          @click="handleSkip"
          class="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Skip
        </button>
        <button
          @click="handleDislike"
          class="bg-white flex-1 px-6 py-3 text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          👎
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
