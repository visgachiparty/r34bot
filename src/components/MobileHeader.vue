<script setup lang="ts">
import { ref } from 'vue'
import SidebarContent from './SidebarContent.vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="lg:hidden">
    <!-- Fixed Header -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
      <h1 class="text-xl font-bold">Posts</h1>
      <button
        @click="toggleMenu"
        class="p-2 hover:bg-secondary rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </header>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="toggleMenu"
    ></div>

    <!-- Mobile Menu Sidebar -->
    <aside
      :class="[
        'fixed top-0 right-0 h-screen w-80 bg-card border-l border-border p-6 z-50 transition-transform duration-300 flex flex-col',
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 class="text-xl font-bold">Menu</h2>
        <button
          @click="toggleMenu"
          class="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-hidden">
        <SidebarContent />
      </div>
    </aside>
  </div>
</template>
