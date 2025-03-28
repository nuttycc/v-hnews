<template>
  <div v-if="item" class="md:max-w-3xl flex md:flex-col md:gap-16">
    <TheStory :id="item.id" :index="1" />

    <div class="border">
      <TheComment v-for="child in item.children" :key="child.id" :id="child.id" :r-index="1" />
    </div>
  </div>
</template>
<script setup lang="ts">
import TheComment from '@/components/TheComment.vue';
import TheStory from '@/components/TheStory.vue';
import { useHnewsStore } from '@/stores/hnews';
import { computed, watchEffect } from 'vue';



const props = defineProps<{
  id: number
}>()

const store = useHnewsStore()

const item = computed(() => store.itemById(props.id))

watchEffect(() => {
  store.fetchItemByID(props.id)
})

</script>
