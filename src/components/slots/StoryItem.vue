<template>
  <article
    class="flex min-w-lg flex-row items-center gap-4 overflow-hidden text-nowrap text-ellipsis"
    tabindex="0"
  >
    <header class="left min-w-4">
      <slot name="index"></slot>
    </header>
    <div class="right flex flex-col">
      <main class="text-pretty">
        <slot name="title"></slot>
      </main>
      <footer class="flex w-full flex-row items-center gap-1 text-sm">
        <div class="h-4 w-4">
          <slot name="footer-icon"></slot>
        </div>
        <slot name="footer-by"></slot>
        <slot name="footer-comments"></slot>
        <slot name="footer-points"></slot>

        <span class="ml-3 text-xs dark:text-gray-300">
          <slot name="footer-time"></slot>
        </span>
      </footer>
    </div>
  </article>
</template>
<script setup lang="ts"></script>
