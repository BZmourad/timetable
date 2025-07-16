<template>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1><i class="fas fa-calendar-alt me-2"></i>Détails de l'Emploi du Temps</h1>
            <div>
                <router-link to="/" class="btn btn-outline-secondary me-2">
                    <i class="fas fa-arrow-left me-1"></i>Retour
                </router-link>
                <router-link :to="'/edit/' + timetable.id" class="btn btn-outline-primary">
                    <i class="fas fa-edit me-1"></i> Modifier
                </router-link>
            </div>
        </div>

        <div class="row">
            <!-- Vertical Tabs Navigation -->
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
                </div>
            </div>

            <!-- Tab Content -->
            <div class="col-md-9">
                <div class="tab-content" id="v-pills-tabContent">
                    <!-- Basic Info Tab -->
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

                    <!-- JSON Data Tab -->
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

                    <!-- XML Data Tab -->
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
                xmlData: ''
            }
        };
    },
    computed: {
        formattedJson() {
            return JSON.stringify(this.timetable.data, null, 2);
        }
    },
    created() {
        this.loadTimetableData();
    },
    methods: {
        async loadTimetableData() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/timetables/${this.id}/show`);
                this.timetable = response.data;
            } catch (error) {
                console.error('Erreur:', error);
                toastr.error('Erreur lors du chargement des données');
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
</style>