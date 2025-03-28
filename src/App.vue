<script setup lang="ts">
import { storyTypes } from "./stores/hnews.ts";


</script>

<template>
  <header>
    <nav class="md:flex md:flex-row gap-2 mb-1">
      <RouterLink v-for="type in storyTypes" :to="`/${type}`" :key="type" class="px-2 uppercase dark:bg-slate-800 dark:hover:bg-slate-700 ">
        {{ type }}
      </RouterLink>
    </nav>
    <hr class="mb-2" />
  </header>

  <RouterView />
</template>

<style scoped>

</style>
