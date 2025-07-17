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
                            <button @click="deleteTimetable(timetable.id)" class="btn btn-sm btn-danger">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimetableList',
    data() {
        return {
            timetables: [],
            loading: true
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