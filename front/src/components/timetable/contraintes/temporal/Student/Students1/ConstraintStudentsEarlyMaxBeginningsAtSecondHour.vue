<template>
    <div class="row p-1 mb-2">
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsEarlyMaxBeginningsAtSecondHour.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintStudentsEarlyMaxBeginningsAtSecondHour.Active">
            <label class="form-label">Nombre maximum d'arrivées en seconde heure :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsEarlyMaxBeginningsAtSecondHour.Max_Beginnings_At_Second_Hour">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsEarlyMaxBeginningsAtSecondHour',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
