<template>
  <div class="flex flex-col">
    <progress
      :value="items.length / HITS_PER_PAGE"
      :max="1"
      :class="['h-0.5 w-full', items.length === HITS_PER_PAGE ? 'hidden' : 'block']"
    ></progress>
    <div v-if="items.length > 0" class="flex flex-col gap-3">
      <div v-for="(item, i) in items" :key="item.id">
        <TheStory :id="item.id" :index="(page - 1) * HITS_PER_PAGE + i + 1" />
      </div>
    </div>
    <div v-else>
      <div v-for="i in 20" :key="i">
        <div class="mb-1 flex h-9 animate-pulse flex-col gap-1">
          <div class="h-1/3 md:w-52 dark:bg-slate-600"></div>
          <div class="h-1/3 md:w-80 dark:bg-slate-600"></div>
        </div>
      </div>
    </div>

    <div class="pagination mt-4 flex flex-row gap-1">
      <RouterLink :to="{ name: `${props.type}`, params: { page: props.page - 1 } }"
        >Previous</RouterLink
      >
      <RouterLink v-if="props.page > 1" :to="{ name: `${props.type}`, params: { page: 1 } }"
        >1</RouterLink
      >
      <span v-if="props.page > 2">...</span>
      <RouterLink
        v-for="i in 5"
        :key="i"
        :to="{ name: `${props.type}`, params: { page: props.page + i - 1 } }"
        >{{ props.page + i - 1 }}</RouterLink
      >
      <RouterLink :to="{ name: `${props.type}`, params: { page: props.page + 1 } }"
        >Next</RouterLink
      >
    </div>
  </div>
</template>
<script setup lang="ts">
// Get page story
import TheStory from '@/components/TheStory.vue'
import createLogger from '@/lib/slogger'
import { HITS_PER_PAGE, useHnewsStore, type StoryType } from '@/stores/hnews'
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  type: StoryType
  page: number
}>()

const logger = createLogger('[NewsView]')
const route = useRoute()

logger.debug('route', route.path)
const store = useHnewsStore()

const items = computed(() => store.getItemsByType(props.type, props.page))

watchEffect(() => {
  store.fetchListPage(props.type, props.page)
})

logger.debug('items', items.value)

defineExpose({
  path: route.path,
})
</script>
<style scoped>
a {
  background-color: var(--color-slate-800);
  padding: 2px 4px;
  border-radius: 4px;
  text-decoration: none;
}

a:hover {
  background-color: var(--color-slate-700);
}

.router-link-exact-active {
  background-color: var(--color-slate-700);
}
</style>
