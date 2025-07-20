<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintRoomNotAvailableTimes">
            <div class="col-12">
                <label class="form-label">Salle :</label>
                <select class="form-select" v-model="item.Room" >
                    <option value="" disabled>Sélectionnez une salle</option>
                    <option v-for="room in formData.rooms.filter(room => room.name !== '')" :value="room.name">{{ room.name }}</option>
                </select>
            </div>
            <div class="col-12 p-2">
                <div class="mb-4">
                    <div class="row" v-for="(item2, index2) in item.Not_Available_Time">
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
    name: 'ConstraintRoomNotAvailableTimes',
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
            this.formData.ConstraintRoomNotAvailableTimes.push({
                Room: '',
                Not_Available_Time: [{Day: '', Hour: ''}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintRoomNotAvailableTimes.splice(index, 1);
        },
        addDuration(index) {
            this.formData.ConstraintRoomNotAvailableTimes[index].Not_Available_Time.push({
                Day: '',
                Hour: ''
            });
        },
        removeDuration(index, i) {
            if (this.formData.ConstraintRoomNotAvailableTimes[index].Not_Available_Time.length > 1) {
                this.formData.ConstraintRoomNotAvailableTimes[index].Not_Available_Time.splice(i, 1);
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