<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintStudentsSetMaxHoursDailyInInterval">
            <div class="col-5">
                <label class="form-label">Apprenants:</label>
                <select class="form-select" v-model="item.Students">
                    <option value="" disabled>Sélectionnez un groupe</option>
                    <option v-for="student in formData.students.filter(student => student.name !== '')" :value="student.name">{{ student.name }}</option>
                </select>
            </div>
            <div class="col-6">
                <label class="form-label">Heures quotidiennes maximales :</label>
                <input type="number" min="0" class="form-control" v-model="item.Maximum_Hours_Daily">
            </div>
            <div class="col-5">
                <label class="form-label">Heure début intervalle :</label>
                <select class="form-control" v-model="item.Interval_Start_Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Heure fin intervalle :</label>
                <select class="form-control" v-model="item.Interval_End_Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                    <option value="">Fin de journée</option>
                </select>
            </div>
            <div class="col-2 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i>Supprimer
                </button>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsSetMaxHoursDailyInInterval',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintStudentsSetMaxHoursDailyInInterval.push({
                Students: '',
                Interval_Start_Hour: '',
                Interval_End_Hour: '',
                Maximum_Hours_Daily: 1
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintStudentsSetMaxHoursDailyInInterval.splice(index, 1);
        }
    }
}
</script>

<style scoped>
    .item1{
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        background-color: #f8f9fa;
    }
</style>