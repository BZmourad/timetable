<template>
    <div class="row p-1 mb-2" >
        <div class="col-4">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMinRestingHours.Active"> Active</label>
        </div>
        <div class="col-4" v-if="formData.ConstraintTeachersMinRestingHours.Active">
            <label class="form-label">Heures de repos minimum :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMinRestingHours.Minimum_Resting_Hours">
        </div>
        <div class="col-4" v-if="formData.ConstraintTeachersMinRestingHours.Active">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMinRestingHours.Circular"> Circulaire</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMinRestingHours',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
