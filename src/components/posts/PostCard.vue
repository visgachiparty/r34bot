<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/src/components/ui/card'
import type { Post } from '../PostsLine.vue'

defineProps<{
  post: Post
}>()
</script>

<template>
  <Card class="w-full max-w-2xl mx-auto">
    <CardContent class="p-4">
      <img
        :src="post.fileUrl"
        :alt="`Post ${post.id}`"
        class="w-full h-auto rounded-lg object-contain max-h-[70vh]"
        loading="lazy"
      />
    </CardContent>
    <CardFooter class="flex flex-wrap gap-2 p-4">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
      >
        {{ tag }}
      </span>
    </CardFooter>
  </Card>
</template>
