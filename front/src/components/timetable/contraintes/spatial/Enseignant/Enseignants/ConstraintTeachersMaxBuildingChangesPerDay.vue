<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxBuildingChangesPerDay.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxBuildingChangesPerDay.Active">
            <label class="form-label">Changements de bâtiment maximum par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxBuildingChangesPerDay.Max_Building_Changes_Per_Day">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMaxBuildingChangesPerDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
