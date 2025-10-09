<template>
  <div id="app" class="bg-background-1 text-text-1">
    <main class="flex-1 py-8">
      <div class="max-w-5xl mx-auto px-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'App' })
</script>
