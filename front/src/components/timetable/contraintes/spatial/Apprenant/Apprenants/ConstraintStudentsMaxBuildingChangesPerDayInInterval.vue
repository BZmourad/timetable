<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Active">
            <label class="form-label">Changements de bâtiment maximum par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Max_Building_Changes_Per_Day">
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Active">
            <label class="form-label">Heure début intervalle :</label>
            <select class="form-control" v-model="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Interval_Start_Hour">
                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
            </select>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Active">
            <label class="form-label">Heure fin intervalle :</label>
            <select class="form-control" v-model="formData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Interval_End_Hour">
                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                <option value="">Fin de journée</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMaxBuildingChangesPerDayInInterval',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
