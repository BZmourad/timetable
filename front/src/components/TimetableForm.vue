<template>
    <form @submit.prevent="validateAndSubmit">
        <nav class="navbar navbar-expand-lg navbar-light bg-secondary">
            <div class="container-fluid">
                <h2 class="navbar-brand text-white"><i class="fas fa-calendar-plus me-2"></i>{{ isEditMode ? 'Modifier' : 'Créer' }} un nouvel emploi du temps</h2>
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
                        <button type="button" class="btn btn-success" @click="validateAndSubmit" v-if="currentStep === steps.length - 1">
                            <i class="fas fa-save me-1"></i>Soumettre
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="p-2 mt-4">
            <div v-if="loading" class="loading-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Chargement des données...</p>
            </div>
            <div class="card">
                <div class="card-body">
                    <!-- Navigation buttons -->
                    <div class="d-flex justify-content-between mb-3">
                        <button type="button" class="btn btn-secondary" 
                                @click="prevStep" :disabled="currentStep === 0">
                            <i class="fas fa-arrow-left me-1"></i> Précédent
                        </button>
                        <button type="button" class="btn btn-primary" 
                                @click="nextStep" v-if="currentStep < steps.length - 1">
                            Suivant <i class="fas fa-arrow-right ms-1"></i>
                        </button>
                        <button type="button" class="btn btn-success" 
                                @click="validateAndSubmit" v-if="currentStep === steps.length - 1">
                            <i class="fas fa-save me-1"></i> Soumettre
                        </button>
                    </div>

                    <!-- Stepper -->
                    <div class="stepper-wrapper mb-4">
                        <div class="stepper-item" v-for="(step, index) in steps" :key="step.id" 
                             :class="{ active: currentStep === index, completed: currentStep > index }"
                             @click="goToStep(index)">
                            <div class="step-counter">
                                <i :class="step.icon"></i>
                            </div>
                            <div class="step-name">{{ step.label }}</div>
                        </div>
                    </div>
                    
                    <!-- Step content -->
                    <div class="step-content">
                        <div v-show="currentStep === 0">
                            <BasicInfoTab :formData="formData" :errors="errors" :daysOfWeek="daysOfWeek" 
                                         @add-period="addPeriod" @remove-period="removePeriod" />
                        </div>
                        <div v-show="currentStep === 1">
                            <SubjectsTab :subjects="formData.subjects" :errors="errors" 
                                         @add-subject="addSubject" @remove-subject="removeSubject" />
                        </div>
                        <div v-show="currentStep === 2">
                            <TeachersTab :teachers="formData.teachers" :subjects="formData.subjects" :errors="errors" 
                                         @add-teacher="addTeacher" @remove-teacher="removeTeacher" 
                                         @update-qualified-subjects="updateQualifiedSubjects" />
                        </div>
                        <div v-show="currentStep === 3">
                            <StudentsTab :students="formData.students" :errors="errors" 
                                        @add-student="addStudent" @remove-student="removeStudent" />
                        </div>
                        <div v-show="currentStep === 4">
                            <RoomsTab :rooms="formData.rooms" :errors="errors" 
                                       @add-room="addRoom" @remove-room="removeRoom" />
                        </div>
                        <div v-show="currentStep === 5">
                            <BalisesTab :balises="formData.balises" :errors="errors" 
                                        @add-balise="addBalise" @remove-balise="removeBalise" />
                        </div>
                        <div v-show="currentStep === 6">
                            <ActivitiesTab 
                                :activities="formData.activities" :subjects="formData.subjects" 
                                :teachers="formData.teachers" :balises="formData.balises" 
                                :students="formData.students" :errors="errors"
                                @add-activity="addActivity" @remove-activity="removeActivity" 
                                @add-duration="addDuration" @remove-duration="removeDuration" />
                        </div>
                        <div v-show="currentStep === 7">
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
        ContraintesTab
    },
    data() {
        return {
            isEditMode: false,
            isLoaded: false,
            currentStep: 0,
            steps: [
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
                ConstraintTeacherActivityTagMaxHoursDaily: [],
                ConstraintTeacherMaxActivityTagsPerDayFromSet: [],
                ConstraintTeacherMinHoursDaily: [],
                ConstraintTeacherActivityTagMinHoursDaily: [],
                ConstraintTeacherMaxHoursContinuously: [],
                ConstraintTeacherActivityTagMaxHoursContinuously: [],
                ConstraintTeacherMinGapsBetweenActivityTag: [],
                ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags: [],
                ConstraintTeacherIntervalMaxDaysPerWeek: [],
                ConstraintTeacherMinRestingHours: [],
                ConstraintTeachersMaxDaysPerWeek: {
                    Active: 0,
                    Max_Days_Per_Week: 0
                },
                ConstraintTeachersMinDaysPerWeek: {
                    Active: 0,
                    Minimum_Days_Per_Week: 0
                },
                ConstraintTeachersNoTwoConsecutiveDays: {
                    Active: 0
                },
                ConstraintTeachersMaxGapsPerDay: {
                    Active: 0,
                    Max_Gaps: 0
                },
                ConstraintTeachersMaxGapsPerWeek: {
                    Active: 0,
                    Max_Gaps: 0
                },
                ConstraintTeachersMaxSingleGapsInSelectedTimeSlots: {
                    Active: 0,
                    Max_Single_Gaps: 0,
                    Selected_Time_Slot: [{
                        Day: '',
                        Hour: ''
                    }]
                },
                ConstraintTeachersMaxHoursDaily: {
                    Active: 0,
                    Maximum_Hours_Daily: 0
                },
                ConstraintTeachersMaxHoursDailyInInterval: {
                    Active: 0,
                    Maximum_Hours_Daily: 0,
                    Interval_Start_Hour: '',
                    Interval_End_Hour: ''
                },
                ConstraintTeachersPairOfMutuallyExclusiveTimeSlots: {
                    First_Time_Slot: {
                        Day: '',
                        Hour: ''
                    },
                    Second_Time_Slot: {
                        Day: '',
                        Hour: ''
                    }
                },
                ConstraintTeachersMaxSpanPerDay: {
                    Active: 0,
                    Max_Span: 0,
                    Allow_One_Day_Exception_of_Plus_One: 0
                },
                ConstraintTeachersActivityTagMaxHoursDaily: {
                    Active: 0,
                    Maximum_Hours_Daily: 0,
                    Activity_Tag: ''
                },
                ConstraintSubjectPreferredRooms: [],
                ConstraintActivityTagPreferredRooms: [],
                ConstraintSubjectActivityTagPreferredRooms: [],
                ConstraintRoomNotAvailableTimes: [],
                ConstraintTeacherRoomNotAvailableTimes: [],
                ConstraintRoomMaxActivityTagsPerDayFromSet: [],
                ConstraintRoomMaxActivityTagsPerWeekFromSet: [],
                ConstraintActivityPreferredRooms:[],
                ConstraintActivitiesSameRoomIfConsecutive:[],
                ConstraintActivitiesOccupyMaxDifferentRooms:[],
                ConstraintTeachersMaxActivityTagsPerDayFromSet: [],
                ConstraintTeachersMinHoursDaily: {
                    Active: 0,
                    Minimum_Hours_Daily: 0,
                    Allow_Empty_Days: false
                },
                ConstraintTeachersActivityTagMinHoursDaily: [],
                ConstraintTeachersMaxHoursContinuously: {
                    Active: 0,
                    Maximum_Hours_Continuously: 0,
                },
                ConstraintTeachersActivityTagMaxHoursContinuously: [],
                ConstraintTeachersMinGapsBetweenActivityTag: [],
                ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags: [],
                ConstraintTeachersIntervalMaxDaysPerWeek: [],
                ConstraintTeachersMinRestingHours: {
                    Active: 0,
                    Minimum_Resting_Hours: 0,
                    Circular: false,
                },
                ConstraintActivityPreferredStartingTime: [],
                ConstraintActivityPreferredStartingTimes: [],
                ConstraintActivityPreferredTimeSlots: [],
                ConstraintActivitiesPreferredStartingTimes: [],
                ConstraintActivitiesPreferredTimeSlots: [],
                ConstraintSubactivitiesPreferredStartingTimes: [],
                ConstraintSubactivitiesPreferredTimeSlots: [],
                ConstraintMinDaysBetweenActivities: [],
                ConstraintMaxDaysBetweenActivities: [],
                ConstraintActivityBeginsStudentsDay: [],
                ConstraintActivitiesBeginStudentsDay: [],
                ConstraintActivityBeginsTeachersDay: [],
                ConstraintActivitiesBeginTeachersDay: [],
                ConstraintActivityEndsStudentsDay: [],
                ConstraintActivitiesEndStudentsDay: [],
                ConstraintActivityEndsTeachersDay: [],
                ConstraintActivitiesEndTeachersDay: [],
                ConstraintActivitiesSameStartingTime: [],
                ConstraintActivitiesSameStartingDay: [],
                ConstraintActivitiesSameStartingHour: [],
                ConstraintActivitiesOccupyMaxTimeSlotsFromSelection: [],
                ConstraintActivitiesOccupyMinTimeSlotsFromSelection: [],
                ConstraintTwoActivitiesOrdered: [],
                ConstraintTwoSetsOfActivitiesOrdered: [],
                ConstraintTwoActivitiesOrderedIfSameDay: [],
                ConstraintTwoActivitiesConsecutive: [],
                ConstraintTwoActivitiesGrouped: [],
                ConstraintThreeActivitiesGrouped: [],
                ConstraintActivitiesMaxHourlySpan: [],
                ConstraintActivitiesNotOverlapping: [],
                ConstraintActivityTagsNotOverlapping: [],
                ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots: [],
                ConstraintActivitiesMinSimultaneousInSelectedTimeSlots: [],
                ConstraintMinGapsBetweenActivities: [],
                ConstraintTeacherHomeRoom: [],
                ConstraintTeacherHomeRooms: [],
                ConstraintTeacherMaxRoomChangesPerDay: [],
                ConstraintTeacherMaxRoomChangesPerDayInInterval: [],
                ConstraintTeacherMaxRoomChangesPerWeek: [],
                ConstraintTeacherMinGapsBetweenRoomChanges: [],
                ConstraintTeacherMaxBuildingChangesPerDay: [],
                ConstraintTeacherMaxBuildingChangesPerDayInInterval: [],
                ConstraintTeacherMaxBuildingChangesPerWeek: [],
                ConstraintTeacherMinGapsBetweenBuildingChanges: [],
                ConstraintTeachersMaxRoomChangesPerDay: {
                    Active: 0,
                    Max_Room_Changes_Per_Day: 0
                },
                ConstraintTeachersMaxRoomChangesPerDayInInterval: {
                    Active: 0,
                    Max_Room_Changes_Per_Day: 0,
                    Interval_Start_Hour: '',
                    Interval_End_Hour: ''
                },
                ConstraintTeachersMaxRoomChangesPerWeek: {
                    Active: 0,
                    Max_Room_Changes_Per_Week: 0
                },
                ConstraintTeachersMinGapsBetweenRoomChanges: {
                    Active: 0,
                    Min_Gaps_Between_Room_Changes: 0
                },
                ConstraintTeachersMaxBuildingChangesPerDay: {
                    Active: 0,
                    Max_Building_Changes_Per_Day: 0
                },
                ConstraintTeachersMaxBuildingChangesPerDayInInterval: {
                    Active: 0,
                    Max_Building_Changes_Per_Day: 0,
                    Interval_Start_Hour: '',
                    Interval_End_Hour: ''
                },
                ConstraintTeachersMaxBuildingChangesPerWeek: {
                    Active: 0,
                    Max_Building_Changes_Per_Week: 0
                },
                ConstraintTeachersMinGapsBetweenBuildingChanges: {
                    Active: 0,
                    Min_Gaps_Between_Building_Changes: 0
                },
                ConstraintStudentsSetHomeRoom: [],
                ConstraintStudentsSetHomeRooms: [],
                ConstraintStudentsSetMaxRoomChangesPerDay: [],
                ConstraintStudentsSetMaxRoomChangesPerDayInInterval: [],
                ConstraintStudentsSetMaxRoomChangesPerWeek: [],
                ConstraintStudentsSetMinGapsBetweenRoomChanges: [],
                ConstraintStudentsSetMaxBuildingChangesPerDay: [],
                ConstraintStudentsSetMaxBuildingChangesPerDayInInterval: [],
                ConstraintStudentsSetMaxBuildingChangesPerWeek: [],
                ConstraintStudentsSetMinGapsBetweenBuildingChanges: [],
                ConstraintStudentsMaxRoomChangesPerDay: {
                    Active: 0,
                    Max_Room_Changes_Per_Day: 0
                },
                ConstraintStudentsMaxRoomChangesPerDayInInterval: {
                    Active: 0,
                    Max_Room_Changes_Per_Day: 0,
                    Interval_Start_Hour: '',
                    Interval_End_Hour: ''
                },
                ConstraintStudentsMaxRoomChangesPerWeek: {
                    Active: 0,
                    Max_Room_Changes_Per_Week: 0
                },
                ConstraintStudentsMinGapsBetweenRoomChanges: {
                    Active: 0,
                    Min_Gaps_Between_Room_Changes: 0
                },
                ConstraintStudentsMaxBuildingChangesPerDay: {
                    Active: 0,
                    Max_Building_Changes_Per_Day: 0
                },
                ConstraintStudentsMaxBuildingChangesPerDayInInterval: {
                    Active: 0,
                    Max_Building_Changes_Per_Day: 0,
                    Interval_Start_Hour: '',
                    Interval_End_Hour: ''
                },
                ConstraintStudentsMaxBuildingChangesPerWeek: {
                    Active: 0,
                    Max_Building_Changes_Per_Week: 0
                },
                ConstraintStudentsMinGapsBetweenBuildingChanges: {
                    Active: 0,
                    Min_Gaps_Between_Building_Changes: 0
                },
                ConstraintStudentsSetNotAvailableTimes: [],
                ConstraintStudentsSetMaxDaysPerWeek: [],
                ConstraintStudentsSetMaxGapsPerDay: [],
                ConstraintStudentsSetMaxGapsPerWeek: [],
                ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots: [],
                ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour: [],
                ConstraintStudentsSetMaxHoursDaily: [],
                ConstraintStudentsSetMaxHoursDailyInInterval: [],
                ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots: [],
                ConstraintStudentsSetMaxSpanPerDay: [],
                ConstraintStudentsSetActivityTagMaxHoursDaily: [],
                ConstraintStudentsSetMaxActivityTagsPerDayFromSet: [],
                ConstraintStudentsSetMinHoursDaily: [],
                ConstraintStudentsSetActivityTagMinHoursDaily: [],
                ConstraintStudentsSetMaxHoursContinuously: [],
                ConstraintStudentsSetActivityTagMaxHoursContinuously: [],
                ConstraintStudentsSetMinGapsBetweenActivityTag: [],
                ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags: [],
                ConstraintStudentsSetIntervalMaxDaysPerWeek: [],
                ConstraintStudentsSetMinRestingHours: [],
                ConstraintStudentsMaxDaysPerWeek: {
                    Active: 0,
                    Max_Days_Per_Week: 0
                },
                ConstraintStudentsMaxGapsPerDay: {
                    Active: 0,
                    Max_Gaps: 0
                },
                ConstraintStudentsMaxGapsPerWeek: {
                    Active: 0,
                    Max_Gaps: 0
                },
                ConstraintStudentsMaxSingleGapsInSelectedTimeSlots: [],
                ConstraintStudentsEarlyMaxBeginningsAtSecondHour: {
                    Active: 0,
                    Max_Beginnings_At_Second_Hour: 0
                },
                ConstraintStudentsMaxHoursDaily: {
                    Active: 0,
                    Maximum_Hours_Daily: 0
                },
                ConstraintStudentsMaxHoursDailyInInterval: [],
                ConstraintStudentsPairOfMutuallyExclusiveTimeSlots: [],
                ConstraintStudentsMaxSpanPerDay: {
                    Active: 0,
                    Max_Span: 0
                },
                ConstraintStudentsActivityTagMaxHoursDaily: [],
                ConstraintStudentsMaxActivityTagsPerDayFromSet: [],
                ConstraintStudentsMinHoursDaily: {
                    Active: 0,
                    Minimum_Hours_Daily: 0,
                    Allow_Empty_Days: 0
                },
                ConstraintStudentsActivityTagMinHoursDaily: [],
                ConstraintStudentsMaxHoursContinuously: {
                    Active: 0,
                    Maximum_Hours_Continuously: 0
                },
                ConstraintStudentsActivityTagMaxHoursContinuously: [],
                ConstraintStudentsMinGapsBetweenActivityTag: [],
                ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags: [],
                ConstraintStudentsIntervalMaxDaysPerWeek: [],
                ConstraintStudentsMinRestingHours: {
                    Active: 0,
                    Minimum_Resting_Hours: 0,
                    Circular: 0
                },
            },
            errors: {},
            submitted: false,
            loading: false,
        };
    },
    created() {
        this.isEditMode = !!this.timetableId;
        if (this.isEditMode) {
            this.loadTimetableData();
        }
    },
    mounted() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000
        };
    },
    methods: {
        async loadTimetableData() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/timetables/${this.timetableId}`);
                this.formData = response.data.data;
                this.isLoaded = true;
            } catch (error) {
                console.error('Erreur:', error);
                toastr.error("Erreur lors du chargement des données");
                this.$router.push('/');
            }
        },
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
        prevStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
            }
        },
        nextStep() {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            }
        },
        goToStep(index) {
            if (index < this.currentStep) {
                this.currentStep = index;
            } else {
                // Pour aller à une étape suivante, on valide d'abord l'étape courante
                if (this.validateCurrentStep()) {
                    this.currentStep = index;
                }
            }
        },
        validateCurrentStep() {
            this.errors = {};
            let isValid = true;
            let errorMessages = [];

            switch (this.currentStep) {
                case 0: // Informations de base
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
                    this.errors.periods = {};
                    this.formData.periods.forEach((period, index) => {
                        if (!period.name.trim()) {
                            this.errors.periods[index] = true;
                            errorMessages.push(`- Le nom de la période ${index + 1} est obligatoire`);
                            isValid = false;
                        }
                    });
                    break;
                
                case 1: // Matières
                    this.errors.subjects = {};
                    this.formData.subjects.forEach((subject, index) => {
                        if (!subject.name.trim()) {
                            this.errors.subjects[index] = true;
                            errorMessages.push(`- Le nom de la matière ${index + 1} est obligatoire`);
                            isValid = false;
                        }
                    });
                    break;
                
                case 2: // Enseignants
                    this.errors.teachers = {};
                    this.formData.teachers.forEach((teacher, index) => {
                        if (!teacher.name.trim()) {
                            this.errors.teachers[index] = true;
                            errorMessages.push(`- Le nom de l'enseignant ${index + 1} est obligatoire`);
                            isValid = false;
                        }
                    });
                    break;
                
                case 3: // Apprenants
                    this.errors.students = {};
                    this.formData.students.forEach((student, index) => {
                        if (!student.name.trim()) {
                            this.errors.students[index] = true;
                            errorMessages.push(`- Le nom du groupe d'apprenants ${index + 1} est obligatoire`);
                            isValid = false;
                        }
                    });
                    break;
                
                case 4: // Salles
                    this.errors.rooms = {};
                    this.formData.rooms.forEach((room, index) => {
                        if (!room.name.trim()) {
                            this.errors.rooms[index] = true;
                            errorMessages.push(`- Le nom de la salle ${index + 1} est obligatoire`);
                            isValid = false;
                        }
                    });
                    break;
                
                case 6: // Activités
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
                    break;
            }

            if (!isValid) {
                toastr.error(errorMessages.join('<br>'));
                this.$nextTick(() => {
                    const firstError = document.querySelector('.is-invalid');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }

            return isValid;
        },
        validateAndSubmit() {
            this.loading = true;
            if (this.validateCurrentStep()) {
                this.submitForm();
            } else {
                this.loading = false;
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
                    this.loading = false;
                    toastr.success("Emploi du temps mis à jour avec succès!");
                    this.$router.push(`/show/${response.data.data.id}`);
                } else {
                    response = await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/timetables`,
                        this.formData
                    );
                    this.loading = false;
                    toastr.success("Emploi du temps créé avec succès!");
                    this.$router.push(`/show/${response.data.data.id}`);
                }
            } catch (error) {
                this.loading = false;
                console.error('Erreur:', error);
                toastr.error(error.response?.data?.error || `Erreur lors de ${this.isEditMode ? 'la mise à jour' : 'la création'}`);
            }
        }
    }
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css';

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-overlay p {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #333;
}

/* Stepper styles */
.stepper-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.stepper-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    cursor: pointer;
}

.stepper-item::before {
    position: absolute;
    content: "";
    border-bottom: 2px solid #ccc;
    width: 100%;
    top: 20px;
    left: -50%;
    z-index: 2;
}

.stepper-item::after {
    position: absolute;
    content: "";
    border-bottom: 2px solid #ccc;
    width: 100%;
    top: 20px;
    left: 50%;
    z-index: 2;
}

.stepper-item .step-counter {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #ccc;
    margin-bottom: 6px;
    color: white;
}

.stepper-item.active .step-counter {
    background: #0d6efd;
}

.stepper-item.completed .step-counter {
    background: #198754;
}

.stepper-item:first-child::before,
.stepper-item:last-child::after {
    content: none;
}

.step-name {
    font-size: 0.9rem;
    text-align: center;
}

/* Step content */
.step-content {
    min-height: 300px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 20px;
}
</style>