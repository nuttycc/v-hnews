<template>
  <div>Visit Counter: {{ count }}</div>
</template>

<script setup lang="ts">
import { getVisitCounter, incrVisitCounter } from '@/lib/redis'
import { onMounted, ref } from 'vue'

const count = ref(0)

onMounted(async () => {
  await incrVisitCounter()
  count.value = await getVisitCounter()
})
</script>
