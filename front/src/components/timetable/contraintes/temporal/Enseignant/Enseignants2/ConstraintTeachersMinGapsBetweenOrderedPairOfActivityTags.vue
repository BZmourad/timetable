<template>
    <div class="mb-3">
        <div class="row item1 p-1 mb-2" v-for="(item, index) in formData.ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags">
            <div class="col-3">
                <label class="form-label">Vides minimum :</label>
                <input type="number" min="0" class="form-control" v-model="item.MinGaps">
            </div>
            <div class="col-4">
                <label class="form-label">Première balise :</label>
                <select class="form-control" v-model="item.First_Activity_Tag">
                    <option v-for="balise in formData.balises.filter(balise => balise.name !== '')" :key="balise.name" :value="balise.name">{{ balise.name }}</option>
                </select>
            </div>
            <div class="col-4">
                <label class="form-label">Seconde balise :</label>
                <select class="form-control" v-model="item.Second_Activity_Tag">
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
    name: 'ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        addConstraint() {
            this.formData.ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags.push({
                MinGaps: 0,
                First_Activity_Tag: '',
                Second_Activity_Tag: ''
            });
        },
        removeConstraint(index) {
            this.formData.ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags.splice(index, 1);
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