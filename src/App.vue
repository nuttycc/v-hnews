<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { storyTypes } from './stores/hnews.ts'
// import TheCounter from "./components/base/TheCounter.vue";
</script>

<template>
  <header>
    <nav class="mb-1 flex w-[80lvw] flex-row items-center justify-start gap-2 md:justify-start">
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
  <VueQueryDevtools />

  <RouterView />
</template>

<style scoped></style>
