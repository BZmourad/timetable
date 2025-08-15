<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMaxBuildingChangesPerWeek.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxBuildingChangesPerWeek.Active">
            <label class="form-label">Changements de bâtiment maximum par semaine :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMaxBuildingChangesPerWeek.Max_Building_Changes_Per_Week">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMaxBuildingChangesPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
