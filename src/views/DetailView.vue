<template>
  <div v-if="item" class="flex md:max-w-4xl md:flex-col md:gap-8">
    <TheStory :id="item.id" :index="'⚓'" class="border p-2 dark:border-slate-700" />

    <div class="border dark:border-slate-700">
      <TheComment v-for="child in item.children" :key="child.id" :id="child.id" :r-index="1" />
    </div>
  </div>
</template>
<script setup lang="ts">
import TheComment from '@/components/TheComment.vue'
import TheStory from '@/components/TheStory.vue'
import { useHnewsStore } from '@/stores/hnews'
import { computed, watchEffect } from 'vue'

const props = defineProps<{
  id: number
}>()

const store = useHnewsStore()

const item = computed(() => store.getItemById(props.id))

watchEffect(() => {
  store.fetchItemByID(props.id)
})
</script>
