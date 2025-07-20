<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintActivityTagPreferredRooms">
            <div class="col-8">
                <label class="form-label">Balise :</label>
                <select class="form-select" v-model="item.Activity_Tag" >
                    <option value="" disabled>Sélectionnez une balise</option>
                    <option v-for="balise in formData.balises.filter(balise => balise.name !== '')" :value="balise.name">{{ balise.name }}</option>
                </select>
            </div>
            <div class="col-3 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i>Supprimer
                </button>
            </div>
            <div class="col-12 p-2">
                <div class="mb-1">
                    <div class="row">
                        <div class="col-6" v-for="(item2, index2) in item.Preferred_Room">
                            <div class="input-group mb-1">
                                <select class="form-control" v-model="item2.Room">
                                    <option value="" disabled>Sélectionnez une salle</option>
                                    <option v-for="room in formData.rooms.filter(room => room.name !== '')" :key="room.name" :value="room.name">{{ room.name }}</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="removeRoom(index, index2)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addRoom(index)">
                        <i class="fas fa-plus me-1"></i>Ajouter une salle
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
    name: 'ConstraintActivityTagPreferredRooms',
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
            this.formData.ConstraintActivityTagPreferredRooms.push({
                Activity_Tag: '',
                Preferred_Room: [{Room: ''}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivityTagPreferredRooms.splice(index, 1);
        },
        addRoom(index) {
            this.formData.ConstraintActivityTagPreferredRooms[index].Preferred_Room.push({
                Room: ''
            });
        },
        removeRoom(index, i) {
            if (this.formData.ConstraintActivityTagPreferredRooms[index].Preferred_Room.length > 1) {
                this.formData.ConstraintActivityTagPreferredRooms[index].Preferred_Room.splice(i, 1);
            } else {
                toastr.warning("Vous devez avoir au moins une salle.");
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