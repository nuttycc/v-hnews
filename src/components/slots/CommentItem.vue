<template>
  <article
    class="my-3 ml-4 border-l-2 border-gray-200 pr-2 pl-2 transition-colors duration-200 dark:border-gray-700 dark:hover:border-orange-700/50"
  >
    <footer
      class="mb-2 flex flex-row items-center space-x-2 text-xs text-gray-500 dark:text-gray-400"
    >
      <span class="font-medium">
        <slot name="footer-by"></slot>
      </span>
      <span class="text-gray-400 dark:text-gray-500">
        <slot name="footer-time"></slot>
      </span>

      <div class="cursor-pointer text-gray-400 dark:text-gray-500 dark:hover:text-gray-300">
        <slot name="footer-actions"></slot>
      </div>
    </footer>
    <main>
      <div class="text-sm leading-relaxed text-pretty text-gray-800 dark:text-gray-200">
        <slot name="text"></slot>
      </div>
      <div>
        <slot name="children"></slot>
      </div>
    </main>
  </article>
</template>
<script setup lang="ts"></script>
<style scoped>
pre,
code {
  max-width: 100%;
  overflow-x: auto;
  background-color: #f3f4f6;
  padding: 0.25rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.dark pre,
.dark code {
  background-color: #1f2937;
}
</style>
