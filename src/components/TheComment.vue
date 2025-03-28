<template>
  <div>
    <CommentItem v-if="item">
      <template #text>
        <div v-html="item.text"></div>
      </template>

      <template #children>
        <TheComment v-for="child in item.children" :key="child.id" :id="child.id" :r-index="props.rIndex + 10" />
      </template>

      <template #footer-by>
        <span>by {{ item.author }}</span>
      </template>
      <template #footer-time>
        <span>{{ item.created_at }}</span>
      </template>
    </CommentItem>
  </div>
</template>


<script setup lang="ts">
import { useHnewsStore } from '@/stores/hnews';
import CommentItem from './slots/CommentItem.vue';
import { computed, watchEffect } from 'vue';
const props = defineProps<{
  id: number,
  rIndex: number
}>()

const store = useHnewsStore()
const item = computed(() => store.itemById(props.id))


watchEffect(() => {
  store.fetchItemByID(props.id)
})

</script>
