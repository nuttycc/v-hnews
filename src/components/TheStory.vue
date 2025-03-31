<template>
  <div class="min-h-9">
    <StoryItem v-if="item">
      <template #index>
        {{ props.index }}
      </template>

      <template #title>
        <a :href="item?.url" target="_blank" class="leading-7 font-semibold hover:underline">
          {{ item.title }}
        </a>
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
import { useHnewsStore } from '@/stores/hnews'
import { computed, watchEffect } from 'vue'
import StoryItem from './slots/StoryItem.vue'
import { useTimeAgo } from '@vueuse/core'
import { RouterLink } from 'vue-router'
const props = defineProps<{ id: number; index: string | number }>()
const store = useHnewsStore()

const item = computed(() => store.getItemById(props.id))
const totalComments = computed(() => store.getTotalCommentCount(item.value))

watchEffect(() => {
  store.getItemById(props.id)
})
</script>

<style lang="css" scoped></style>
