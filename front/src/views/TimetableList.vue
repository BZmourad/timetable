<template>
    <div v-if="loading" class="loading-overlay">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Chargement des données...</p>
    </div>
    <div class="container mt-5">
        <h1 class="mb-4"><i class="fas fa-calendar-alt me-2"></i>Liste des Emplois du Temps</h1>
        <div class="d-flex justify-content-between mb-4">
            <router-link to="/create" class="btn btn-primary">
                <i class="fas fa-plus me-1"></i>Créer un nouvel emploi du temps
            </router-link>
            <!--<router-link to="/upload" class="btn btn-primary">
                <i class="fas fa-download me-1"></i>Upload .FET File
            </router-link>
            <router-link to="/test" class="btn btn-primary">
                test
            </router-link>-->
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Institution</th>
                        <th>Date de création</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="timetable in timetables" :key="timetable.id">
                        <td>{{ timetable.id }}</td>
                        <td>{{ timetable.institutionName }}</td>
                        <td>{{ formatDate(timetable.created_at) }}</td>
                        <td>
                            <router-link :to="'/show/' + timetable.id" class="btn btn-sm btn-warning me-2">
                                <i class="fas fa-eye"></i> Voir
                            </router-link>
                            <router-link :to="'/edit/' + timetable.id" class="btn btn-sm btn-info me-2">
                                <i class="fas fa-edit"></i> Modifier
                            </router-link>
                            <button @click="deleteTimetable(timetable.id)" class="btn btn-sm btn-danger me-2">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                            <button class="btn btn-sm btn-success" @click="openCopyTimetableModal(timetable.id, timetable.institutionName)">
                                <i class="fas fa-copy"></i> Dupliquer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="showCopyModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Dupliquer l'emploi du temps</h5>
                    <button type="button" class="btn-close" @click="closeCopyModal"></button>
                </div>
                <form @submit.prevent="submitCopyForm">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="institutionName" class="form-label">Nom de l'institution *</label>
                            <input type="text" class="form-control" id="institutionName" v-model="copyForm.institutionName" required >
                        </div>
                        <input type="hidden" v-model="copyForm.id">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCopyModal">Annuler</button>
                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ loading ? 'Duplication...' : 'Dupliquer' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimetableList',
    data() {
        return {
            timetables: [],
            loading: true,
            showCopyModal: false,
            copyLoading: false,
            copyForm: {
                id: '',
                institutionName: ''
            }
        }
    },
    created() {
        this.loadTimetables();
    },
    methods: {
        async loadTimetables() {
            this.loading = true;
            try {
                const response = await this.$http.get(`${process.env.VUE_APP_API_BASE_URL}/timetables`);
                this.timetables = response.data;
                this.loading = false;
            } catch (error) {
                console.error('Erreur:', error);
                this.loading = false;
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        async deleteTimetable(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet emploi du temps ?')) {
                try {
                    await this.$http.delete(`${process.env.VUE_APP_API_BASE_URL}/timetables/${id}`);
                    this.loadTimetables();
                } catch (error) {
                    console.error('Erreur:', error);
                    alert('Erreur lors de la suppression');
                }
            }
        },
        openCopyTimetableModal(id, institutionName) {
            this.copyForm.id = id;
            this.copyForm.institutionName = institutionName + ' - Copie';
            this.showCopyModal = true;
        },
        closeCopyModal() {
            this.showCopyModal = false;
            this.copyForm.id = '';
            this.copyForm.institutionName = '';
            this.copyLoading = false;
        },
        async submitCopyForm() {
            if (!this.copyForm.institutionName.trim()) {
                alert('Le nom de l\'institution est obligatoire');
                return;
            }
            this.copyLoading = true;
            try {
                const response = await this.$http.post(
                    `${process.env.VUE_APP_API_BASE_URL}/timetables/copy`,
                    this.copyForm
                );
                // Fermer le modal
                this.closeCopyModal();
                // Afficher un message de succès
                alert('Emploi du temps dupliqué avec succès!');
                // Rafraîchir la liste
                this.loadTimetables();
            } catch (error) {
                console.error('Erreur lors de la duplication:', error);
                alert('Erreur lors de la duplication: ' + 
                    (error.response?.data?.error || error.message || 'Une erreur est survenue'));
            } finally {
                this.copyLoading = false;
            }
        }
    }
}
</script>

<style scoped>
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