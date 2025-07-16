<template>
  <div class="form-group">
    <label>Enseignant :</label>
    <select class="form-control" v-model="constraint.teacher">
      <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
        {{ teacher.name }}
      </option>
    </select>
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