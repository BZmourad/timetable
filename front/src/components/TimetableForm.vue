<template>
    <form @submit.prevent="validateAndSubmit">
        <nav class="navbar navbar-expand-lg navbar-light bg-secondary">
            <div class="container-fluid">
                <h2 class="navbar-brand text-white" href="#"><i class="fas fa-calendar-plus me-2"></i>{{ isEditMode ? 'Modifier' : 'Créer' }} un nouvel emploi du temps</h2>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <div class="navbar-nav">
                        <router-link to="/" class="btn btn-white me-2">
                            <i class="fas fa-arrow-left me-1"></i>Retour
                        </router-link>
                        <router-link :to="'/show/' + timetableId" class="btn btn-info me-2" v-if="isEditMode">
                            <i class="fas fa-eye me-1"></i> Voir
                        </router-link>
                        <button type="button" class="btn btn-success" @click="validateAndSubmit">
                            <i class="fas fa-save me-1"></i>Soumettre
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="p-2 mt-4">
            <div class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li v-for="tab in tabs" :key="tab.id" class="nav-item" role="presentation">
                            <button class="nav-link" :class="{ active: activeTab === tab.id }" :id="`${tab.id}-tab`" data-bs-toggle="tab" :data-bs-target="`#${tab.id}`" type="button" role="tab" @click="activeTab = tab.id">
                                <i :class="tab.icon + ' me-1'"></i> {{ tab.label }}
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'base' }" id="base" role="tabpanel">
                            <BasicInfoTab :formData="formData" :errors="errors" :daysOfWeek="daysOfWeek" @add-period="addPeriod" @remove-period="removePeriod" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'subjects' }" id="subjects" role="tabpanel">
                            <SubjectsTab :subjects="formData.subjects" :errors="errors" @add-subject="addSubject" @remove-subject="removeSubject" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'teachers' }" id="teachers" role="tabpanel">
                            <TeachersTab :teachers="formData.teachers" :subjects="formData.subjects" :errors="errors" @add-teacher="addTeacher" @remove-teacher="removeTeacher" @update-qualified-subjects="updateQualifiedSubjects" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'students' }" id="students" role="tabpanel">
                            <StudentsTab :students="formData.students" :errors="errors" @add-student="addStudent" @remove-student="removeStudent" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'rooms' }" id="rooms" role="tabpanel">
                            <RoomsTab :rooms="formData.rooms" :errors="errors" @add-room="addRoom" @remove-room="removeRoom" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'balises' }" id="balises" role="tabpanel">
                            <BalisesTab :balises="formData.balises" :errors="errors" @add-balise="addBalise" @remove-balise="removeBalise" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'activities' }" id="activities" role="tabpanel">
                            <ActivitiesTab 
                                :activities="formData.activities" :subjects="formData.subjects" :teachers="formData.teachers" :balises="formData.balises" :students="formData.students" :errors="errors"
                                @add-activity="addActivity" @remove-activity="removeActivity" @add-duration="addDuration" @remove-duration="removeDuration" />
                        </div>
                        <div class="tab-pane fade" :class="{ 'show active': activeTab === 'contraintes' }" id="contraintes" role="tabpanel">
                            <ContraintesTab :formData="formData" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import BasicInfoTab from '@/components/timetable/BasicInfoTab.vue';
import SubjectsTab from '@/components/timetable/SubjectsTab.vue';
import TeachersTab from '@/components/timetable/TeachersTab.vue';
import StudentsTab from '@/components/timetable/StudentsTab.vue';
import RoomsTab from '@/components/timetable/RoomsTab.vue';
import BalisesTab from '@/components/timetable/BalisesTab.vue';
import ActivitiesTab from '@/components/timetable/ActivitiesTab.vue';
import ConstraintsTab from '@/components/timetable/ConstraintsTab.vue';
import ContraintesTab from '@/components/timetable/ContraintesTab.vue';

import axios from 'axios';
import toastr from 'toastr';
import $ from 'jquery';
window.$ = window.jQuery = $;

export default {
    name: 'TimetableForm',
    props: {
        timetableId: {
            type: String,
            default: null
        }
    },
    components: {
        BasicInfoTab,
        SubjectsTab,
        TeachersTab,
        StudentsTab,
        RoomsTab,
        BalisesTab,
        ActivitiesTab,
        ConstraintsTab,
        ContraintesTab
    },
    data() {
        return {
            isEditMode: false,
            isLoaded: false,
            activeTab: 'base',
            tabs: [
                { id: 'base', label: 'Informations de base', icon: 'fas fa-info-circle' },
                { id: 'subjects', label: 'Matières', icon: 'fas fa-book' },
                { id: 'teachers', label: 'Enseignants', icon: 'fas fa-chalkboard-teacher' },
                { id: 'students', label: 'Apprenants', icon: 'fas fa-user-graduate' },
                { id: 'rooms', label: 'Salles', icon: 'fas fa-door-open' },
                { id: 'balises', label: 'Balises', icon: 'fas fa-tag' },
                { id: 'activities', label: 'Activités', icon: 'fas fa-tasks' },
                { id: 'contraintes', label: 'Contraintes', icon: 'fas fa-ruler' }
            ],
            daysOfWeek: [
                { value: 'Lundi', label: 'Lundi' },
                { value: 'Mardi', label: 'Mardi' },
                { value: 'Mercredi', label: 'Mercredi' },
                { value: 'Jeudi', label: 'Jeudi' },
                { value: 'Vendredi', label: 'Vendredi' },
                { value: 'Samedi', label: 'Samedi' },
                { value: 'Dimanche', label: 'Dimanche' }
            ],
            formData: {
                institutionName: '',
                institutionComment: '',
                selectedDays: [],
                periods: [{ name: '', description: '' }],
                subjects: [{ name: '', longName: '', code: '', comments: '' }],
                teachers: [{
                    name: '',
                    longName: '',
                    code: '',
                    targetHours: 0,
                    qualifiedSubjects: [],
                    comments: ''
                }],
                students: [{
                    name: '',
                    longName: '',
                    code: '',
                    studentCount: 0,
                    comments: ''
                }],
                rooms: [{
                    name: '',
                    longName: '',
                    code: '',
                    capacity: 0,
                    comments: ''
                }],
                balises: [{
                    name: '',
                    longName: '',
                    code: '',
                    comments: '',
                    Imprimable: 'true'
                }],
                activities: [{
                    subject: '',
                    student: '',
                    teacher: '',
                    balise: '',
                    durations: [1]
                }],
                ConstraintBreakTimes:[],
                ConstraintTeacherNotAvailableTimes: [],
                ConstraintTeacherMaxDaysPerWeek: [],
                ConstraintTeacherMinDaysPerWeek: [],
                ConstraintTeacherNoTwoConsecutiveDays: [],
                ConstraintTeacherMaxGapsPerDay: [],
                ConstraintTeacherMaxGapsPerWeek: [],
                ConstraintTeacherMaxSingleGapsInSelectedTimeSlots: [],
                ConstraintTeacherMaxHoursDailyInInterval: [],
                ConstraintTeacherMaxHoursDaily: [],
                ConstraintTeacherPairOfMutuallyExclusiveTimeSlots: [],
                ConstraintTeacherMaxSpanPerDay: [],
                ConstraintTeacherActivityTagMaxHoursDaily: []
            },
            errors: {},
            submitted: false
        };
    },
    created() {
        this.isEditMode = !!this.timetableId;
        if (this.isEditMode) {
            this.loadTimetableData();
        }
    },
    mounted() {
        //this.initSelect2();
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000
        };
    },
    updated() {
        /*this.$nextTick(() => {
            this.initSelect2();
        });*/
    },
    methods: {
        async loadTimetableData() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/timetables/${this.timetableId}`);
                this.formData = response.data.data;
                this.isLoaded = true;
                /*this.$nextTick(() => {
                    this.initSelect2();
                });*/
            } catch (error) {
                console.error('Erreur:', error);
                toastr.error("Erreur lors du chargement des données");
                this.$router.push('/');
            }
        },
        /*initSelect2() {
            $('.qualified-subjects-select').select2({
                placeholder: "Sélectionnez des matières",
                allowClear: true
            });
        },*/
        updateQualifiedSubjects(index, event) {
            this.formData.teachers[index].qualifiedSubjects = $(event.target).val();
        },
        addPeriod() {
            this.formData.periods.push({ name: '', description: '' });
        },
        removePeriod(index) {
            if (this.formData.periods.length > 1) {
                this.formData.periods.splice(index, 1);
                if (this.errors.periods && this.errors.periods[index]) {
                    delete this.errors.periods[index];
                }
            } else {
                toastr.warning("Vous devez avoir au moins une période.");
            }
        },
        addSubject() {
            this.formData.subjects.push({ 
                name: '', 
                longName: '', 
                code: '', 
                comments: '' 
            });
        },
        removeSubject(index) {
            if (this.formData.subjects.length > 1) {
                this.formData.subjects.splice(index, 1);
                if (this.errors.subjects && this.errors.subjects[index]) {
                    delete this.errors.subjects[index];
                }
            } else {
                toastr.warning("Vous devez avoir au moins une matière.");
            }
        },
        addTeacher() {
            this.formData.teachers.push({
                name: '',
                longName: '',
                code: '',
                targetHours: 0,
                qualifiedSubjects: [],
                comments: ''
            });
            /*this.$nextTick(() => {
                this.initSelect2();
            });*/
        },
        removeTeacher(index) {
            if (this.formData.teachers.length > 1) {
                this.formData.teachers.splice(index, 1);
                if (this.errors.teachers && this.errors.teachers[index]) {
                    delete this.errors.teachers[index];
                }
            } else {
                toastr.warning("Vous devez avoir au moins un enseignant.");
            }
        },
        addStudent() {
            this.formData.students.push({
                name: '',
                longName: '',
                code: '',
                studentCount: 0,
                comments: ''
            });
        },
        removeStudent(index) {
            if (this.formData.students.length > 1) {
                this.formData.students.splice(index, 1);
                if (this.errors.students && this.errors.students[index]) {
                    delete this.errors.students[index];
                }
            } else {
                toastr.warning("Vous devez avoir au moins un groupe d'apprenants.");
            }
        },
        addRoom() {
            this.formData.rooms.push({
                name: '',
                longName: '',
                code: '',
                capacity: 0,
                comments: ''
            });
        },
        removeRoom(index) {
            if (this.formData.rooms.length > 1) {
                this.formData.rooms.splice(index, 1);
                if (this.errors.rooms && this.errors.rooms[index]) {
                    delete this.errors.rooms[index];
                }
            } else {
                toastr.warning("Vous devez avoir au moins une salle.");
            }
        },
        addBalise() {
            this.formData.balises.push({
                name: '',
                longName: '',
                code: '',
                Imprimable: 'true',
                comments: ''
            });
        },
        removeBalise(index) {
            this.formData.balises.splice(index, 1);
        },
        addActivity() {
            this.formData.activities.push({
                subject: '',
                student: '',
                teacher: '',
                balise: '',
                durations: [1]
            });
        },
        removeActivity(index) {
            if (this.formData.activities.length > 1) {
                this.formData.activities.splice(index, 1);
                if (this.errors.activities && this.errors.activities[index]) {
                    delete this.errors.activities[index];
                }
            } else {
                toastr.warning("Vous devez avoir au moins une activité.");
            }
        },
        addDuration(activityIndex) {
            this.formData.activities[activityIndex].durations.push(1);
        },
        removeDuration(activityIndex, durationIndex) {
            if (this.formData.activities[activityIndex].durations.length > 1) {
                this.formData.activities[activityIndex].durations.splice(durationIndex, 1);
            }
        },
        validateForm() {
            this.errors = {};
            let isValid = true;
            let errorMessages = [];
            
            // Validation des champs obligatoires
            if (!this.formData.institutionName.trim()) {
                this.errors.institutionName = true;
                errorMessages.push("- Le nom de l'institution est obligatoire");
                isValid = false;
            }
            
            if (this.formData.selectedDays.length === 0) {
                this.errors.selectedDays = true;
                errorMessages.push("- Vous devez sélectionner au moins un jour d'ouverture");
                isValid = false;
            }
            
            // Validation des périodes
            this.errors.periods = {};
            this.formData.periods.forEach((period, index) => {
                if (!period.name.trim()) {
                    this.errors.periods[index] = true;
                    errorMessages.push(`- Le nom de la période ${index + 1} est obligatoire`);
                    isValid = false;
                }
            });
            
            // Validation des matières
            this.errors.subjects = {};
            this.formData.subjects.forEach((subject, index) => {
                if (!subject.name.trim()) {
                    this.errors.subjects[index] = true;
                    errorMessages.push(`- Le nom de la matière ${index + 1} est obligatoire`);
                    isValid = false;
                }
            });
            
            // Validation des enseignants
            this.errors.teachers = {};
            this.formData.teachers.forEach((teacher, index) => {
                if (!teacher.name.trim()) {
                    this.errors.teachers[index] = true;
                    errorMessages.push(`- Le nom de l'enseignant ${index + 1} est obligatoire`);
                    isValid = false;
                }
            });
            
            // Validation des apprenants
            this.errors.students = {};
            this.formData.students.forEach((student, index) => {
                if (!student.name.trim()) {
                    this.errors.students[index] = true;
                    errorMessages.push(`- Le nom du groupe d'apprenants ${index + 1} est obligatoire`);
                    isValid = false;
                }
            });
            
            // Validation des salles
            this.errors.rooms = {};
            this.formData.rooms.forEach((room, index) => {
                if (!room.name.trim()) {
                    this.errors.rooms[index] = true;
                    errorMessages.push(`- Le nom de la salle ${index + 1} est obligatoire`);
                    isValid = false;
                }
            });
            
            // Validation des activités
            this.errors.activities = {};
            this.formData.activities.forEach((activity, index) => {
                this.errors.activities[index] = {};
                let hasError = false;
                
                if (!activity.subject) {
                    this.errors.activities[index].subject = true;
                    errorMessages.push(`- La matière de l'activité ${index + 1} est obligatoire`);
                    hasError = true;
                }
                
                if (!activity.student) {
                    this.errors.activities[index].student = true;
                    errorMessages.push(`- Le groupe d'apprenants de l'activité ${index + 1} est obligatoire`);
                    hasError = true;
                }
                
                if (!activity.teacher) {
                    this.errors.activities[index].teacher = true;
                    errorMessages.push(`- L'enseignant de l'activité ${index + 1} est obligatoire`);
                    hasError = true;
                }
                
                this.errors.activities[index].durations = [];
                activity.durations.forEach((duration, durIndex) => {
                    if (!duration || duration <= 0) {
                        this.errors.activities[index].durations[durIndex] = true;
                        errorMessages.push(`- La durée ${durIndex + 1} de l'activité ${index + 1} doit être un nombre positif`);
                        hasError = true;
                    }
                });
                
                if (hasError) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                toastr.error(errorMessages.join('<br>'));
            }
            
            return isValid;
        },
        validateAndSubmit() {
            if (this.validateForm()) {
                this.submitForm();
            } else {
                this.$nextTick(() => {
                    const firstError = document.querySelector('.is-invalid');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }
        },
        async submitForm() {
            try {
                var response;
                if (this.isEditMode) {
                    response = await axios.put(
                        `${process.env.VUE_APP_API_BASE_URL}/timetables/${this.timetableId}`,
                        this.formData
                    );
                    toastr.success("Emploi du temps mis à jour avec succès!");
                    this.$router.push(`/show/${response.data.data.id}`);
                } else {
                    response = await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/timetables`,
                        this.formData
                    );
                    toastr.success("Emploi du temps créé avec succès!");
                    this.$router.push(`/show/${response.data.data.id}`);
                }
            } catch (error) {
                console.error('Erreur:', error);
                toastr.error(error.response?.data?.error || `Erreur lors de ${this.isEditMode ? 'la mise à jour' : 'la création'}`);
            }
        }
    }
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css';
</style>