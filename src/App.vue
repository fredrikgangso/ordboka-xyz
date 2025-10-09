<template>
  <div id="app">
    <header class="navbar">
      <div class="container nav-inner">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">Ordboka</router-link>
        </div>
        <div class="nav-links">
          <!-- Reserved for future routes -->
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <p class="muted">Data powered by Google Sheets</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.86));
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(160%) blur(6px);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 0;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--brand);
}

.nav-links {
  display: flex;
  gap: 0.75rem;
}

.nav-links a {
  color: var(--text);
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: rgba(37, 99, 235, 0.08);
}

.main-content {
  flex: 1;
  padding: 2rem 0 2.5rem;
}

.footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.footer-inner {
  padding: 1rem 0;
  text-align: center;
}
</style>
