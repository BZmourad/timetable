<template>
    <div class="mb-3">
        <div class="row item1 p-1" v-for="(item, index) in formData.ConstraintActivitiesBeginStudentsDay">
            <div class="col-6">
                <label class="form-label">Matière:</label>
                <select class="form-select" v-model="item.Subject" >
                    <option value="" disabled>Sélectionnez une matière</option>
                    <option v-for="subject in formData.subjects.filter(subject => subject.name !== '')" :value="subject.name">{{ subject.name }}</option>
                </select>
            </div>
            <div class="col-6">
                <label class="form-label">Apprenants:</label>
                <select class="form-select" v-model="item.Students">
                    <option value="" disabled>Sélectionnez un groupe</option>
                    <option v-for="student in formData.students.filter(student => student.name !== '')" :value="student.name">{{ student.name }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Enseignant:</label>
                <select class="form-select" v-model="item.Teacher" >
                    <option value="" disabled>Sélectionnez un enseignant</option>
                    <option v-for="teacher in formData.teachers.filter(teacher => teacher.name !== '')" :value="teacher.name">{{ teacher.name }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Balise:</label>
                <select class="form-select" v-model="item.Activity_Tag" >
                    <option value="" disabled>Sélectionnez une balise</option>
                    <option v-for="balise in formData.balises.filter(balise => balise.name !== '')" :value="balise.name" >{{ balise.name }}</option>
                </select>
            </div>
            <div class="col-2 mt-4">
                <button type="button" class="btn btn-danger btn-sm" @click="removeConstraint(index)">
                    <i class="fas fa-trash me-1"></i> Supprimer
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
    name: 'ConstraintActivitiesBeginStudentsDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintActivitiesBeginStudentsDay.push({
                Teacher: '',
                Students: '',
                Subject: '',
                Activity_Tag: ''
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintActivitiesBeginStudentsDay.splice(index, 1);
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