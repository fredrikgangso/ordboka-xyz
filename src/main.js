import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import Home from "./components/Home.vue";
import Dictionary from "./components/Dictionary.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/dictionary", component: Dictionary },
];

const router = createRouter({
  history: createWebHistory("/ordboka-xyz/"), // Match your GitHub Pages base
  routes,
});

createApp(App).use(router).mount("#app");
