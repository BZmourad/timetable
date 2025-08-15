<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMaxRoomChangesPerWeek.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsMaxRoomChangesPerWeek.Active">
            <label class="form-label">Changements de salle maximum par semaine :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMaxRoomChangesPerWeek.Max_Room_Changes_Per_Week">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMaxRoomChangesPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
