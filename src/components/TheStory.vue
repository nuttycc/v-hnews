<template>
  <div>
    <StoryItem v-if="item">
      <template #index>
       {{ props.index}}
      </template>

      <template #title>
        <a :href="item?.url" class="hover:underline leading-7 font-semibold">
          {{ item.title }}
        </a>
      </template>

      <template #footer-by>
        <span>by {{ item.author }}</span>
      </template>
      <template #footer-comments>
        <span>
          <a :href="`/item/${item.id}`" class="px-1 underline  hover:decoration-[0.1em]">
            {{ item.children.length }} comments
          </a>
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
import { useHnewsStore } from '@/stores/hnews';
// import { storeToRefs } from 'pinia';
import { computed, watchEffect } from 'vue'
import StoryItem from './slots/StoryItem.vue';
import { useTimeAgo } from '@vueuse/core'
const props = defineProps<{ id: number, index: number }>()
const store = useHnewsStore()

const item = computed(() => store.itemById(props.id))


watchEffect(() => {
  store.itemById(props.id)
})

</script>

<style lang="css" scoped>


</style>
