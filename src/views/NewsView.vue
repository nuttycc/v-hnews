<template>
  <div>
    <h1>Hacker News</h1>
    <div v-if="items.length > 0">
      <div v-for="item in items" :key="item.id">
        <TheStory :item="item" :index="0" />
      </div>
    </div>
    <div v-if="hasNextPage && !isFetchingNextPage" class="flex items-center justify-center">
      <div ref="observer-target" class="h-8 bg-amber-400"></div>
    </div>
    <div
      v-if="isLoadingIds || isLoadingItems || isFetching || isFetchingNextPage"
      class="flex size-40 items-center justify-center"
    >
      <div
        class="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-gray-900 dark:border-white"
      ></div>
    </div>
    <div v-else-if="isErrorIds || isErrorItems" class="flex h-screen items-center justify-center">
      <div class="text-2xl font-bold text-red-500">
        Error: {{ errorIds?.message || errorItems?.message }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query'
import { fetchListIds, fetchItems } from '@/lib/fetch'
import type { StoryType } from '@/stores/hnews'
import { computed, onMounted, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import TheStory from '@/components/TheStory.vue'

const HITS_PER_PAGE = 10

const observerTarget = useTemplateRef('observer-target')
const props = defineProps<{
  type: StoryType
}>()

const type = computed(() => props.type)

const {
  isLoading: isLoadingIds,
  isError: isErrorIds,
  data: dataIds,
  error: errorIds,
} = useQuery({
  queryKey: ['listIds', type],
  queryFn: () => fetchListIds(type.value),
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
})

const {
  isLoading: isLoadingItems,
  isError: isErrorItems,
  data: dataItems,
  error: errorItems,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFetching,
} = useInfiniteQuery({
  queryKey: ['listItems', type, dataIds],
  queryFn: ({ pageParam = 0 }) => {
    if (!dataIds.value) {
      throw new Error('No data ids')
    }
    const start = pageParam * HITS_PER_PAGE
    const end = start + HITS_PER_PAGE
    return fetchItems(dataIds.value.slice(start, end))
  },
  getNextPageParam: (lastPage, pages) => {
    return lastPage.length > 0 ? pages.length + 1 : undefined
  },
  initialPageParam: 0,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
})

const items = computed(() => {
  return dataItems.value?.pages.flatMap((page) => page) || []
})

onMounted(() => {
  useIntersectionObserver(
    observerTarget,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (!isFetchingNextPage && hasNextPage) {
          fetchNextPage()
        }
      }
    },
    {
      threshold: 0.5,
    },
  )
})
</script>
