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
      <label>Nombre maximum de jours par semaine :</label>
      <input 
        type="number" 
        class="form-control" 
        v-model.number="constraint.maxDays" 
        min="0"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    constraint: Object,
    teachers: Array
  }
}
</script>