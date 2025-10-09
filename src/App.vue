<template>
  <div id="app">
    <header class="sticky top-0 z-10 bg-white/90 border-b border-slate-200 backdrop-blur backdrop-saturate-150">
      <div class="max-w-5xl mx-auto px-4 flex items-center justify-between py-3">
        <router-link to="/" class="text-blue-600 font-extrabold tracking-tight text-xl">Ordboka</router-link>
        <nav class="flex gap-2"><!-- Future routes --></nav>
      </div>
    </header>

    <main class="flex-1 py-8">
      <div class="max-w-5xl mx-auto px-4">
        <router-view />
      </div>
    </main>

    <footer class="border-t bg-white/90">
      <div class="max-w-5xl mx-auto px-4 text-center py-4">
        <p class="text-slate-500">Data powered by Google Sheets</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped></style>
