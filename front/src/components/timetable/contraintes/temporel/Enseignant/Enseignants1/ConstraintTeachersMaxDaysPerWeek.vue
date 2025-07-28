<template>
    <div class="row p-1 mb-2">
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMinDaysPerWeek.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMinDaysPerWeek.Active">
            <label class="form-label">Jours minimum par semaine :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMinDaysPerWeek.Minimum_Days_Per_Week">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMinDaysPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
