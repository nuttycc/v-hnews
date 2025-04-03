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
        <div v-html="item.text"></div>
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
import { useHnewsStore } from '@/stores/hnews'
import CommentItem from './slots/CommentItem.vue'
import { computed, watchEffect, ref } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  id: number
  rIndex: number
}>()

const store = useHnewsStore()
const item = computed(() => store.getItemById(props.id))
const isToggle = ref<boolean>(false)

watchEffect(() => {
  store.fetchItemById(props.id)
})
</script>
