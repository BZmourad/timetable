<template>
    <div class="row p-1 mb-2" >
        <div class="col-4">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMinRestingHours.Active"> Active</label>
        </div>
        <div class="col-4" v-if="formData.ConstraintStudentsMinRestingHours.Active">
            <label class="form-label">Heures de repos minimum :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintStudentsMinRestingHours.Minimum_Resting_Hours">
        </div>
        <div class="col-4" v-if="formData.ConstraintStudentsMinRestingHours.Active">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintStudentsMinRestingHours.Circular"> Circulaire</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsMinRestingHours',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
