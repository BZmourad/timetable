<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintRoomMaxActivityTagsPerDayFromSet">
            <div class="col-6">
                <label class="form-label">Salle :</label>
                <select class="form-select" v-model="item.Room" >
                    <option value="" disabled>Sélectionnez une salle</option>
                    <option v-for="room in formData.rooms.filter(room => room.name !== '')" :value="room.name">{{ room.name }}</option>
                </select>
            </div>
            <div class="col-6">
                <label class="form-label">Nombre maximum de codes activité :</label>
                <input type="number" min="0" class="form-control" v-model="item.Maximum_Allowed_Activity_Tags">
            </div>
            <div class="col-12 p-2">
                <div class="mb-4">
                    <div class="row">
                        <div class="col-6" v-for="(item2, index2) in item.Activity_Tags">
                            <div class="input-group mb-3">
                                <select class="form-control" v-model="item2.Activity_Tag">
                                    <option v-for="balise in formData.balises.filter(balise => balise.name !== '')" :key="balise.name" :value="balise.name">{{ balise.name }}</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="removeBalise(index, index2)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addBalise(index)">
                        <i class="fas fa-plus me-1"></i>Ajouter une balise
                    </button>
                </div>
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
import toastr from 'toastr';

export default {
    name: 'ConstraintRoomMaxActivityTagsPerDayFromSet',
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
            this.formData.ConstraintRoomMaxActivityTagsPerDayFromSet.push({
                Room: '',
                Maximum_Allowed_Activity_Tags: 0,
                Activity_Tags: [{Activity_Tag: ''},{Activity_Tag: ''}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintRoomMaxActivityTagsPerDayFromSet.splice(index, 1);
        },
        addBalise(index) {
            this.formData.ConstraintRoomMaxActivityTagsPerDayFromSet[index].Activity_Tags.push({
                Activity_Tag: ''
            });
        },
        removeBalise(index, i) {
            if (this.formData.ConstraintRoomMaxActivityTagsPerDayFromSet[index].Activity_Tags.length > 1) {
                this.formData.ConstraintRoomMaxActivityTagsPerDayFromSet[index].Activity_Tags.splice(index, 1);
            } else {
                toastr.warning("Vous devez avoir au moins 1 balises.");
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