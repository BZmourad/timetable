<template>
    <div class="row p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxRoomChangesPerDay.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersMaxRoomChangesPerDay.Active">
            <label class="form-label">Changements de salle maximum par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxRoomChangesPerDay.Max_Room_Changes_Per_Day">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMaxRoomChangesPerDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
