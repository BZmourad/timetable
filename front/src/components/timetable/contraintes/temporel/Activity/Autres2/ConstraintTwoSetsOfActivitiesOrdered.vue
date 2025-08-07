<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintTwoSetsOfActivitiesOrdered">
            <div class="col-12 p-2">
                <div class="mb-1">
                    <div class="row">
                        <div class="col-6" v-for="(item2, index2) in item.First_Activities_Ids_Set">
                            <div class="input-group mb-1">
                                <select class="form-select" v-model="item.Activity_Id" >
                                    <option value="" disabled>Sélectionnez une activité</option>
                                    <option v-for="(activity, index) in formData.activities.filter(activity => activity.subject !== '')" :value="index">{{ index }}-{{ activity.subject }}-{{ activity.student }}-{{ activity.teacher }}-{{ activity.balise }}</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="removeFirst_Activities_Ids_Set(index, index2)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addFirst_Activities_Ids_Set(index)">
                        <i class="fas fa-plus me-1"></i>Ajouter
                    </button>
                </div>
            </div>
            <div class="col-12 p-2">
                <div class="mb-1">
                    <div class="row">
                        <div class="col-6" v-for="(item2, index2) in item.Second_Activities_Ids_Set">
                            <div class="input-group mb-1">
                                <select class="form-select" v-model="item.Activity_Id" >
                                    <option value="" disabled>Sélectionnez une activité</option>
                                    <option v-for="(activity, index) in formData.activities.filter(activity => activity.subject !== '')" :value="index">{{ index }}-{{ activity.subject }}-{{ activity.student }}-{{ activity.teacher }}-{{ activity.balise }}</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="removeSecond_Activities_Ids_Set(index, index2)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addSecond_Activities_Ids_Set(index)">
                        <i class="fas fa-plus me-1"></i>Ajouter
                    </button>
                </div>
            </div>
        </div>
        <div class="col-2 mt-4">
            <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                <i class="fas fa-trash me-1"></i>Supprimer
            </button>
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
import toastr from 'toastr';

export default {
    name: 'ConstraintTwoSetsOfActivitiesOrdered',
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
            this.formData.ConstraintTwoSetsOfActivitiesOrdered.push({
                First_Activities_Ids_Set: [{Activity_Id: null}],
                Second_Activities_Ids_Set: [{Activity_Id: null}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintTwoSetsOfActivitiesOrdered.splice(index, 1);
        },
        addFirst_Activities_Ids_Set(index) {
            this.formData.ConstraintTwoSetsOfActivitiesOrdered[index].First_Activities_Ids_Set.push({
                Activity_Id: null
            });
        },
        removeFirst_Activities_Ids_Set(index, i) {
            if (this.formData.ConstraintTwoSetsOfActivitiesOrdered[index].First_Activities_Ids_Set.length > 1) {
                this.formData.ConstraintTwoSetsOfActivitiesOrdered[index].First_Activities_Ids_Set.splice(i, 1);
            } else {
                toastr.warning("Vous devez avoir au moins une activité.");
            }
        },
        addSecond_Activities_Ids_Set(index) {
            this.formData.ConstraintTwoSetsOfActivitiesOrdered[index].Second_Activities_Ids_Set.push({
                Activity_Id: null
            });
        },
        removeSecond_Activities_Ids_Set(index, i) {
            if (this.formData.ConstraintTwoSetsOfActivitiesOrdered[index].Second_Activities_Ids_Set.length > 1) {
                this.formData.ConstraintTwoSetsOfActivitiesOrdered[index].Second_Activities_Ids_Set.splice(i, 1);
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