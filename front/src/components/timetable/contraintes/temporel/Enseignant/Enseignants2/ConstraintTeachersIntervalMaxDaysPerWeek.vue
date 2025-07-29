<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintTeacherIntervalMaxDaysPerWeek">
            <div class="col-3">
                <label class="form-label">Jours maximum par semaine :</label>
                <input type="number" min="0" class="form-control" v-model="item.Max_Days_Per_Week">
            </div>
            <div class="col-4">
                <label class="form-label">Heure début intervalle :</label>
                <select class="form-control" v-model="item.Interval_Start_Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                </select>
            </div>
            <div class="col-4">
                <label class="form-label">Heure fin intervalle :</label>
                <select class="form-control" v-model="item.Interval_End_Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                    <option value="">Fin de journée</option>
                </select>
            </div>
            <div class="col-1 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash"></i>
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
    name: 'ConstraintTeacherIntervalMaxDaysPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintTeacherIntervalMaxDaysPerWeek.push({
                Interval_Start_Hour: '',
                Interval_End_Hour: '',
                Max_Days_Per_Week: 1
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintTeacherIntervalMaxDaysPerWeek.splice(index, 1);
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