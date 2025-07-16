<template>
  <div class="mt-5">
    <div class="rooms-container">
      <div class="row">
        <div class="col-md-6" v-for="(room, index) in rooms" :key="'room-'+index">
          <div class="input-group mb-3">
            <input type="text" class="form-control" :class="{'is-invalid': errors[index]}" :id="'room-name-' + index" v-model="room.name" placeholder="Nom">
            <input type="number" min="0" class="form-control" :id="'room-capacity-' + index" v-model="room.capacity" placeholder="Capacité">
            <button type="button" class="btn btn-danger" @click="$emit('remove-room', index)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-add" @click="$emit('add-room')">
        <i class="fas fa-plus me-1"></i>Ajouter une salle
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomsTab',
  props: {
    rooms: Array,
    errors: Object
  }
}
</script>
