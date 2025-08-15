<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMaxHoursContinuously.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxHoursContinuously.Active">
            <label class="form-label">Amplitude maximale par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMaxHoursContinuously.Maximum_Hours_Continuously">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMaxHoursContinuously',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
