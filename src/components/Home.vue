<template>
  <div class="home">
    <h1>Welcome to Ordboka</h1>
    <p class="description">
      A modern dictionary application powered by Google Sheets data.
      Browse and search through dictionary entries with real-time updates.
    </p>

    <div class="features">
      <div class="feature-card">
        <h3>📚 Dictionary Entries</h3>
        <p>Browse comprehensive dictionary data</p>
      </div>

      <div class="feature-card">
        <h3>🔍 Real-time Search</h3>
        <p>Find words and definitions instantly</p>
      </div>

      <div class="feature-card">
        <h3>☁️ Cloud Powered</h3>
        <p>Data sourced from Google Sheets</p>
      </div>
    </div>

    <div class="cta">
      <router-link to="/dictionary" class="cta-button">
        Explore Dictionary
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.description {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #7f8c8d;
}

.cta-button {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>