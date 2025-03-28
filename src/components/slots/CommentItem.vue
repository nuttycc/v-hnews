<template>
  <article class="border-l pl-4">
    <footer class="flex flex-row justify-end">
      <slot name="footer-by"></slot>
      <slot name="footer-time"></slot>
    </footer>
    <main>
      <div class="text-x text-pretty">
        <slot name="text"></slot>
      </div>
      <slot name="children"></slot>
    </main>
  </article>
</template>
<script setup lang="ts">
</script>
<style scoped>

pre, code{
  max-width: 100%;
  overflow-x: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
