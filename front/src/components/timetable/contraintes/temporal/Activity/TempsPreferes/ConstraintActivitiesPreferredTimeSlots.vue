<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintActivitiesPreferredTimeSlots">
            <div class="col-4">
                <label class="form-label">Matière:</label>
                <select class="form-select" v-model="item.Subject" >
                    <option value="" disabled>Sélectionnez une matière</option>
                    <option v-for="subject in formData.subjects.filter(subject => subject.name !== '')" :value="subject.name">{{ subject.name }}</option>
                </select>
            </div>
            <div class="col-4">
                <label class="form-label">Apprenants:</label>
                <select class="form-select" v-model="item.Students">
                    <option value="" disabled>Sélectionnez un groupe</option>
                    <option v-for="student in formData.students.filter(student => student.name !== '')" :value="student.name">{{ student.name }}</option>
                </select>
            </div>
            <div class="col-4">
                <label class="form-label">Enseignant:</label>
                <select class="form-select" v-model="item.Teacher" >
                    <option value="" disabled>Sélectionnez un enseignant</option>
                    <option v-for="teacher in formData.teachers.filter(teacher => teacher.name !== '')" :value="teacher.name">{{ teacher.name }}</option>
                </select>
            </div>
            <div class="col-4">
                <label class="form-label">Balise:</label>
                <select class="form-select" v-model="item.Activity_Tag" >
                    <option value="" disabled>Sélectionnez une balise</option>
                    <option v-for="balise in formData.balises.filter(balise => balise.name !== '')" :value="balise.name" >{{ balise.name }}</option>
                </select>
            </div>
            <div class="col-4">
                <label class="form-label">Durée :</label>
                <input type="number" min="0" class="form-control" v-model="item.Duration">
            </div>
            <div class="col-3 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i> Supprimer
                </button>
            </div>
            <div class="col-12 p-2">
                <div class="mb-4">
                    <div class="row" v-for="(item2, index2) in item.Preferred_Time_Slot">
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
                                <i class="fas fa-trash"></i>
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
    name: 'ConstraintActivitiesPreferredTimeSlots',
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
            this.formData.ConstraintActivitiesPreferredTimeSlots.push({
                Teacher: '',
                Students: '',
                Subject: '',
                Activity_Tag: '',
                Duration: 0,
                Preferred_Time_Slot: [{Day: '', Hour: ''}]
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivitiesPreferredTimeSlots.splice(index, 1);
        },
        addDuration(index) {
            this.formData.ConstraintRoomNotAvailableTimes[index].Preferred_Time_Slot.push({
                Day: '',
                Hour: ''
            });
        },
        removeDuration(index, i) {
            if (this.formData.ConstraintRoomNotAvailableTimes[index].Preferred_Time_Slot.length > 1) {
                this.formData.ConstraintRoomNotAvailableTimes[index].Preferred_Time_Slot.splice(i, 1);
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