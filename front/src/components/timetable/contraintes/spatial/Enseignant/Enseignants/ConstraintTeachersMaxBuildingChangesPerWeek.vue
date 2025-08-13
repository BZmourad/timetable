<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxBuildingChangesPerWeek.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxBuildingChangesPerWeek.Active">
            <label class="form-label">Changements de bâtiment maximum par semaine :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxBuildingChangesPerWeek.Max_Building_Changes_Per_Week">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMaxBuildingChangesPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
