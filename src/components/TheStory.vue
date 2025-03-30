<template>
  <div>
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
            {{ item.children.length }} comments
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
  </div>
</template>
<script setup lang="ts">
// Get one story
import { useHnewsStore } from '@/stores/hnews'
// import { storeToRefs } from 'pinia';
import { computed, watchEffect } from 'vue'
import StoryItem from './slots/StoryItem.vue'
import { useTimeAgo } from '@vueuse/core'
import { RouterLink } from 'vue-router';
const props = defineProps<{ id: number; index: number }>()
const store = useHnewsStore()

const item = computed(() => store.itemById(props.id))

watchEffect(() => {
  store.itemById(props.id)
})
</script>

<style lang="css" scoped></style>
