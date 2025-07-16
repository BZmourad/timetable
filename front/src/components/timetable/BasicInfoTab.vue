<template>
  <div>
    <div class="row mt-4">
      <div class="col-sm-6">
        <div class="mb-3">
          <label for="institutionName" class="form-label">Nom de l'institution:</label>
          <input type="text" class="form-control" :class="{'is-invalid': errors.institutionName}" id="institutionName" v-model="formData.institutionName">
        </div>
        <div class="mb-3">
          <label for="institutionComment" class="form-label">Commentaire:</label>
          <textarea class="form-control" id="institutionComment" v-model="formData.institutionComment" rows="3"></textarea>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="mb-4">
        <div class="mb-3">
          <label class="form-label">Jours d'ouverture:</label>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check" v-for="day in daysOfWeek" :key="day.value">
              <input class="form-check-input" type="checkbox" :id="'day-' + day.value" 
                    v-model="formData.selectedDays" :value="day.value">
              <label class="form-check-label" :for="'day-' + day.value">{{ day.label }}</label>
            </div>
          </div>
        </div>
          <label class="form-label">Périodes:</label>
          <div class="periods-container">
            <div class="row">
              <div class="col-md-6" v-for="(period, index) in formData.periods" :key="'period-'+index">
                <div class="input-group mb-3">
                  <input type="text" class="form-control" :class="{'is-invalid': errors.periods && errors.periods[index]}" v-model="period.name">
                  <button type="button" class="btn btn-danger" @click="$emit('remove-period', index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-add" @click="$emit('add-period')">
              <i class="fas fa-plus me-1"></i>Ajouter une période
            </button>
          </div>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script>
export default {
    name: 'BasicInfoTab',
    props: {
        formData: Object,
        errors: Object,
        daysOfWeek: Array
    }
}
</script>
