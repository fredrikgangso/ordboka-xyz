<template>
    <div class="max-w-5xl mx-auto">
        <header class="mb-5">
            <h1 class="text-2xl font-extrabold tracking-tight">Ordboka</h1>
            <p class="mt-1 text-slate-500 text-sm">En enkel ordbok drevet av Google Sheets</p>
        </header>

        <!-- Google Sheets Setup Instructions -->
        <div v-if="!isConfigured" class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-amber-800">
            <h3 class="font-bold mb-2">🔧 Setup Required</h3>
            <p class="mb-2">To connect to Google Sheets, you need to:</p>
            <ol class="list-decimal list-inside space-y-1">
                <li>Create a Google Sheets document with columns: Word, Definition, Example</li>
                <li>Make the sheet publicly viewable</li>
                <li>Get the sheet ID from the URL</li>
                <li>Update the SHEET_ID in src/services/googleSheets.js</li>
            </ol>
            <button @click="isConfigured = true" class="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-white font-semibold hover:bg-blue-700">
                Continue with Demo Data
            </button>
        </div>

        <!-- Search Bar -->
        <div v-if="isConfigured" class="flex items-center gap-3 p-3 mb-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <input
                v-model="searchTerm"
                @input="filterEntries"
                placeholder="Søk etter ord…"
                class="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="search"
                aria-label="Søk etter ord"
            />
            <button @click="loadData" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 disabled:opacity-60" :disabled="loading">
                {{ loading ? 'Laster…' : 'Oppdater data' }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading && isConfigured" class="text-center p-5">
            <p>Loading dictionary entries...</p>
        </div>

        <!-- Error State -->
        <div v-if="error && isConfigured" class="text-center p-5 text-rose-600">
            <p>{{ error }}</p>
            <button @click="loadData" class="mt-3 inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-white font-semibold hover:bg-rose-700">Retry</button>
        </div>

        <!-- Dictionary Entries -->
        <div v-if="!loading && !error && isConfigured">
            <div class="mb-2 text-slate-500 text-sm">
                <p>{{ filteredEntries.length }} entries found</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="entry in filteredEntries" :key="entry.word" class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                    <div class="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                        <h3 class="text-slate-900 m-0 text-lg font-extrabold tracking-tight">{{ entry.word }}</h3>
                        <span v-if="entry.wordClass" class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{{ entry.wordClass }}</span>
                    </div>

                    <div v-if="entry.inflections" class="text-purple-700 mb-1 text-sm">
                        <strong>Bøyninger:</strong> {{ entry.inflections }}
                    </div>

                    <div v-if="entry.additionalInfo" class="text-slate-500 italic text-sm mb-2">
                        <em>{{ entry.additionalInfo }}</em>
                    </div>

                    <div class="leading-relaxed">
                        <p v-if="entry.definition" class="text-slate-800 mb-1.5 text-[0.97rem]"><span class="inline-block w-5 font-bold text-amber-500">1.</span> {{ entry.definition }}</p>
                        <p v-if="entry.definition2" class="text-slate-800 mb-1.5 text-[0.97rem]"><span class="inline-block w-5 font-bold text-amber-500">2.</span> {{ entry.definition2 }}</p>
                        <p v-if="entry.definition3" class="text-slate-800 mb-1.5 text-[0.97rem]"><span class="inline-block w-5 font-bold text-amber-500">3.</span> {{ entry.definition3 }}</p>
                        <p v-if="entry.definition4" class="text-slate-800 mb-1.5 text-[0.97rem]"><span class="inline-block w-5 font-bold text-amber-500">4.</span> {{ entry.definition4 }}</p>
                        <p v-if="entry.definition5" class="text-slate-800 mb-1.5 text-[0.97rem]"><span class="inline-block w-5 font-bold text-amber-500">5.</span> {{ entry.definition5 }}</p>
                    </div>
                </div>
            </div>

            <div v-if="filteredEntries.length === 0" class="text-center text-slate-500 p-6">
                <p>Ingen oppføringer for "{{ searchTerm }}"</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { googleSheetsService } from '../services/googleSheets.js'

export default {
    name: 'Dictionary',
    setup() {
        const entries = ref([])
        const filteredEntries = ref([])
        const searchTerm = ref('')
        const loading = ref(false)
        const error = ref('')
        const isConfigured = ref(false)

        const loadData = async () => {
            loading.value = true
            error.value = ''

            try {
                const data = await googleSheetsService.fetchData()
                entries.value = data
                filteredEntries.value = data
            } catch (err) {
                error.value = 'Failed to load data from Google Sheets. Please check your configuration.'
                console.error('Error loading data:', err)
            } finally {
                loading.value = false
            }
        }

        const filterEntries = () => {
            if (!searchTerm.value) {
                filteredEntries.value = entries.value
                return
            }

            const term = searchTerm.value.toLowerCase()
            filteredEntries.value = entries.value.filter(entry => {
                return entry.word.toLowerCase().includes(term) ||
                    (entry.definition && entry.definition.toLowerCase().includes(term)) ||
                    (entry.definition2 && entry.definition2.toLowerCase().includes(term)) ||
                    (entry.definition3 && entry.definition3.toLowerCase().includes(term)) ||
                    (entry.definition4 && entry.definition4.toLowerCase().includes(term)) ||
                    (entry.definition5 && entry.definition5.toLowerCase().includes(term)) ||
                    (entry.wordClass && entry.wordClass.toLowerCase().includes(term)) ||
                    (entry.inflections && entry.inflections.toLowerCase().includes(term)) ||
                    (entry.additionalInfo && entry.additionalInfo.toLowerCase().includes(term))
            })
        }

        onMounted(() => {
            // Check if Google Sheets is configured
            if (googleSheetsService.isConfigured()) {
                isConfigured.value = true
                loadData()
            }
        })

        return {
            entries,
            filteredEntries,
            searchTerm,
            loading,
            error,
            isConfigured,
            loadData,
            filterEntries
        }
    }
}
</script>
