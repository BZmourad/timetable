<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMinGapsBetweenRoomChanges.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMinGapsBetweenRoomChanges.Active">
            <label class="form-label">Vides minimum entre changements de salle :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMinGapsBetweenRoomChanges.Min_Gaps_Between_Room_Changes">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMinGapsBetweenRoomChanges',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
