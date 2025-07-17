<template>
    <div class="container mt-5">
        <button @click="generateTimetable" class="btn btn-sm btn-danger">
            <i class="fas fa-check"></i> generate timetable
        </button>
        <pre>{{ timetable }}</pre>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'TestTimetable',
    data() {
        return {
            timetable: ''
        };
    },
    methods: {
        async generateTimetable() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/test`);
                console.log('response', response);
                this.timetable = response.data;
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}
</script>