<template>
  <div class="constraints-tab">
    <div class="constraint-selection">
      <select class="form-control" id="constraintType" v-model="selectedConstraintType">
        <option value="" disabled>-- Sélectionnez un type --</option>
        <optgroup label="Contraintes temporelles">
          <option value="ConstraintBreakTimes">Temps de pause</option>
          <option value="ConstraintTeacherNotAvailableTimes">Enseignant non disponible</option>
          <option value="ConstraintTeacherMaxDaysPerWeek">Jours max/semaine</option>
          <option value="ConstraintTeacherMinDaysPerWeek">Jours min/semaine</option>
          <option value="ConstraintTeacherNoTwoConsecutiveDays">Pas 2 jours consécutifs</option>
        </optgroup>
      </select>
      <button 
        type="button" 
        class="btn btn-primary" 
        @click="openAddConstraintModal" 
        :disabled="!selectedConstraintType">
        Ajouter
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showConstraintModal" class="modal" @click.self="closeConstraintModal">
      <div class="modal-content">
        <span class="close" @click="closeConstraintModal">&times;</span>
        
        <h3>{{ modalTitle }}</h3>
        
        <component 
          :is="currentConstraintComponent" 
          :constraint="newConstraint"
          :days="formData.selectedDays"
          :periods="formData.periods"
          :teachers="formData.teachers"
          @add-period="addUnavailablePeriod"
          @remove-period="removeUnavailablePeriod"
        />

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeConstraintModal">Annuler</button>
          <button type="button" class="btn btn-primary" @click="addConstraint">Valider</button>
        </div>
      </div>
    </div>

    <!-- Tableau des contraintes -->
    <ConstraintsTable 
      :constraints="formData.contraintes" 
      :teachers="formData.teachers"
      @remove="removeConstraint"
    />
  </div>
</template>

<script>
import BreakTimesConstraint from './constraints/BreakTimesConstraint.vue';
import TeacherNotAvailableTimes from './constraints/TeacherNotAvailableTimes.vue';
import TeacherMaxDaysPerWeek from './constraints/TeacherMaxDaysPerWeek.vue';
import TeacherMinDaysPerWeek from './constraints/TeacherMinDaysPerWeek.vue';
import TeacherNoTwoConsecutiveDays from './constraints/TeacherNoTwoConsecutiveDays.vue';
import ConstraintsTable from './constraints/ConstraintsTable.vue';

export default {
  components: {
    BreakTimesConstraint,
    TeacherNotAvailableTimes,
    TeacherMaxDaysPerWeek,
    TeacherMinDaysPerWeek,
    TeacherNoTwoConsecutiveDays,
    ConstraintsTable
  },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedConstraintType: '',
      showConstraintModal: false,
      newConstraint: {}
    }
  },
  computed: {
    modalTitle() {
      const titles = {
        'ConstraintBreakTimes': 'Ajouter un temps de pause',
        'ConstraintTeacherNotAvailableTimes': 'Enseignant non disponible',
        'ConstraintTeacherMaxDaysPerWeek': 'Jours max/semaine (enseignant)',
        'ConstraintTeacherMinDaysPerWeek': 'Jours min/semaine (enseignant)',
        'ConstraintTeacherNoTwoConsecutiveDays': 'Pas 2 jours consécutifs'
      };
      return titles[this.selectedConstraintType] || 'Ajouter une contrainte';
    },
    currentConstraintComponent() {
      const componentMap = {
        'ConstraintBreakTimes': 'break-times-constraint',
        'ConstraintTeacherNotAvailableTimes': 'teacher-not-available-times',
        'ConstraintTeacherMaxDaysPerWeek': 'teacher-max-days-per-week',
        'ConstraintTeacherMinDaysPerWeek': 'teacher-min-days-per-week',
        'ConstraintTeacherNoTwoConsecutiveDays': 'teacher-no-two-consecutive-days'
      };
      return componentMap[this.selectedConstraintType];
    }
  },
  methods: {
    getDefaultConstraint() {
      switch(this.selectedConstraintType) {
        case 'ConstraintBreakTimes':
          return {
            type: 'ConstraintBreakTimes',
            day: this.formData.selectedDays?.[0] || '',
            hour: this.formData.periods?.[0]?.name || ''
          };
        case 'ConstraintTeacherNotAvailableTimes':
          return {
            type: 'ConstraintTeacherNotAvailableTimes',
            teacher: this.formData.teachers?.[0]?.id || '',
            unavailablePeriods: [{
              day: this.formData.selectedDays?.[0] || '',
              hour: this.formData.periods?.[0]?.name || ''
            }]
          };
        case 'ConstraintTeacherMaxDaysPerWeek':
          return {
            type: 'ConstraintTeacherMaxDaysPerWeek',
            teacher: this.formData.teachers?.[0]?.id || '',
            maxDays: 5
          };
        case 'ConstraintTeacherMinDaysPerWeek':
          return {
            type: 'ConstraintTeacherMinDaysPerWeek',
            teacher: this.formData.teachers?.[0]?.id || '',
            minDays: 1
          };
        case 'ConstraintTeacherNoTwoConsecutiveDays':
          return {
            type: 'ConstraintTeacherNoTwoConsecutiveDays',
            teacher: this.formData.teachers?.[0]?.id || ''
          };
        default:
          return {};
      }
    },
    openAddConstraintModal() {
      if (!this.selectedConstraintType) return;
      
      this.newConstraint = this.getDefaultConstraint();
      this.showConstraintModal = true;
    },
    closeConstraintModal() {
      this.showConstraintModal = false;
    },
    addUnavailablePeriod() {
      if (!this.newConstraint.unavailablePeriods) {
        this.newConstraint.unavailablePeriods = [];
      }
      this.newConstraint.unavailablePeriods.push({
        day: this.formData.selectedDays?.[0] || '',
        hour: this.formData.periods?.[0]?.name || ''
      });
    },
    removeUnavailablePeriod(index) {
      if (this.newConstraint.unavailablePeriods) {
        this.newConstraint.unavailablePeriods.splice(index, 1);
      }
    },
    addConstraint() {
      if (this.selectedConstraintType === 'ConstraintTeacherNotAvailableTimes' && 
          (!this.newConstraint.unavailablePeriods || this.newConstraint.unavailablePeriods.length === 0)) {
        alert('Veuillez ajouter au moins une période non disponible');
        return;
      }

      this.formData.contraintes.push(JSON.parse(JSON.stringify(this.newConstraint)));
      this.closeConstraintModal();
    },
    removeConstraint(index) {
      this.formData.contraintes.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
  max-width: 500px;
}

.close {
  float: right;
  cursor: pointer;
  font-size: 1.5em;
}
</style>