<template>
  <div class="constraints-table" v-if="constraints.length > 0">
    <h3>Contraintes définies</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Détails</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(constraint, index) in constraints" :key="index">
          <td>{{ getTypeName(constraint.type) }}</td>
          <td>{{ getDetails(constraint) }}</td>
          <td>
            <button type="button" class="btn btn-danger" @click="$emit('remove', index)">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    constraints: Array,
    teachers: Array
  },
  methods: {
    getTypeName(type) {
      const names = {
        'ConstraintBreakTimes': 'Temps de pause',
        'ConstraintTeacherNotAvailableTimes': 'Enseignant non disponible',
        'ConstraintTeacherMaxDaysPerWeek': 'Jours max/semaine',
        'ConstraintTeacherMinDaysPerWeek': 'Jours min/semaine',
        'ConstraintTeacherNoTwoConsecutiveDays': 'Pas 2 jours consécutifs'
      };
      return names[type] || type;
    },
    getDetails(constraint) {
      switch(constraint.type) {
        case 'ConstraintBreakTimes':
          return `Jour: ${constraint.day}, Heure: ${constraint.hour}`;
        case 'ConstraintTeacherNotAvailableTimes':
          const teacher = this.teachers.find(t => t.id === constraint.teacher);
          return `Enseignant: ${teacher?.name || 'Inconnu'}, Périodes: ${
            constraint.unavailablePeriods.map(p => `${p.day} ${p.hour}`).join(', ')
          }`;
        case 'ConstraintTeacherMaxDaysPerWeek':
          const teacherMax = this.teachers.find(t => t.id === constraint.teacher);
          return `Enseignant: ${teacherMax?.name || 'Inconnu'}, Max: ${constraint.maxDays} jours`;
        case 'ConstraintTeacherMinDaysPerWeek':
          const teacherMin = this.teachers.find(t => t.id === constraint.teacher);
          return `Enseignant: ${teacherMin?.name || 'Inconnu'}, Min: ${constraint.minDays} jours`;
        case 'ConstraintTeacherNoTwoConsecutiveDays':
          const teacherNoTwo = this.teachers.find(t => t.id === constraint.teacher);
          return `Enseignant: ${teacherNoTwo?.name || 'Inconnu'}`;
        default:
          return JSON.stringify(constraint);
      }
    }
  }
}
</script>

<style scoped>
.constraints-table {
  margin-top: 30px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}
</style>