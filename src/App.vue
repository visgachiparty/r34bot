<script setup lang="ts">
import PostsLine from './components/PostsLine.vue'
import Sidebar from './components/Sidebar.vue'
import MobileHeader from './components/MobileHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Mobile Header -->
    <MobileHeader />

    <!-- Desktop Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="lg:mr-80 pt-20 lg:pt-8 pb-8">
      <div class="container mx-auto px-4">
        <PostsLine />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
