<template>
  <article class="flex flex-row items-center gap-4 py-1 md:min-w-lg" tabindex="0">
    <header class="left min-w-4">
      <slot name="index"></slot>
    </header>
    <div class="right flex flex-col">
      <main>
        <div class="w-fit text-pretty md:leading-relaxed">
          <slot name="title"></slot>
        </div>
      </main>
      <footer class="flex flex-row flex-wrap items-center justify-start gap-0.5 text-xs">
        <slot name="footer-by"></slot>
        <slot name="footer-comments"></slot>
        <slot name="footer-points"></slot>

        <span class="dark:text-gray-300">
          <slot name="footer-time"></slot>
        </span>
      </footer>
    </div>
  </article>
</template>
<script setup lang="ts"></script>
