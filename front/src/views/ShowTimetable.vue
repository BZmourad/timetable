<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-secondary">
        <div class="container-fluid">
            <h2 class="navbar-brand text-white"><i class="fas fa-calendar-alt me-2"></i>Détails de l'Emploi du Temps</h2>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <div class="navbar-nav">
                    <router-link to="/" class="btn btn-white me-2">
                        <i class="fas fa-arrow-left me-1"></i>Retour
                    </router-link>
                    <router-link :to="'/edit/' + id" class="btn btn-primary">
                        <i class="fas fa-edit me-1"></i> Modifier
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
    <div class="p-2 mt-4">
        <!-- Loading Overlay -->
        <div v-if="loading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Chargement des données...</p>
        </div>

        <div v-if="warnings" class="row p-4">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <p style="white-space: pre-line;">{{ warnings }}</p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <button class="nav-link active" id="v-pills-info-tab" data-bs-toggle="pill" data-bs-target="#v-pills-info" type="button" role="tab">
                        <i class="fas fa-info-circle me-2"></i>Informations de base
                    </button>
                    <button class="nav-link" id="v-pills-json-tab" data-bs-toggle="pill" data-bs-target="#v-pills-json" type="button" role="tab">
                        <i class="fas fa-code me-2"></i>Données JSON
                    </button>
                    <button class="nav-link" id="v-pills-xml-tab" data-bs-toggle="pill" data-bs-target="#v-pills-xml" type="button" role="tab">
                        <i class="fas fa-file-code me-2"></i>Données XML
                    </button>
                    <button class="nav-link" id="v-pills-result-tab" data-bs-toggle="pill" data-bs-target="#v-pills-result" type="button" role="tab">
                        <i class="fas fa-calendar-day me-2"></i>Résultat final
                    </button>
                </div>
            </div>
            <div class="col-md-9">
                <div class="tab-content" id="v-pills-tabContent">
                    <div class="tab-pane fade show active" id="v-pills-info" role="tabpanel">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Informations de base</h5>
                            </div>
                            <div class="card-body">
                                <p v-if="timetable.data"><strong>Institution:</strong> {{ timetable.data.institutionName }}</p>
                                <p><strong>Créé le:</strong> {{ formatDate(timetable.created_at) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="v-pills-json" role="tabpanel">
                        <div class="card">
                            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h5 class="mb-0"><i class="fas fa-code me-2"></i>Données complètes (JSON)</h5>
                                <button @click="copyJSON" class="btn btn-sm btn-light">
                                    <i class="fas fa-copy"></i> Copier
                                </button>
                            </div>
                            <div class="card-body">
                                <pre class="p-3 bg-light rounded">{{ formattedJson }}</pre>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="v-pills-xml" role="tabpanel">
                        <div class="card">
                            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h5 class="mb-0"><i class="fas fa-file-code me-2"></i>Données au format XML (FET)</h5>
                                <button @click="copyXml" class="btn btn-sm btn-light">
                                    <i class="fas fa-copy"></i> Copier
                                </button>
                            </div>
                            <div class="card-body">
                                <pre class="p-3 bg-light rounded">{{ timetable.xmlData }}</pre>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="v-pills-result" role="tabpanel">
                        <div class="card">
                            <div class="card-body">
                                <div v-if="timetable.output_html">
                                    <iframe 
                                        :src="timetable.output_html" 
                                        frameborder="0" 
                                        style="width: 100%; height: 800px;"
                                        @load="iframeLoaded"
                                        @error="iframeError"
                                    ></iframe>
                                </div>
                                
                                <div v-else class="alert alert-warning">
                                    No HTML output was generated.
                                    <button @click="loadTimetableData" class="btn btn-sm btn-primary ms-2">
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import toastr from 'toastr';

export default {
    name: 'ShowTimetable',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            timetable: {
                data: {},
                created_at: '',
                xmlData: '',
                output_html: null
            },
            loading: true,
            error: null,
            warnings: null
        };
    },
    computed: {
        formattedJson() {
            return JSON.stringify(this.timetable.data, null, 2);
        }
    },
    created() {
        this.generateTimetable();
    },
    beforeUnmount() {
        if (this.currentRequest) {
            this.currentRequest.cancel();
        }
    },
    methods: {
        async loadTimetableData() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/timetables/${this.id}/show`
                );
                console.log('response', response);
                // Transform output path if needed
                this.timetable = response.data;
                this.loading = false;
            } catch (error) {
                console.error('Error:', error);
                this.error = 'Failed to load timetable data';
                this.loading = false;
                toastr.error(this.error);
            }
        },
        async generateTimetable() {
            this.loading = true;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/timetables/${this.id}/data`);
                console.log('response', response);
                this.timetable = response.data;
                if (response.data.warnings && response.data.warnings != '') {
                    this.warnings = response.data.warnings;
                    this.warnings = this.warnings.replace('FET', "TimeTable");
                }
                this.loading = false;
            } catch (error) {
                console.error('Error:', error);
                this.loading = false;
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('fr-FR');
        },
        async copyXml() {
            try {
                await navigator.clipboard.writeText(this.timetable.xmlData);
                toastr.success('XML copié dans le presse-papier');
            } catch (error) {
                console.error('Erreur lors de la copie:', error);
                toastr.error('Échec de la copie');
            }
        },

        async copyJSON() {
            try {
                await navigator.clipboard.writeText(this.formattedJson);
                toastr.success('XML copié dans le presse-papier');
            } catch (error) {
                console.error('Erreur lors de la copie:', error);
                toastr.error('Échec de la copie');
            }
        },
        iframeLoaded() {
            this.loading = false;
        },
        iframeError() {
            this.loading = false;
            toastr.error('Failed to load timetable preview');
        }
    }
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css';
.nav-pills .nav-link {
    text-align: left;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.3s ease;
}

.nav-pills .nav-link.active {
    background-color: #0d6efd;
    color: white;
}

.nav-pills .nav-link:not(.active) {
    color: #495057;
    background-color: #f8f9fa;
}

.nav-pills .nav-link:not(.active):hover {
    background-color: #e9ecef;
}

.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 500px;
    overflow-y: auto;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-overlay p {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #333;
}
</style>