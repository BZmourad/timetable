<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintActivityPreferredStartingTime">
            <div class="col-6">
                <label class="form-label">Activité :</label>
                <select class="form-select" v-model="item.Activity_Id" >
                    <option value="" disabled>Sélectionnez une activité</option>
                    <option v-for="(activity, index) in formData.activities.filter(activity => activity.subject !== '')" :value="index">{{ index }}-{{ activity.subject }}-{{ activity.student }}-{{ activity.teacher }}-{{ activity.balise }}</option>
                </select>
            </div>
            <div class="col-6">
                <label class="form-label"><input type="checkbox" v-model="item.Permanently_Locked"> Verrouillage permanent</label>
            </div>
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
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash"></i>
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
    name: 'ConstraintActivityPreferredStartingTime',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintActivityPreferredStartingTime.push({
                Activity_Id: '',
                Permanently_Locked: false,
                Day: '',
                Hour: ''
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivityPreferredStartingTime.splice(index, 1);
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