<template>
  <div class="mt-5">
    <div class="teachers-container">
      <div class="row">
        <div class="col-md-6 teacher-item mb-3" v-for="(teacher, index) in teachers" :key="'teacher-'+index">
          <div class="row">
            <div class="col-md-3">
              <input type="text" class="form-control" :class="{'is-invalid': errors[index]}" :id="'teacher-name-' + index" v-model="teacher.name" placeholder="Nom">
            </div>
            <div class="col-md-3">
              <input type="number" min="0" class="form-control" :id="'teacher-hours-' + index" v-model="teacher.targetHours" placeholder="Nombre d'heures cible">
            </div>
            <div class="col-md-5">
              <select class="form-select qualified-subjects-select" placeholder="Matières qualifiées" multiple :id="'teacher-subjects-' + index" v-model="teacher.qualifiedSubjects" @change="$emit('update-qualified-subjects', index, $event)">
                <option v-for="subject in subjects.filter(subject => subject.name !== '')" :value="subject.name">{{ subject.name }}</option>
              </select>
            </div>
            <div class="col-md-1 mt-3">
              <button type="button" class="btn btn-danger" @click="$emit('remove-teacher', index)">
                <i class="fas fa-trash me-1"></i>
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      <button type="button" class="btn btn-primary btn-add" @click="$emit('add-teacher')">
        <i class="fas fa-plus me-1"></i>Ajouter un enseignant
      </button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'TeachersTab',
    props: {
        teachers: Array,
        subjects: Array,
        errors: Object
    }
}
</script>
