<template>
    <div class="dictionary">
        <header class="page-header">
            <h1>Ordboka</h1>
            <p class="tagline muted">En enkel ordbok drevet av Google Sheets</p>
        </header>

        <!-- Google Sheets Setup Instructions -->
        <div class="setup-notice" v-if="!isConfigured">
            <h3>🔧 Setup Required</h3>
            <p>To connect to Google Sheets, you need to:</p>
            <ol>
                <li>Create a Google Sheets document with columns: Word, Definition, Example</li>
                <li>Make the sheet publicly viewable</li>
                <li>Get the sheet ID from the URL</li>
                <li>Update the SHEET_ID in src/services/googleSheets.js</li>
            </ol>
            <button @click="isConfigured = true" class="continue-btn">
                Continue with Demo Data
            </button>
        </div>

        <!-- Search Bar -->
        <div class="search-section surface" v-if="isConfigured">
            <input v-model="searchTerm" @input="filterEntries" placeholder="Søk etter ord…" class="search-input"
                type="search" aria-label="Søk etter ord" />
            <button @click="loadData" class="refresh-btn" :disabled="loading">
                {{ loading ? 'Laster…' : 'Oppdater data' }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading && isConfigured" class="loading">
            <p>Loading dictionary entries...</p>
        </div>

        <!-- Error State -->
        <div v-if="error && isConfigured" class="error">
            <p>{{ error }}</p>
            <button @click="loadData" class="retry-btn">Retry</button>
        </div>

        <!-- Dictionary Entries -->
        <div v-if="!loading && !error && isConfigured" class="entries">
            <div class="results-info">
                <p>{{ filteredEntries.length }} entries found</p>
            </div>

            <div class="entry-grid">
                <div v-for="entry in filteredEntries" :key="entry.word" class="entry-card">
                    <div class="word-header">
                        <h3 class="word">{{ entry.word }}</h3>
                        <span v-if="entry.wordClass" class="word-class">{{ entry.wordClass }}</span>
                    </div>

                    <div v-if="entry.inflections" class="inflections">
                        <strong>Bøyninger:</strong> {{ entry.inflections }}
                    </div>

                    <div v-if="entry.additionalInfo" class="additional-info">
                        <em>{{ entry.additionalInfo }}</em>
                    </div>

                    <div class="definitions">
                        <p v-if="entry.definition" class="definition"><span class="def-index">1.</span> {{
                            entry.definition }}</p>
                        <p v-if="entry.definition2" class="definition"><span class="def-index">2.</span> {{
                            entry.definition2 }}</p>
                        <p v-if="entry.definition3" class="definition"><span class="def-index">3.</span> {{
                            entry.definition3 }}</p>
                        <p v-if="entry.definition4" class="definition"><span class="def-index">4.</span> {{
                            entry.definition4 }}</p>
                        <p v-if="entry.definition5" class="definition"><span class="def-index">5.</span> {{
                            entry.definition5 }}</p>
                    </div>
                </div>
            </div>

            <div v-if="filteredEntries.length === 0" class="no-results">
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

<style scoped>
.dictionary {
    max-width: 100vh;
    margin: 0 auto;
}

.page-header {
    margin: 0 0 1.25rem 0;
}

.tagline {
    margin-top: 0.25rem;
}

.setup-notice {
    background: #fff8e1;
    border: 1px solid #ffeaa7;
    border-radius: 12px;
    padding: 1.25rem 1.25rem 1rem;
    margin-bottom: 1.5rem;
    text-align: left;
}

.setup-notice h3 {
    color: #7c5900;
    margin-bottom: 0.5rem;
}

.setup-notice ol {
    color: #7c5900;
    margin: 0.5rem 0 0.75rem;
}

.continue-btn {
    background-color: var(--brand);
    color: white;
    padding: 0.55rem 0.9rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

.search-section {

    gap: 0.75rem;
    align-items: center;
    padding: 0.9rem;
    margin-bottom: 1.25rem;
    position: sticky;
    top: 0;
    z-index: 10;
}

.search-input {
    flex-grow: 1;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.refresh-btn {
    padding: 0.75rem 1rem;
    background-color: var(--brand);
    color: #fff;
    border-color: transparent;
    font-weight: 700;
}

.refresh-btn:hover:not(:disabled) {
    background-color: var(--brand-700);
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading,
.error {
    text-align: center;
    padding: 1.25rem;
}

.error {
    color: #c2410c;
}

.retry-btn {
    background-color: #e11d48;
    color: #fff;
    padding: 0.45rem 0.9rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 0.75rem;
}

.results-info {
    margin-bottom: 0.75rem;
    color: var(--muted);
}

.entry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.entry-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 1rem 1rem 1rem;
    border-radius: 14px;
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.entry-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(2, 6, 23, 0.08);
}

.word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
}

.word {
    color: var(--text);
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
}

.word-class {
    background-color: rgba(37, 99, 235, 0.1);
    color: var(--brand-700);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 700;
}

.inflections {
    color: #6b21a8;
    margin-bottom: 0.4rem;
    font-size: 0.92rem;
}

.additional-info {
    color: var(--muted);
    margin-bottom: 0.75rem;
    font-size: 0.92rem;
    font-style: italic;
}

.definitions {
    line-height: 1.6;
}

.definition {

    margin-bottom: 0.5rem;
    font-size: 0.97rem;
}

.def-index {
    display: inline-block;
    width: 1.4rem;
    color: var(--accent);
    font-weight: 700;
}

.no-results {
    text-align: center;
    color: var(--muted);
    padding: 1.5rem;
}

@media (max-width: 768px) {
    .search-section {
        flex-direction: column;
        gap: 0.6rem;
    }

    .entry-grid {
        grid-template-columns: 1fr;
    }
}
</style>
