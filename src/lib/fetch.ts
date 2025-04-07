import type { StoryType, ALGOItem } from '@/stores/hnews'

const BASE_URL = 'https://hacker-news.firebaseio.com/v0'
const ALGOLIA_BASE_URL = `https://hn.algolia.com/api/v1`

export async function fetchItem(id: number): Promise<ALGOItem> {
  try {
    const res = await fetch(`${ALGOLIA_BASE_URL}/items/${id}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch item ${id}: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error)
    throw error
  }
}

export async function fetchItems(ids: number[]): Promise<ALGOItem[]> {
  try {
    const promises = ids.map((id) => fetchItem(id))
    const items = await Promise.all(promises)
    return items.filter((item) => item !== null)
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error
  }
}

export async function fetchListIds(type: StoryType): Promise<number[]> {
  try {
    const res = await fetch(`${BASE_URL}/${type}stories.json`)
    if (!res.ok) {
      throw new Error(`Failed to fetch list ids: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching list ids:', error)
    throw error
  }
}
