<template>
    <div class="row p-1 mb-2">
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersNoTwoConsecutiveDays.Active"> Active</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersNoTwoConsecutiveDays',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
