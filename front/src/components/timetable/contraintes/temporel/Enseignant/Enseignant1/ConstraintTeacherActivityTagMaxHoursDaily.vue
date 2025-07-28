<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintTeacherActivityTagMaxHoursDaily">
            <div class="col-4">
                <label class="form-label">Enseignant :</label>
                <select class="form-select" v-model="item.Teacher" >
                    <option value="" disabled>Sélectionnez un enseignant</option>
                    <option v-for="teacher in formData.teachers.filter(teacher => teacher.name !== '')" :value="teacher.name">{{ teacher.name }}</option>
                </select>
            </div>
            <div class="col-3">
                <label class="form-label">Heures quotidiennes maximales :</label>
                <input type="number" min="0" class="form-control" v-model="item.Maximum_Hours_Daily">
            </div>
            <div class="col-4">
                <label class="form-label">Balise :</label>
                <select class="form-control" v-model="item.Activity_Tag">
                    <option v-for="balise in formData.balises.filter(balise => balise.name !== '')" :key="balise.name" :value="balise.name">{{ balise.name }}</option>
                </select>
            </div>
            <div class="col-1 mt-4">
                <button type="button" class="btn btn-danger" @click="removeConstraint(index)">
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
    name: 'ConstraintTeacherActivityTagMaxHoursDaily',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintTeacherActivityTagMaxHoursDaily.push({
                Teacher: '',
                Maximum_Hours_Daily: 0,
                Activity_Tag: ''
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintTeacherActivityTagMaxHoursDaily.splice(index, 1);
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