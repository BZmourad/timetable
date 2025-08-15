<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMinGapsBetweenBuildingChanges.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMinGapsBetweenBuildingChanges.Active">
            <label class="form-label">Vides minimum entre changements de bâtiment :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMinGapsBetweenBuildingChanges.Min_Gaps_Between_Building_Changes">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMinGapsBetweenBuildingChanges',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
