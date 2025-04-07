<template>
  <div v-if="item" class="flex max-w-lvw flex-col md:max-w-4xl">
    <TheStory :item="item" :id="item.id" :index="'⚓'" class="border p-2 dark:border-slate-700" />

    <div class="border dark:border-slate-700">
      <TheComment v-for="child in item.children" :key="child.id" :id="child.id" :r-index="1" />
    </div>
  </div>
</template>
<script setup lang="ts">
import TheComment from '@/components/TheComment.vue'
import TheStory from '@/components/TheStory.vue'
import { fetchItem } from '@/lib/fetch'
// import { useHnewsStore } from '@/stores/hnews'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import createLogger from '@/lib/slogger'

const logger = createLogger('[DetailsView]')

const props = defineProps<{
  id: number
}>()

const itemId = computed(() => props.id)
const { data: item } = useQuery({
  queryKey: ['story', itemId],
  queryFn: () => fetchItem(itemId.value),
})

logger.debug('item', item.value)
</script>
