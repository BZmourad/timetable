<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxHoursDailyInInterval.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxHoursDailyInInterval.Active">
            <label class="form-label">Heures quotidiennes maximales :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxHoursDailyInInterval.Maximum_Hours_Daily">
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxHoursDailyInInterval.Active">
            <label class="form-label">Heure début intervalle :</label>
            <select class="form-control" v-model="formData.ConstraintTeachersMaxHoursDailyInInterval.Interval_Start_Hour">
                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
            </select>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxHoursDailyInInterval.Active">
            <label class="form-label">Heure fin intervalle :</label>
            <select class="form-control" v-model="formData.ConstraintTeachersMaxHoursDailyInInterval.Interval_End_Hour">
                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                <option value="">Fin de journée</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMaxHoursDailyInInterval',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
