<template>
  <div class="min-h-9">
    <StoryItem v-if="item">
      <template #index>
        <a :href="`#${item.id}`">
          {{ props.index }}
        </a>
      </template>

      <template #title>
        <a
          v-if="item.url"
          :href="item.url"
          target="_blank"
          :id="`${props.id}`"
          class="leading-7 font-semibold hover:underline"
        >
          {{ item.title }}
        </a>
        <RouterLink v-else :to="`/item/${item.id}`" class="leading-7 font-semibold hover:underline">
          {{ item.title }}
        </RouterLink>
      </template>

      <template #footer-icon>
        <img v-if="faviconUrl" :src="faviconUrl" alt="site favicon" @error="handleImageError" />
        <Icon v-else icon="mdi:link" />
      </template>
      <template #footer-by>
        <span>by {{ item.author }}</span>
      </template>
      <template #footer-comments>
        <span>
          <RouterLink :to="`/item/${item.id}`" class="px-1 underline hover:decoration-[0.1em]">
            {{ totalComments }} comments
          </RouterLink>
        </span>
      </template>
      <template #footer-points>
        <span>{{ item.points }} points</span>
      </template>
      <template #footer-time>
        {{ useTimeAgo(new Date(item.created_at)) }}
      </template>
    </StoryItem>
    <div v-else class="h-80 bg-green-400"></div>
  </div>
</template>
<script setup lang="ts">
// Show one story
import { useHnewsStore, type ALGOItem } from '@/stores/hnews'
import { computed, watchEffect } from 'vue'
import StoryItem from './slots/StoryItem.vue'
import { useTimeAgo } from '@vueuse/core'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{ item: ALGOItem; index: string | number }>()
const store = useHnewsStore()

const item = computed(() => props.item)

const totalComments = computed(() => store.getTotalCommentCount(item.value))
const faviconUrl = computed(() => {
  if (!item.value?.url) return ''
  try {
    return `https://favicon.im/${new URL(item.value.url).hostname}`
  } catch {
    return ''
  }
})

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (item.value?.url) {
    target.src = 'https://www.google.com/s2/favicons?domain=' + new URL(item.value.url).hostname
  }
}
</script>

<style lang="css" scoped></style>
