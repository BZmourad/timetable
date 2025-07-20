<template>
    <div class="row p-1 mb-2">
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxHoursDaily.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxHoursDaily.Active">
            <label class="form-label">Heures quotidiennes maximales :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxHoursDaily.Maximum_Hours_Daily">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMaxHoursDaily',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
