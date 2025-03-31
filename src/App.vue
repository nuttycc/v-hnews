<script setup lang="ts">
import { storyTypes } from './stores/hnews.ts'
// import TheCounter from "./components/base/TheCounter.vue";
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.path)
</script>

<template>
  <header>
    <nav class="mb-1 gap-2 md:flex md:flex-row">
      <RouterLink
        v-for="type in storyTypes"
        :to="`/${type}/1`"
        :key="type"
        :class="[
          'px-2 uppercase',
          $route.path.split('/')[1] === type
            ? 'dark:bg-green-700'
            : 'dark:bg-slate-800 dark:hover:bg-slate-700',
        ]"
      >
        {{ type }}
      </RouterLink>
    </nav>
    <!-- <TheCounter /> -->
    <hr class="mb-2" />
  </header>

  <RouterView />
</template>

<style scoped></style>
