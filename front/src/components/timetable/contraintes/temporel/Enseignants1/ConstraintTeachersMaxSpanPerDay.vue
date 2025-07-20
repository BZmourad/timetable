<template>
    <div class="row p-1 mb-2" >
        <div class="col-4">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxSpanPerDay.Active"> Active</label>
        </div>
        <div class="col-4" v-if="formData.ConstraintTeachersMaxSpanPerDay.Active">
            <label class="form-label">Amplitude maximale par jour :</label>
            <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxSpanPerDay.Max_Span">
        </div>
        <div class="col-4" v-if="formData.ConstraintTeachersMaxSpanPerDay.Active">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxSpanPerDay.Allow_One_Day_Exception_of_Plus_One"> Autoriser à dépasser de un sur une seule journée</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersMaxSpanPerDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
