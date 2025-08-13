<template>
    <div class="mb-1">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintTeacherMaxRoomChangesPerDay">
            <div class="col-5">
                <label class="form-label">Enseignant :</label>
                <select class="form-select" v-model="item.Teacher" >
                    <option value="" disabled>Sélectionnez un enseignant</option>
                    <option v-for="teacher in formData.teachers.filter(teacher => teacher.name !== '')" :value="teacher.name">{{ teacher.name }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Changements de salle maximum par jour :</label>
                <input type="number" min="0" class="form-control" v-model="item.Max_Room_Changes_Per_Day">
            </div>
            <div class="col-2 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i>
                </button>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-add" @click="addConstraint">
            <i class="fas fa-plus me-1"></i>Ajouter
        </button>
    </div>
</template>

<script>
export default {
    name: 'ConstraintTeacherMaxRoomChangesPerDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintTeacherMaxRoomChangesPerDay.push({
                Teacher: '',
                Max_Room_Changes_Per_Day: 1
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintTeacherMaxRoomChangesPerDay.splice(index, 1);
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