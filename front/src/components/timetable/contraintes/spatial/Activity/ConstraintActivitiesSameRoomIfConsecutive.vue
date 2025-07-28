<template>
    <div class="mb-3">
        <div class="row item1 p-1" >
            <div class="col-6" v-for="(item, index) in formData.ConstraintActivitiesSameRoomIfConsecutive">
                <div class="input-group mb-1">
                    <select class="form-select" v-model="item.Activity_Id" >
                        <option value="" disabled>Sélectionnez une balise</option>
                        <option v-for="(activity, index) in formData.activities.filter(activity => activity.subject !== '')" :value="index">{{ index }}-{{ activity.subject }}-{{ activity.student }}-{{ activity.teacher }}-{{ activity.balise }}</option>
                    </select>
                    <button type="button" class="btn btn-danger" @click="removeConstraint(index)">
                        <i class="fas fa-trash"></i>
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
    name: 'ConstraintActivitiesSameRoomIfConsecutive',
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
            this.formData.ConstraintActivitiesSameRoomIfConsecutive.push({
                Activity_Id: null
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivitiesSameRoomIfConsecutive.splice(index, 1);
        },
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