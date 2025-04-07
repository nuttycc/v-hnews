<template>
  <article class="flex max-w-lvw flex-row items-center gap-4 md:min-w-lg" tabindex="0">
    <header class="left min-w-4">
      <slot name="index"></slot>
    </header>
    <div class="right flex flex-col">
      <main>
        <div class="w-96 overflow-hidden pr-4 text-nowrap text-ellipsis md:w-fit md:text-pretty">
          <slot name="title"></slot>
        </div>
      </main>
      <footer class="flex w-full flex-row items-center gap-1 text-sm">
        <slot name="footer-by"></slot>
        <slot name="footer-comments"></slot>
        <slot name="footer-points"></slot>

        <span class="ml-3 overflow-hidden text-xs text-nowrap text-ellipsis dark:text-gray-300">
          <slot name="footer-time"></slot>
        </span>
      </footer>
    </div>
  </article>
</template>
<script setup lang="ts"></script>
