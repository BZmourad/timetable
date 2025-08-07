<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots">
            <div class="col-9">
                <label class="form-label">Nombre limite d'activités simultanées dans chaque créneau horaire sélectionné :</label>
                <input type="number" min="0" class="form-control" v-model="item.Max_Number_of_Simultaneous_Activities">
            </div>
            <div class="col-3 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i>Supprimer
                </button>
            </div>
            <div class="col-12 p-2">
                <div class="mb-1">
                    <div class="row">
                        <div class="col-6" v-for="(item2, index2) in item.Activity">
                            <div class="input-group mb-1">
                                <select class="form-select" v-model="item.Activity_Id" >
                                    <option value="" disabled>Sélectionnez une activité</option>
                                    <option v-for="(activity, index) in formData.activities.filter(activity => activity.subject !== '')" :value="index">{{ index }}-{{ activity.subject }}-{{ activity.student }}-{{ activity.teacher }}-{{ activity.balise }}</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="removeActivity(index, index2)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addActivity(index)">
                        <i class="fas fa-plus me-1"></i>Ajouter
                    </button>
                </div>
            </div>
            <div class="col-12 p-2">
                <div class="mb-4">
                    <div class="row" v-for="(item2, index2) in item.Selected_Time_Slot">
                        <div class="col-5">
                            <label class="form-label">Jour :</label>
                            <select class="form-control" v-model="item2.Day">
                                <option v-for="day in formData.selectedDays" :key="day" :value="day">{{ day }}</option>
                            </select>
                        </div>
                        <div class="col-5">
                            <label class="form-label">Heure :</label>
                            <select class="form-control" v-model="item2.Hour">
                                <option v-for="period in formData.periods.filter(period => period.name !== '')" :key="period.name" :value="period.name">{{ period.name }}</option>
                            </select>
                        </div>
                        <div class="col-2 mt-4">
                            <button type="button" class="btn btn-danger btn-sm" @click="removeDuration(index, index2)">
                                <i class="fas fa-trash me-1"></i>Supprimer
                            </button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addDuration(index)">
                        <i class="fas fa-plus me-1"></i>Ajouter une période
                    </button>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
import toastr from 'toastr';

export default {
    name: 'ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    mounted() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000
        };
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots.push({
                Max_Number_of_Simultaneous_Activities: 0,
                Activity: [{Activity_Id: null}],
                Selected_Time_Slot: [{Day: '', Hour: ''}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots.splice(index, 1);
        },
        addActivity(index) {
            this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots[index].Activity.push({
                Activity_Id: null
            });
        },
        removeActivity(index, i) {
            if (this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots[index].Activity.length > 1) {
                this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots[index].Activity.splice(i, 1);
            } else {
                toastr.warning("Vous devez avoir au moins une activité.");
            }
        },
        addDuration(index) {
            this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots[index].Selected_Time_Slot.push({
                Day: '',
                Hour: ''
            });
        },
        removeDuration(index, i) {
            if (this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots[index].Selected_Time_Slot.length > 1) {
                this.formData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots[index].Selected_Time_Slot.splice(i, 1);
            } else {
                toastr.warning("Vous devez avoir au moins une péride.");
            }
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