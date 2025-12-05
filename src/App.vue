<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import MobileHeader from './components/MobileHeader.vue'
import 'vue-sonner/style.css'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <MobileHeader />
    <Sidebar />
    <div class="lg:mr-80 pt-20 lg:pt-8 pb-8">
      <RouterView />
    </div>

    <Toaster position="top-center" richColors />
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: white;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.8);
}

* {
  scrollbar-width: thin;
  scrollbar-color: white transparent;
}
</style>
