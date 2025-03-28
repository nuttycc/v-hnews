<template>
  <article class="min-w-lg flex flex-row items-center gap-4 overflow-hidden text-nowrap text-ellipsis">
    <header class="left min-w-4">
      <slot name="index"></slot>
    </header>
    <div class="right flex flex-col ">
      <main class="text-pretty">
        <slot name="title"></slot>
      </main>
      <footer class="w-full flex flex-row items-baseline gap-1 text-sm">
        <slot name="footer-by"></slot>
        <slot name="footer-comments"></slot>
        <slot name="footer-points"></slot>

        <span class="text-xs ml-3 dark:text-gray-300">
          <slot name="footer-time"></slot>
        </span>
      </footer>
    </div>
  </article>
</template>
<script setup lang="ts">
</script>
