<template>
  <div>
    <div class="form-group">
      <label>Jour :</label>
      <select class="form-control" v-model="constraint.day">
        <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
      </select>
    </div>
    <div class="form-group">
      <label>Heure :</label>
      <select class="form-control" v-model="constraint.hour">
        <option v-for="period in periods" :key="period.name" :value="period.name">{{ period.name }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    constraint: Object,
    days: Array,
    periods: Array
  }
}
</script>