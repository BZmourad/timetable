<template>
    <div class="row item1 p-1 mb-2" >
        <div class="col-6">
            <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Active"> Active</label>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Active">
            <label class="form-label">Jour du Premier créneau horaire:</label>
            <select class="form-control" v-model="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.First_Time_Slot.Day">
                <option v-for="day in formData.selectedDays" :key="day" :value="day">{{ day }}</option>
            </select>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Active">
            <label class="form-label">Heure du Premier créneau horaire :</label>
            <select class="form-control" v-model="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.First_Time_Slot.Hour">
                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
            </select>
        </div>

        <div class="col-6" v-if="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Active">
            <label class="form-label">Jour du Second créneau horaire:</label>
            <select class="form-control" v-model="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Second_Time_Slot.Day">
                <option v-for="day in formData.selectedDays" :key="day" :value="day">{{ day }}</option>
            </select>
        </div>
        <div class="col-6" v-if="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Active">
            <label class="form-label">Heure du Second créneau horaire :</label>
            <select class="form-control" v-model="formData.ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.Second_Time_Slot.Hour">
                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeachersPairOfMutuallyExclusiveTimeSlots',
    props: {
        formData: {
            type: Object,
            required: true
        }
    }
}
</script>
