<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintTeacherMaxSpanPerDay">
            <div class="col-4">
                <label class="form-label">Enseignant :</label>
                <select class="form-select" v-model="item.Teacher" >
                    <option value="" disabled>Sélectionnez un enseignant</option>
                    <option v-for="teacher in formData.teachers.filter(teacher => teacher.name !== '')" :value="teacher.name">{{ teacher.name }}</option>
                </select>
            </div>
            <div class="col-3">
                <label class="form-label">Amplitude maximale par jour :</label>
                <input type="number" min="0" class="form-control" v-model="item.Max_Span">
            </div>
            <div class="col-3">
                <label class="form-label"><input type="checkbox" v-model="item.Allow_One_Day_Exception_of_Plus_One"> Autoriser à dépasser de un sur une seule journée</label>
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
export default {
    name: 'ConstraintTeacherMaxSpanPerDay',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintTeacherMaxSpanPerDay.push({
                Teacher: '',
                Max_Span: 1,
                Allow_One_Day_Exception_of_Plus_One: false
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintTeacherMaxSpanPerDay.splice(index, 1);
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