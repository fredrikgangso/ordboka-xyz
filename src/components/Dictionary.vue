<template>
    <div class="dictionary">
        <h1>Dictionary</h1>

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
        <div class="search-section" v-if="isConfigured">
            <input v-model="searchTerm" @input="filterEntries" placeholder="Search for words..." class="search-input" />
            <button @click="loadData" class="refresh-btn" :disabled="loading">
                {{ loading ? 'Loading...' : 'Refresh Data' }}
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
                        <p v-if="entry.definition" class="definition">
                            <strong>1.</strong> {{ entry.definition }}
                        </p>
                        <p v-if="entry.definition2" class="definition">
                            <strong>2.</strong> {{ entry.definition2 }}
                        </p>
                        <p v-if="entry.definition3" class="definition">
                            <strong>3.</strong> {{ entry.definition3 }}
                        </p>
                        <p v-if="entry.definition4" class="definition">
                            <strong>4.</strong> {{ entry.definition4 }}
                        </p>
                        <p v-if="entry.definition5" class="definition">
                            <strong>5.</strong> {{ entry.definition5 }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="filteredEntries.length === 0" class="no-results">
                <p>No entries found for "{{ searchTerm }}"</p>
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
    max-width: 1000px;
    margin: 0 auto;
}

.setup-notice {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: left;
}

.setup-notice h3 {
    color: #856404;
    margin-bottom: 1rem;
}

.setup-notice ol {
    color: #856404;
    margin: 1rem 0;
}

.continue-btn {
    background-color: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s;
}

.search-input:focus {
    border-color: #3498db;
}

.refresh-btn {
    padding: 0.75rem 1.5rem;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.refresh-btn:hover:not(:disabled) {
    background-color: #229954;
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading,
.error {
    text-align: center;
    padding: 2rem;
}

.error {
    color: #e74c3c;
}

.retry-btn {
    background-color: #e74c3c;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
}

.results-info {
    margin-bottom: 1rem;
    color: #7f8c8d;
}

.entry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.entry-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.entry-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
}

.word {
    color: #2c3e50;
    margin: 0;
    font-size: 1.3rem;
    font-weight: bold;
}

.word-class {
    background-color: #3498db;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

.inflections {
    color: #8e44ad;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.additional-info {
    color: #95a5a6;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    font-style: italic;
}

.definitions {
    line-height: 1.6;
}

.definition {
    color: #34495e;
    margin-bottom: 0.7rem;
    font-size: 0.95rem;
}

.definition strong {
    color: #e67e22;
    margin-right: 0.5rem;
}

.no-results {
    text-align: center;
    color: #7f8c8d;
    padding: 2rem;
}

@media (max-width: 768px) {
    .search-section {
        flex-direction: column;
    }

    .entry-grid {
        grid-template-columns: 1fr;
    }
}
</style>