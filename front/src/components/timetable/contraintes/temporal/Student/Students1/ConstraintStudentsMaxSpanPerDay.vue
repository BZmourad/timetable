<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMaxSpanPerDay.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxSpanPerDay.Active">
            <label class="form-label">Amplitude maximale par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMaxSpanPerDay.Max_Span">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMaxSpanPerDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
