<template>
  <div>
    <div class="form-group">
      <label>Enseignant :</label>
      <select class="form-control" v-model="constraint.teacher">
        <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
          {{ teacher.name }}
        </option>
      </select>
    </div>
    
    <div class="form-group">
      <label>Périodes non disponibles :</label>
      <div v-for="(period, index) in constraint.unavailablePeriods" :key="index" class="period-row">
        <select class="form-control" v-model="period.day">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        <select class="form-control" v-model="period.hour">
          <option v-for="period in periods" :key="period.name" :value="period.name">
            {{ period.name }}
          </option>
        </select>
        <button type="button" class="btn btn-danger" @click="$emit('remove-period', index)">×</button>
      </div>
      <button type="button" class="btn btn-secondary" @click="$emit('add-period')">
        Ajouter une période
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    constraint: Object,
    days: Array,
    periods: Array,
    teachers: Array
  }
}
</script>

<style scoped>
.period-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}
</style>