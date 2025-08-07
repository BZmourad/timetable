<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintActivitiesMaxHourlySpan">
            <div class="col-9">
                <label class="form-label">Amplitude horaire maximale :</label>
                <input type="number" min="0" class="form-control" v-model="item.MaxHourlySpan">
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
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
import toastr from 'toastr';

export default {
    name: 'ConstraintActivitiesMaxHourlySpan',
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
            this.formData.ConstraintActivitiesMaxHourlySpan.push({
                MaxHourlySpan: 0,
                Activity: [{Activity_Id: null}],
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivitiesMaxHourlySpan.splice(index, 1);
        },
        addActivity(index) {
            this.formData.ConstraintActivitiesMaxHourlySpan[index].Activity.push({
                Activity_Id: null
            });
        },
        removeActivity(index, i) {
            if (this.formData.ConstraintActivitiesMaxHourlySpan[index].Activity.length > 1) {
                this.formData.ConstraintActivitiesMaxHourlySpan[index].Activity.splice(i, 1);
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