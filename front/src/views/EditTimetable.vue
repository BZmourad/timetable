<template>
    <TimetableForm :timetableId="$route.params.id" />
</template>

<script>
import TimetableForm from '@/components/TimetableForm.vue';

export default {
    name: 'EditTimetable',
    components: {
        TimetableForm
    }
};
</script>