<template>
    <div class="row p-1 mb-2">
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMaxGapsPerWeek.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxGapsPerWeek.Active">
            <label class="form-label">Vides maximum par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMaxGapsPerWeek.Max_Gaps">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMaxGapsPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
