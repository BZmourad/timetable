<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintMinDaysBetweenActivities">
            <div class="col-5">
                <label class="form-label">Nombre minimum de jours :</label>
                <input type="number" min="0" class="form-control" v-model="item.MinDays">
            </div>
            <div class="col-5">
                <label class="form-label"><input type="checkbox" v-model="item.Consecutive_If_Same_Day"> Consécutives si même jour</label>
            </div>
            <div class="col-2 mt-4">
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
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
import toastr from 'toastr';

export default {
    name: 'ConstraintMinDaysBetweenActivities',
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
            this.formData.ConstraintMinDaysBetweenActivities.push({
                MinDays: 0,
                Consecutive_If_Same_Day: false,
                Activity: [{Activity_Id: null}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintMinDaysBetweenActivities.splice(index, 1);
        },
        addActivity(index) {
            this.formData.ConstraintMinDaysBetweenActivities[index].Activity.push({
                Activity_Id: null
            });
        },
        removeActivity(index, i) {
            if (this.formData.ConstraintMinDaysBetweenActivities[index].Activity.length > 1) {
                this.formData.ConstraintMinDaysBetweenActivities[index].Activity.splice(i, 1);
            } else {
                toastr.warning("Vous devez avoir au moins une activité.");
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