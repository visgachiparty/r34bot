<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { usePostsStore, type Post } from './stores/posts'
import PostCard from './components/posts/PostCard.vue'

const postsStore = usePostsStore()
const displayedPosts = ref<Post[]>([])
const isLoadingMore = ref(false)

async function loadNextPost() {
  if (isLoadingMore.value) return

  isLoadingMore.value = true
  const post = await postsStore.getNextPost()

  if (post) {
    displayedPosts.value.push(post)

    // Scroll to the newly added post after it's rendered
    await nextTick()
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }

  isLoadingMore.value = false
}

onMounted(() => {
  // Load first post on mount
  loadNextPost()
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8">Posts</h1>

      <div class="flex flex-col gap-6">
        <PostCard v-for="post in displayedPosts" :key="post.id" :post="post" />

        <div class="flex justify-center">
          <button
            @click="loadNextPost"
            :disabled="isLoadingMore"
            class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {{ isLoadingMore ? 'Loading...' : 'Load Next Post' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
