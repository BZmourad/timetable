<template>
  <div class="mt-5">
    <div class="subjects-container">
      <div class="row">
        <div class="col-md-6" v-for="(subject, index) in subjects" :key="'subject-'+index">
            <div class="input-group mb-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors[index]}" :id="'subject-name-' + index" v-model="subject.name" placeholder="Nom">
              <input type="text" class="form-control" :id="'subject-longname-' + index" v-model="subject.longName" placeholder="Nom complet">
              <button type="button" class="btn btn-danger" @click="$emit('remove-subject', index)">
                <i class="fas fa-trash me-1"></i>
              </button>
            </div>
          </div>
      </div>
      
      <button type="button" class="btn btn-primary btn-add" @click="$emit('add-subject')">
        <i class="fas fa-plus me-1"></i>Ajouter une matière
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubjectsTab',
  props: {
    subjects: Array,
    errors: Object
  }
}
</script>
