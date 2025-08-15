<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots">
            <div class="col-12">
                <label class="form-label">Apprenants:</label>
                <select class="form-select" v-model="item.Students">
                    <option value="" disabled>Sélectionnez un groupe</option>
                    <option v-for="student in formData.students.filter(student => student.name !== '')" :value="student.name">{{ student.name }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Jour du Premier créneau horaire:</label>
                <select class="form-control" v-model="item.First_Time_Slot.Day">
                    <option v-for="day in formData.selectedDays" :key="day" :value="day">{{ day }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Heure du Premier créneau horaire :</label>
                <select class="form-control" v-model="item.First_Time_Slot.Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                </select>
            </div>

            <div class="col-5">
                <label class="form-label">Jour du Second créneau horaire:</label>
                <select class="form-control" v-model="item.Second_Time_Slot.Day">
                    <option v-for="day in formData.selectedDays" :key="day" :value="day">{{ day }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Heure du Second créneau horaire :</label>
                <select class="form-control" v-model="item.Second_Time_Slot.Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                </select>
            </div>

            <div class="col-2 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i>Supprimer
                </button>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
export default {
    name: 'ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots.push({
                Students: '',
                First_Time_Slot: {
                    Day: '',
                    Hour: ''
                },
                Second_Time_Slot: {
                    Day: '',
                    Hour: ''
                }
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots.splice(index, 1);
        }
    }
}
</script>

<style scoped>
    .item1{
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        background-color: #f8f9fa;
    }
</style>