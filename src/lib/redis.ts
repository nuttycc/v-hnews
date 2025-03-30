import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: import.meta.env.VITE_UPSTASH_REDIS_REST_URL,
  token: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN,
  cache: 'no-store',
})

export async function incrVisitCounter() {
  const key = 'vnews:visit-counter'
  const count = await redis.incr(key)
  return count
}

export async function getVisitCounter() : Promise<number> {
  const key = 'vnews:visit-counter'
  const count = (await redis.get(key)) as number
  return count || 0
}
