<template>
  <div class="mt-5">
    <div class="students-container">
      <div class="row">
        <div class="col-md-6" v-for="(student, index) in students" :key="'student-'+index">
          <div class="input-group mb-3">
            <input type="text" class="form-control" :class="{'is-invalid': errors[index]}" :id="'student-name-' + index" v-model="student.name" placeholder="Nom">
            <input type="number" min="0" class="form-control" :id="'student-count-' + index" v-model="student.studentCount" placeholder="Nombre d'étudiants">
            <button type="button" class="btn btn-danger" @click="$emit('remove-student', index)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-add" @click="$emit('add-student')">
        <i class="fas fa-plus me-1"></i>Ajouter un groupe d'apprenants
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentsTab',
  props: {
    students: Array,
    errors: Object
  }
}
</script>
