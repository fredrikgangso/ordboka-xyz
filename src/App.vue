<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/">Ordboka</router-link>
      </div>
      <div class="nav-links">
        <!-- <router-link to="/">Home</router-link> -->
        <router-link to="/dictionary">Dictionary</router-link>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>Data powered by Google Sheets</p>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: #34495e;
}

.main-content {
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.footer {
  background-color: #ecf0f1;
  text-align: center;
  padding: 1rem;
  color: #7f8c8d;
}
</style>