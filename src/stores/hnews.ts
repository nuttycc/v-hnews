import { defineStore } from 'pinia'
import createLogger from '@/lib/slogger'

const logger = createLogger('[store][hnews]')
const BASE_URL = 'https://hacker-news.firebaseio.com/v0/'
const ALGOLIA_BASE_URL = 'https://hn.algolia.com/api/v1/'

export const HITS_PER_PAGE = 20

export const storyTypes = ['new', 'top', 'best', 'ask', 'show', 'job'] as const
export type StoryType = (typeof storyTypes)[number]

export interface ALGOItem {
  id: number
  title: string
  type: 'story' | 'comment' | 'job'
  url: string
  author: string
  created_at: string
  created_at_i: number
  children: ALGOItem[]
  points: number
  text: string | null
}

interface HNewsState {
  itemsMap: Map<number, ALGOItem>
  lists: Record<StoryType, number[]>
  commentCountCache: Map<number, number>
}

export const useHnewsStore = defineStore('hnews', {
  state: (): HNewsState => {
    const listInit = storyTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<StoryType, number[]>,
    )

    return {
      itemsMap: new Map<number, ALGOItem>(),
      lists: listInit,
      commentCountCache: new Map<number, number>(),
    }
  },

  getters: {
    getItemsByType: (state) => {
      return (type: StoryType, page: number): ALGOItem[] => {
        const ids = state.lists[type] ?? []
        const startIndex = (page - 1) * HITS_PER_PAGE
        const endIndex = Math.min(startIndex + HITS_PER_PAGE, ids.length)
        return ids
          .slice(startIndex, endIndex)
          .map((id) => state.itemsMap.get(id))
          .filter((item): item is ALGOItem => item !== undefined)
      }
    },
    getItemById: (state) => {
      return (id: number): ALGOItem | undefined => state.itemsMap.get(id)
    },

    getTotalCommentCount: (state) => {
      return (item: ALGOItem | undefined): number => {
        if (!item) return 0

        if (state.commentCountCache.has(item.id)) {
          return state.commentCountCache.get(item.id)!
        }

        const countComments = (root: ALGOItem): number => {
          if (!root.children || root.children.length === 0) {
            return 0
          }

          let count = 0
          const queue: ALGOItem[] = [...root.children]
          count += root.children.length

          while (queue.length > 0) {
            const current = queue.shift()!
            if (current.children && current.children.length > 0) {
              count += current.children.length
              queue.push(...current.children)
            }
          }

          return count
        }

        const result = countComments(item)
        state.commentCountCache.set(item.id, result)
        return result
      }
    },
  },

  actions: {
    async fetchItemByID(id: number, forceRefresh: boolean = false): Promise<ALGOItem> {
      if (!forceRefresh && this.itemsMap.has(id)) {
        // logger.debug('🚀 fetch -> Get from map.')
        return this.itemsMap.get(id)!
      }

      try {
        // logger.debug('🔜 Fetching...', id)
        const res = await fetch(`${ALGOLIA_BASE_URL}items/${id}`)
        if (!res.ok) {
          logger.error(`Failed to fetch item ${id}: ${res.statusText}`)
          throw new Error(`Failed to fetch item ${id}`)
        }
        const json = (await res.json()) as ALGOItem
        this.itemsMap.set(json.id, json)
        // 清除评论计数缓存
        this.commentCountCache.delete(json.id)
        // logger.debug('fetched a story!', json)
        return json
      } catch (error) {
        logger.error(`Error fetching item ${id}:`, error)
        throw error
      }
    },

    async fetchItems(ids: number[], forceRefresh: boolean = false): Promise<ALGOItem[]> {
      const idsToFetch = forceRefresh ? ids : ids.filter((id) => !this.itemsMap.has(id))

      if (idsToFetch.length === 0) {
        logger.debug('[FetchItems] No id need to fetch.')
        return ids
          .map((id) => this.itemsMap.get(id))
          .filter((item): item is ALGOItem => item !== undefined)
      }
      logger.debug(`[fetchItems] Fetching ${idsToFetch.length} items...`, idsToFetch)

      const promises = idsToFetch.map((id) => this.fetchItemByID(id, forceRefresh))

      try {
        const results = await Promise.allSettled(promises)
        logger.debug('[fetchItems] Promise results: ', results)
        const fetchedItems: ALGOItem[] = []
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            fetchedItems.push(result.value)
          } else {
            logger.warn(`[fetchItems] Failed to fetch ${idsToFetch[index]}: `, result.reason)
          }
        })

        logger.debug(`[fetchItems] Fetched ${fetchedItems.length} items.`)
        const allItems = ids
          .map((id) => this.itemsMap.get(id))
          .filter((item): item is ALGOItem => item !== undefined)
        return allItems
      } catch (error) {
        logger.error(`[fetchItems] Unexpected error during fetch:`, error)
        throw error
      }
    },

    async fetchListIdsByType(
      type: StoryType,
      forceRefresh: boolean = false,
    ): Promise<number[] | undefined> {
      if (!forceRefresh && this.lists[type]?.length > 0) {
        logger.debug(`🚀 [fetchListIdsByType] ${type} Cache hit.`)
        return this.lists[type]
      }

      logger.debug(`[fetchListIdsByType] Fetching ${type} list from API...`)

      try {
        const res = await fetch(`${BASE_URL}${type}stories.json`)
        if (!res.ok) {
          logger.error(`Failed to fetch ${type} list: ${res.statusText}`)
          return
        }
        const ids = (await res.json()) as number[]

        this.lists[type] = ids

        logger.debug(`[fetchListIdsByType] Fetched ${ids.length} ${type} ids.`)
        return ids
      } catch (error) {
        logger.error(`[fetchListIdsByType] Error fetching ${type} list:`, error)
        return
      }
    },

    async fetchListPage(
      type: StoryType,
      page: number = 1,
      forceRefreshList: boolean = false,
    ): Promise<{ items: ALGOItem[]; totalIds: number } | undefined> {
      logger.debug(`[fetchListPage] Fetching ${type} page ${page}...`)

      try {
        const allIds = await this.fetchListIdsByType(type, forceRefreshList)
        if (!allIds) {
          logger.warn(`[fetchListPage] No ids fetched for ${type}.`)
          return
        }

        const totalIds = allIds.length
        if (totalIds === 0) {
          logger.warn(`[fetchListPage] No ids fetched for ${type}.`)
          return { items: [], totalIds: 0 }
        }

        const startIndex = (page - 1) * HITS_PER_PAGE

        if (startIndex >= totalIds) {
          logger.warn(`[fetchListPage] Page ${page} is out of range for ${type}.`)
          return { items: [], totalIds }
        }

        const endIndex = Math.min(startIndex + HITS_PER_PAGE, totalIds)
        const idsToFetch = allIds.slice(startIndex, endIndex)
        const items = await this.fetchItems(idsToFetch, false)
        const orderedItems = idsToFetch
          .map((id) => items.find((item) => item.id === id))
          .filter((item): item is ALGOItem => item !== undefined)
        logger.debug(
          `[fetchListPage] Fetched ${orderedItems.length} items for ${type} page ${page}.`,
        )
        return { items: orderedItems, totalIds }
      } catch (error) {
        logger.error(`[fetchListPage] Error fetching ${type} page ${page}:`, error)
        return
      }
    },
  },
})
