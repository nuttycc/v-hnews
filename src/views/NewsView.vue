<template>
  <div class="flex flex-col gap-3">
    <div v-for="(item, i) in items" :key="item.id">
      <TheStory :id="item.id" :index="(page - 1) * HITS_PER_PAGE + i + 1" />
    </div>
  </div>
</template>
<script setup lang="ts">
// Get page story
import TheStory from '@/components/TheStory.vue';
import createLogger from '@/lib/slogger';
import { HITS_PER_PAGE, useHnewsStore, type StoryType } from '@/stores/hnews';
// import { storeToRefs } from 'pinia';
import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  type: StoryType,
  page: number
}>()



const logger = createLogger('[NewsView]')
const route = useRoute();

logger.debug('route', route)
const store = useHnewsStore()

const items = computed(() => store.getItemsByType(props.type))

watchEffect(() => {
  store.fetchListPage(props.type, props.page)
})

logger.debug('items', items.value)
</script>
