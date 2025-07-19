<template>
    <div class="mb-4">
        <div class="row" v-for="(item, index) in formData.ConstraintBreakTimes">
            <div class="col-5">
                <label class="form-label">Jour :</label>
                <select class="form-control" v-model="item.Day">
                    <option v-for="day in formData.selectedDays" :key="day" :value="day">{{ day }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Heure :</label>
                <select class="form-control" v-model="item.Hour">
                    <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                </select>
            </div>
            <div class="col-2 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeBreakTime(index)">
                    <i class="fas fa-trash me-1"></i>Supprimer
                </button>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addBreakTime">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
export default {
    name: 'BreakTimesConstraint',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addBreakTime() {
            this.formData.ConstraintBreakTimes.push({
                Day: '',
                Hour: ''
            });
        },
        removeBreakTime(index) {
            this.formData.ConstraintBreakTimes.splice(index, 1);
        },
    }
}
</script>