<template>
  <div>
    <div v-if="items.length > 0" ref="virtualParent">
      <div class="relative w-full" :style="{ height: `${totalSize}px` }">
        <div
          v-for="virtualRow in virtualRows"
          :key="virtualRow.index"
          class="absolute top-0 left-0 w-full"
          :style="{
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }"
        >
          <TheStory :item="items[virtualRow.index]" :index="virtualRow.index" />
        </div>
      </div>
    </div>
    <div
      v-if="isLoadingIds || isLoadingItems || isFetching || isFetchingNextPage"
      class="mt-4 flex flex-col gap-2"
    >
      <div
        v-for="i in [...Array(10).keys()]"
        :key="i"
        class="flex h-16 animate-pulse flex-col gap-1"
      >
        <div class="h-3/7 w-3xs rounded-sm md:w-md dark:bg-gray-500"></div>
        <div class="h-4/7 w-xs rounded-sm md:w-xl dark:bg-gray-500"></div>
      </div>
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
import { computed, watchEffect } from 'vue'
import TheStory from '@/components/TheStory.vue'
import { useWindowVirtualizer, type VirtualizerOptions } from '@tanstack/vue-virtual'
import createLogger from '@/lib/slogger'

const logger = createLogger('[NewsView]')
const HITS_PER_PAGE = 20

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
})

const items = computed(() => {
  return dataItems.value?.pages.flatMap((page) => page) || []
})

const rowVirtualizerOptions = computed(() => {
  return {
    count: hasNextPage ? items.value.length + 1 : items.value.length,
    estimateSize: () => 55,
    overscan: 3,
    debug: import.meta.env.DEV,
  }
})

const rowVirtualizer = useWindowVirtualizer(rowVirtualizerOptions)
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

watchEffect(() => {
  const [lastItem] = [...virtualRows.value].reverse()
  if (!lastItem) return

  logger.debug(`'Last item:', ${lastItem.index}--${items.value.length}`)

  if (lastItem.index >= items.value.length - 1 && hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage()
    logger.debug('Fetching next page...')
  }
})
</script>
