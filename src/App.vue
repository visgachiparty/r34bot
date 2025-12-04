<script setup lang="ts">
import PostsLine from './components/PostsLine.vue'
import Sidebar from './components/Sidebar.vue'
import MobileHeader from './components/MobileHeader.vue'
import 'vue-sonner/style.css'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Mobile Header -->
    <MobileHeader />
    <Sidebar />
    <div class="lg:mr-80 pt-20 lg:pt-8 pb-8">
      <div class="container mx-auto px-4">
        <PostsLine />
      </div>
    </div>

    <Toaster position="top-center" richColors />
  </div>
</template>

<style scoped></style>
