<template>
  <div>
    <div class="activities-container">
      <div class="activity-item mb-3" v-for="(activity, index) in activities" :key="'activity-'+index">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label :for="'activity-subject-' + index" class="form-label">Matière:</label>
            <select class="form-select" :id="'activity-subject-' + index" 
                    v-model="activity.subject" :class="{'is-invalid': errors[index] && errors[index].subject}">
              <option value="" disabled>Sélectionnez une matière</option>
              <option v-for="subject in subjects.filter(subject => subject.name !== '')" :value="subject.name">{{ subject.name }}</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label :for="'activity-student-' + index" class="form-label">Apprenants:</label>
            <select class="form-select" :id="'activity-student-' + index" 
                    v-model="activity.student" :class="{'is-invalid': errors[index] && errors[index].student}">
              <option value="" disabled>Sélectionnez un groupe</option>
              <option v-for="student in students.filter(student => student.name !== '')" :value="student.name">{{ student.name }}</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label :for="'activity-teacher-' + index" class="form-label">Enseignant:</label>
            <select class="form-select" :id="'activity-teacher-' + index" 
                    v-model="activity.teacher" :class="{'is-invalid': errors[index] && errors[index].teacher}">
              <option value="" disabled>Sélectionnez un enseignant</option>
              <option v-for="teacher in teachers.filter(teacher => teacher.name !== '')" :value="teacher.name">{{ teacher.name }}</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Balise:</label>
            <select class="form-select" v-model="activity.balise" >
              <option value="" disabled>Sélectionnez une balise</option>
              <option v-for="balise in balises.filter(balise => balise.name !== '')" :value="balise.name" >{{ balise.name }}</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Durées (heures):</label>
          <div class="row">
            <div v-for="(duration, durIndex) in activity.durations" :key="durIndex" class="duration-item mb-2 d-flex align-items-center col-md-3">
              <input type="number" min="1" class="form-control me-2" v-model="activity.durations[durIndex]" 
                    :class="{'is-invalid': errors[index] && errors[index].durations && errors[index].durations[durIndex]}">
              <button type="button" class="btn btn-outline-danger btn-sm" @click="$emit('remove-duration', index, durIndex)" 
                      v-if="activity.durations.length > 1">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="$emit('add-duration', index)">
            <i class="fas fa-plus me-1"></i>Ajouter une durée
          </button>
        </div>
        <button type="button" class="btn btn-danger btn-sm" @click="$emit('remove-activity', index)">
          <i class="fas fa-trash me-1"></i>Supprimer
        </button>
      </div>
      <button type="button" class="btn btn-primary btn-add" @click="$emit('add-activity')">
        <i class="fas fa-plus me-1"></i>Ajouter une activité
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivitiesTab',
  props: {
    activities: Array,
    subjects: Array,
    teachers: Array,
    students: Array,
    balises: Array,
    errors: Object
  }
}
</script>
