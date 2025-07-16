<template>
  <div class="mt-5">
    <div class="balises-container">
      <div class="row">
        <div class="col-md-4" v-for="(balise, index) in balises" :key="'balise-'+index">
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="balise.name" placeholder="Nom">
            <button type="button" class="btn btn-danger" @click="$emit('remove-balise', index)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-add" @click="$emit('add-balise')">
        <i class="fas fa-plus me-1"></i>Ajouter une balise
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BalisesTab',
  props: {
    balises: Array,
    errors: Object
  }
}
</script>
