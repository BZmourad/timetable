<template>
    <div class="mb-3">
        <div class="row p-1 mb-2">
            <div class="col-6">
                <label class="form-label"><input type="checkbox" v-model="formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Active"> Active</label>
            </div>
            <div class="col-6" v-if="formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Active">
                <label class="form-label">Nombre maximal de vides uniques :</label>
                <input type="number" min="0" class="form-control" v-model="formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Max_Single_Gaps">
            </div>
            <div class="col-12 p-2" v-if="formData.ConstraintTeachersMaxGapsPerWeek.Active">
                <div class="mb-4">
                    <div class="row" v-for="(item, index) in formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Selected_Time_Slot">
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
                            <button type="button" class="btn btn-danger btn-sm" @click="removeDuration(index)">
                                <i class="fas fa-trash me-1"></i>Supprimer
                            </button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-add" @click="addDuration()">
                        <i class="fas fa-plus me-1"></i>Ajouter une période
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import toastr from 'toastr';

export default {
    name: 'ConstraintTeachersMaxSingleGapsInSelectedTimeSlots',
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
        addDuration() {
            this.formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Selected_Time_Slot.push({
                Day: '',
                Hour: ''
            });
        },
        removeDuration(index) {
            if (this.formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Selected_Time_Slot.length > 1) {
                this.formData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Selected_Time_Slot.splice(index, 1);
            } else {
                toastr.warning("Vous devez avoir au moins une péride.");
            }
        }
    }
}
</script>
