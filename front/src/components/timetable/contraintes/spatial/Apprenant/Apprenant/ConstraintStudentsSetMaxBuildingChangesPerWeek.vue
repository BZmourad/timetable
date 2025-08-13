<template>
    <div class="mb-1">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintStudentsSetMaxBuildingChangesPerWeek">
            <div class="col-5">
                <label class="form-label">Apprenants:</label>
                <select class="form-select" v-model="item.Students">
                    <option value="" disabled>Sélectionnez un groupe</option>
                    <option v-for="student in students.filter(student => student.name !== '')" :value="student.name">{{ student.name }}</option>
                </select>
            </div>
            <div class="col-5">
                <label class="form-label">Changements de bâtiment maximum par semaine :</label>
                <input type="number" min="0" class="form-control" v-model="item.Max_Building_Changes_Per_Week">
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
    name: 'ConstraintStudentsSetMaxBuildingChangesPerWeek',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintStudentsSetMaxBuildingChangesPerWeek.push({
                Teacher: '',
                Max_Building_Changes_Per_Week: 1
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintStudentsSetMaxBuildingChangesPerWeek.splice(index, 1);
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