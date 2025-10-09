<template>
    <button @click="toggleTheme" class="p-2 rounded-lg border border-border dark:border-border-dark
           bg-surface dark:bg-surface-dark
           hover:bg-accent/10 dark:hover:bg-accent-hover/20
           text-text-primary dark:text-text-primary-dark
           transition-colors duration-300 flex items-center gap-2" aria-label="Toggle theme">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <!-- sun icon -->
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 3v1.5M12 19.5V21m9-9h-1.5M4.5 12H3m15.364-6.364l-1.061 1.061M7.697 16.303l-1.06 1.06m0-10.606l1.06 1.06m9.607 9.607l1.06 1.06M12 8.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <!-- moon icon -->
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M21 12.79A9 9 0 0 1 11.21 3a7.5 7.5 0 0 0 0 15 9 9 0 0 0 9.79-5.21z" />
        </svg>
        <span class="text-sm font-medium">
            {{ isDark ? "Light mode" : "Dark mode" }}
        </span>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark');
});

function toggleTheme() {
    isDark.value = !isDark.value;
    const root = document.documentElement;
    if (isDark.value) {
        root.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        root.classList.remove('dark');
        localStorage.theme = 'light';
    }
}
const root = document.documentElement;
root.classList.add('dark');   // enables dark mode
root.classList.remove('dark'); // disables dark mode
</script>
