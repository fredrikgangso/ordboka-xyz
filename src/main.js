import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import Dictionary from "./components/Dictionary.vue";

const routes = [{ path: "/", component: Dictionary }];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createApp(App).use(router).mount("#app");
