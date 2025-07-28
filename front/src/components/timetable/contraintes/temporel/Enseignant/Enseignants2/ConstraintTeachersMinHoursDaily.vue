<template>
    <div class="row p-1 mb-2">
        <div class="col-4">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMinHoursDaily.Active"> Active</label>
        </div>
        <div class="col-4" v-if="formData.ConstraintTeachersMinHoursDaily.Active">
            <label class="form-label">Heures quotidiennes minimales :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMinHoursDaily.Minimum_Hours_Daily">
        </div>
        <div class="col-4" v-if="formData.ConstraintTeachersMinHoursDaily.Active">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMinHoursDaily.Allow_Empty_Days"> Autoriser jours vides</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMinHoursDaily',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
