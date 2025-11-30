import { defineStore } from 'pinia'
import { ref } from 'vue'

const LIMIT = 100

export interface Post {
  id: string
  tags: string[]
  fileUrl: string
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const viewed = ref<string[]>([])
  const banList = ref<string[]>([])
  const currentPage = ref(0)
  const currentIndex = ref(0)
  const loading = ref(false)

  const apiKey = import.meta.env.VITE_RULE_34_API_KEY
  const userId = import.meta.env.VITE_RULE_34_API_USER_ID
  const baseUrl = import.meta.env.VITE_RULE_34_API_POST_LIST_URL

  async function fetchPosts(page: number): Promise<Post[]> {
    const banListString = banList.value.join(' ')
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

  function addToBanList(tag: string) {
    if (!banList.value.includes(tag)) {
      banList.value.push(tag)
    }
  }

  function removeFromBanList(tag: string) {
    const index = banList.value.indexOf(tag)
    if (index > -1) {
      banList.value.splice(index, 1)
    }
  }

  return {
    posts,
    viewed,
    banList,
    loading,
    getNextPost,
    addToBanList,
    removeFromBanList,
  }
})
