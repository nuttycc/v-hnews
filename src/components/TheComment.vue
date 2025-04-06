<template>
  <div>
    <CommentItem v-if="item">
      <template #footer-by>
        {{ item.author }}
      </template>
      <template #footer-time>
        {{ useTimeAgo(new Date(item.created_at)) }}
      </template>

      <template #footer-actions v-if="item.children.length > 0">
        <Icon
          :icon="isToggle ? 'ph:minus-fill' : 'basil:add-solid'"
          @click="isToggle = !isToggle"
        />
      </template>

      <template #text>
        <div v-html="item.text" class="comment-x"></div>
      </template>

      <template #children v-if="isToggle">
        <TheComment
          v-for="child in item.children"
          :key="child.id"
          :id="child.id"
          :r-index="props.rIndex + 10"
        />
      </template>
    </CommentItem>
  </div>
</template>

<script setup lang="ts">
import CommentItem from './slots/CommentItem.vue'
import { computed, watchEffect, ref } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchItem } from '@/lib/fetch'

const props = defineProps<{
  id: number
  rIndex: number
}>()

const isToggle = ref<boolean>(false)
const itemId = computed(() => props.id)

const { data: item } = useQuery({
  queryKey: ['comment', itemId],
  queryFn: () => fetchItem(itemId.value),
})
</script>

<style>
.comment-x pre,
.comment-x code {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
}

.comment-x {
  overflow-wrap: anywhere;

  text-wrap: pretty;
}
</style>
