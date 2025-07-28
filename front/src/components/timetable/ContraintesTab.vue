<template>
    <div>
        <ul class="nav nav-tabs" id="constraintsTab" role="tablist">
            <li v-for="(tab, index) in mainTabs" :key="index" class="nav-item" role="presentation">
                <button 
                    class="nav-link" 
                    :class="{ active: index === 0 }"
                    :id="`${tab.id}-tab`" 
                    data-bs-toggle="tab" 
                    :data-bs-target="`#${tab.id}`" 
                    type="button" 
                    role="tab"
                >
                    <i :class="tab.icon" class="me-1"></i> {{ tab.label }}
                </button>
            </li>
        </ul>
        <div class="tab-content" id="constraintsTabContent">
            <div class="tab-pane fade show active" id="temporelles" role="tabpanel">
                <ul class="nav nav-tabs" id="temporelTab" role="tablist">
                    <li v-for="(tab, index) in temporalTabs" :key="index" class="nav-item" role="presentation">
                        <button 
                            class="nav-link" 
                            :class="{ active: index === 0 }"
                            :id="`${tab.id}-tab`" 
                            data-bs-toggle="tab" 
                            :data-bs-target="`#${tab.id}`" 
                            type="button" 
                            role="tab"
                        >
                            <i :class="tab.icon"></i> {{ tab.label }}
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="temporelTabContent">
                    <div class="tab-pane fade show active" id="pause" role="tabpanel">
                        <div class="accordion p-3" id="pauseAccordion">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePause">
                                        Temps de pause
                                    </button>
                                </h2>
                                <div id="collapsePause" class="accordion-collapse collapse" data-bs-parent="#pauseAccordion">
                                    <div class="accordion-body">
                                        <ConstraintBreakTimes :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="enseignants" role="tabpanel">
                        <ul class="nav nav-tabs" id="temporelEnseignantTab" role="tablist">
                            <li v-for="(tab, index) in temporalTeacherTabs" :key="index" class="nav-item" role="presentation">
                                <button 
                                    class="nav-link" 
                                    :class="{ active: index === 0 }"
                                    :id="`${tab.id}-tab`" 
                                    data-bs-toggle="tab" 
                                    :data-bs-target="`#${tab.id}`" 
                                    type="button" 
                                    role="tab"
                                >
                                    {{ tab.label }}
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content" id="temporelEnseignantTabContent">
                            <div class="tab-pane fade show active" id="temporelenseignant1" role="tabpanel">
                                <div class="accordion p-3" id="temporelenseignant1Accordion">
                                    <div v-for="(constraint, index) in temporalTeacherConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporelenseignant1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporelenseignant1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporelenseignant1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporelenseignant2" role="tabpanel">
                                <div class="accordion p-3" id="temporelenseignant2Accordion">
                                    <div v-for="(constraint, index) in temporalTeacherConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporelenseignant2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporelenseignant2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporelenseignant2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporelenseignants1" role="tabpanel">
                                <div class="accordion p-3" id="temporelenseignants1Accordion">
                                    <div v-for="(constraint, index) in temporalAllTeachersConstraints1" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporelenseignants1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporelenseignants1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporelenseignants1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporelenseignants2" role="tabpanel">
                                <div class="accordion p-3" id="temporelenseignants2Accordion">
                                    <div v-for="(constraint, index) in temporalAllTeachersConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporelenseignants2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporelenseignants2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporelenseignants2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-for="(tab, index) in temporalTabs.slice(2)" :key="index" class="tab-pane fade" :id="tab.id" role="tabpanel"></div>
                </div>
            </div>
            
            <!-- Main Tab: Spatiales -->
            <div class="tab-pane fade" id="spatiales" role="tabpanel">
                <ul class="nav nav-tabs" id="spatialTab" role="tablist">
                    <li v-for="(tab, index) in spatialTabs" :key="index" class="nav-item" role="presentation">
                        <button 
                            class="nav-link" 
                            :class="{ active: index === 0 }"
                            :id="`${tab.id}-tab`" 
                            data-bs-toggle="tab" 
                            :data-bs-target="`#${tab.id}`" 
                            type="button" 
                            role="tab"
                        >
                            <i :class="tab.icon"></i> {{ tab.label }}
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="spatialTabContent">
                    <div class="tab-pane fade show active" id="spatialmatieres" role="tabpanel">
                        <div class="accordion p-3" id="spatialMatiereConstraintsAccordion">
                            <div v-for="(constraint, index) in spatialMatiereConstraints" :key="index" class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialMatiereConstraintsAccordion${index < 10 ? '0' + index : index}`">
                                        {{ constraint.label }}
                                    </button>
                                </h2>
                                <div :id="`spatialMatiereConstraintsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialMatiereConstraintsAccordion">
                                    <div class="accordion-body">
                                        <component :is="constraint.component" :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="spatialbalises" role="tabpanel">
                        <div class="accordion p-3" id="spatialBaliseConstraintsAccordion">
                            <div v-for="(constraint, index) in spatialBaliseConstraints" :key="index" class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialBaliseConstraintsAccordion${index < 10 ? '0' + index : index}`">
                                        {{ constraint.label }}
                                    </button>
                                </h2>
                                <div :id="`spatialBaliseConstraintsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialBaliseConstraintsAccordion">
                                    <div class="accordion-body">
                                        <component :is="constraint.component" :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="spatialmatieresbalises" role="tabpanel">
                        <div class="accordion p-3" id="spatialMatiereBaliseConstraintsAccordion">
                            <div v-for="(constraint, index) in spatialMatiereBaliseConstraints" :key="index" class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialMatiereBaliseConstraintsAccordion${index < 10 ? '0' + index : index}`">
                                        {{ constraint.label }}
                                    </button>
                                </h2>
                                <div :id="`spatialMatiereBaliseConstraintsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialMatiereBaliseConstraintsAccordion">
                                    <div class="accordion-body">
                                        <component :is="constraint.component" :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="spatialsalles" role="tabpanel">
                        <div class="accordion p-3" id="spatialSalleConstraintsAccordion">
                            <div v-for="(constraint, index) in spatialSalleConstraints" :key="index" class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialSalleConstraintsAccordion${index < 10 ? '0' + index : index}`">
                                        {{ constraint.label }}
                                    </button>
                                </h2>
                                <div :id="`spatialSalleConstraintsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialSalleConstraintsAccordion">
                                    <div class="accordion-body">
                                        <component :is="constraint.component" :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="spatialactivites" role="tabpanel">
                        <div class="accordion p-3" id="spatialActivitesConstraintsAccordion">
                            <div v-for="(constraint, index) in spatialActivitesConstraints" :key="index" class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialActivitesConstraintsAccordion${index < 10 ? '0' + index : index}`">
                                        {{ constraint.label }}
                                    </button>
                                </h2>
                                <div :id="`spatialActivitesConstraintsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialActivitesConstraintsAccordion">
                                    <div class="accordion-body">
                                        <component :is="constraint.component" :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-for="(tab, index) in spatialTabs.slice(5)" :key="index" class="tab-pane fade" :class="{ 'show active': index === 0 }" :id="tab.id" role="tabpanel"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConstraintBreakTimes from './contraintes/temporel/General/ConstraintBreakTimes.vue';
import ConstraintTeacherNotAvailableTimes from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherNotAvailableTimes.vue';
import ConstraintTeacherMaxDaysPerWeek from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxDaysPerWeek.vue';
import ConstraintTeacherMinDaysPerWeek from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMinDaysPerWeek.vue';
import ConstraintTeacherNoTwoConsecutiveDays from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherNoTwoConsecutiveDays.vue';
import ConstraintTeacherMaxGapsPerDay from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxGapsPerDay.vue';
import ConstraintTeacherMaxGapsPerWeek from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxGapsPerWeek.vue';
import ConstraintTeacherMaxSingleGapsInSelectedTimeSlots from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintTeacherMaxHoursDailyInInterval from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxHoursDailyInInterval.vue';
import ConstraintTeacherMaxHoursDaily from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxHoursDaily.vue';
import ConstraintTeacherPairOfMutuallyExclusiveTimeSlots from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintTeacherMaxSpanPerDay from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherMaxSpanPerDay.vue';
import ConstraintTeacherActivityTagMaxHoursDaily from './contraintes/temporel/Enseignant/Enseignant1/ConstraintTeacherActivityTagMaxHoursDaily.vue';
import ConstraintTeacherMaxActivityTagsPerDayFromSet from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherMaxActivityTagsPerDayFromSet.vue';
import ConstraintTeacherMinHoursDaily from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherMinHoursDaily.vue';
import ConstraintTeacherActivityTagMinHoursDaily from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherActivityTagMinHoursDaily.vue';
import ConstraintTeacherMaxHoursContinuously from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherMaxHoursContinuously.vue';
import ConstraintTeacherActivityTagMaxHoursContinuously from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherActivityTagMaxHoursContinuously.vue';
import ConstraintTeacherMinGapsBetweenActivityTag from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherMinGapsBetweenActivityTag.vue';
import ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags.vue';
import ConstraintTeacherIntervalMaxDaysPerWeek from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherIntervalMaxDaysPerWeek.vue';
import ConstraintTeacherMinRestingHours from './contraintes/temporel/Enseignant/Enseignant2/ConstraintTeacherMinRestingHours.vue';
import ConstraintTeachersMaxDaysPerWeek from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxDaysPerWeek.vue';
import ConstraintTeachersMinDaysPerWeek from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMinDaysPerWeek.vue';
import ConstraintTeachersNoTwoConsecutiveDays from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersNoTwoConsecutiveDays.vue';
import ConstraintTeachersMaxGapsPerDay from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxGapsPerDay.vue';
import ConstraintTeachersMaxGapsPerWeek from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxGapsPerWeek.vue';
import ConstraintTeachersMaxSingleGapsInSelectedTimeSlots from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintTeachersMaxHoursDaily from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxHoursDaily.vue';
import ConstraintTeachersMaxHoursDailyInInterval from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxHoursDailyInInterval.vue';
import ConstraintTeachersPairOfMutuallyExclusiveTimeSlots from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintTeachersMaxSpanPerDay from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersMaxSpanPerDay.vue';
import ConstraintTeachersActivityTagMaxHoursDaily from './contraintes/temporel/Enseignant/Enseignants1/ConstraintTeachersActivityTagMaxHoursDaily.vue';
import ConstraintSubjectPreferredRooms from './contraintes/spatial/Matiere/ConstraintSubjectPreferredRooms.vue';
import ConstraintActivityTagPreferredRooms from './contraintes/spatial/Balise/ConstraintActivityTagPreferredRooms.vue';
import ConstraintSubjectActivityTagPreferredRooms from './contraintes/spatial/MatiereBalise/ConstraintSubjectActivityTagPreferredRooms.vue';
import ConstraintRoomNotAvailableTimes from './contraintes/spatial/Salle/ConstraintRoomNotAvailableTimes.vue';
import ConstraintTeacherRoomNotAvailableTimes from './contraintes/spatial/Salle/ConstraintTeacherRoomNotAvailableTimes.vue';
import ConstraintRoomMaxActivityTagsPerDayFromSet from './contraintes/spatial/Salle/ConstraintRoomMaxActivityTagsPerDayFromSet.vue';
import ConstraintRoomMaxActivityTagsPerWeekFromSet from './contraintes/spatial/Salle/ConstraintRoomMaxActivityTagsPerWeekFromSet.vue';
import ConstraintActivityPreferredRooms from './contraintes/spatial/Activity/ConstraintActivityPreferredRooms.vue';
import ConstraintActivitiesSameRoomIfConsecutive from './contraintes/spatial/Activity/ConstraintActivitiesSameRoomIfConsecutive.vue';
import ConstraintActivitiesOccupyMaxDifferentRooms from './contraintes/spatial/Activity/ConstraintActivitiesOccupyMaxDifferentRooms.vue';
import ConstraintTeachersMaxActivityTagsPerDayFromSet from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersMaxActivityTagsPerDayFromSet.vue';
import ConstraintTeachersMinHoursDaily from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersMinHoursDaily.vue';
import ConstraintTeachersActivityTagMinHoursDaily from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersActivityTagMinHoursDaily.vue';
import ConstraintTeachersMaxHoursContinuously from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersMaxHoursContinuously.vue';
import ConstraintTeachersActivityTagMaxHoursContinuously from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersActivityTagMaxHoursContinuously.vue';
import ConstraintTeachersMinGapsBetweenActivityTag from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersMinGapsBetweenActivityTag.vue';
import ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags.vue';
import ConstraintTeachersIntervalMaxDaysPerWeek from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersIntervalMaxDaysPerWeek.vue';
import ConstraintTeachersMinRestingHours from './contraintes/temporel/Enseignant/Enseignants2/ConstraintTeachersMinRestingHours.vue';

export default {
    name: 'ContraintesTab',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    components: {
        ConstraintBreakTimes,
        ConstraintTeacherNotAvailableTimes,
        ConstraintTeacherMaxDaysPerWeek,
        ConstraintTeacherMinDaysPerWeek,
        ConstraintTeacherNoTwoConsecutiveDays,
        ConstraintTeacherMaxGapsPerDay,
        ConstraintTeacherMaxGapsPerWeek,
        ConstraintTeacherMaxSingleGapsInSelectedTimeSlots,
        ConstraintTeacherMaxHoursDailyInInterval,
        ConstraintTeacherMaxHoursDaily,
        ConstraintTeacherPairOfMutuallyExclusiveTimeSlots,
        ConstraintTeacherMaxSpanPerDay,
        ConstraintTeacherActivityTagMaxHoursDaily,
        ConstraintTeacherMaxActivityTagsPerDayFromSet,
        ConstraintTeacherMinHoursDaily,
        ConstraintTeacherActivityTagMinHoursDaily,
        ConstraintTeacherMaxHoursContinuously,
        ConstraintTeacherActivityTagMaxHoursContinuously,
        ConstraintTeacherMinGapsBetweenActivityTag,
        ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags,
        ConstraintTeacherIntervalMaxDaysPerWeek,
        ConstraintTeacherMinRestingHours,
        ConstraintTeachersMaxDaysPerWeek,
        ConstraintTeachersMinDaysPerWeek,
        ConstraintTeachersNoTwoConsecutiveDays,
        ConstraintTeachersMaxGapsPerDay,
        ConstraintTeachersMaxGapsPerWeek,
        ConstraintTeachersMaxSingleGapsInSelectedTimeSlots,
        ConstraintTeachersMaxHoursDaily,
        ConstraintTeachersMaxHoursDailyInInterval,
        ConstraintTeachersPairOfMutuallyExclusiveTimeSlots,
        ConstraintTeachersMaxSpanPerDay,
        ConstraintTeachersActivityTagMaxHoursDaily,
        ConstraintSubjectPreferredRooms,
        ConstraintActivityTagPreferredRooms,
        ConstraintSubjectActivityTagPreferredRooms,
        ConstraintRoomNotAvailableTimes,
        ConstraintTeacherRoomNotAvailableTimes,
        ConstraintRoomMaxActivityTagsPerDayFromSet,
        ConstraintRoomMaxActivityTagsPerWeekFromSet,
        ConstraintActivityPreferredRooms,
        ConstraintActivitiesSameRoomIfConsecutive, 
        ConstraintActivitiesOccupyMaxDifferentRooms,
        ConstraintTeachersMaxActivityTagsPerDayFromSet,
        ConstraintTeachersMinHoursDaily,
        ConstraintTeachersActivityTagMinHoursDaily,
        ConstraintTeachersMaxHoursContinuously,
        ConstraintTeachersActivityTagMaxHoursContinuously,
        ConstraintTeachersMinGapsBetweenActivityTag,
        ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags,
        ConstraintTeachersIntervalMaxDaysPerWeek,
        ConstraintTeachersMinRestingHours
    },
    data() {
        return {
            mainTabs: [
                { id: 'temporelles', label: 'Contraintes temporelles', icon: 'fas fa-clock' },
                { id: 'spatiales', label: 'Contraintes spatiales', icon: 'fas fa-building' }
            ],
            temporalTabs: [
                { id: 'pause', label: 'Temps de pause', icon: 'fa-solid fa-pause' },
                { id: 'enseignants', label: 'Enseignants', icon: 'fas fa-chalkboard-teacher' },
                { id: 'apprenants', label: 'Apprenants', icon: 'fas fa-user-graduate' },
                { id: 'activites', label: 'Activités', icon: 'fas fa-tasks' }
            ],
            temporalTeacherTabs: [
                { id: 'temporelenseignant1', label: 'Un enseignant (1)' },
                { id: 'temporelenseignant2', label: 'Un enseignant (2)' },
                { id: 'temporelenseignants1', label: 'Tous les enseignants (1)' },
                { id: 'temporelenseignants2', label: 'Tous les enseignants (2)' }
            ],
            temporalTeacherConstraints: [
                { 
                    label: 'Un enseignant a des temps non disponibles',
                    component: 'ConstraintTeacherNotAvailableTimes'
                },
                { 
                    label: 'Limite jours par semaine pour un enseignant',
                    component: 'ConstraintTeacherMaxDaysPerWeek'
                },
                { 
                    label: 'Jours minimum par semaine pour un enseignant',
                    component: 'ConstraintTeacherMinDaysPerWeek'
                },
                { 
                    label: 'Un enseignant ne doit pas travailler deux jours consécutifs',
                    component: 'ConstraintTeacherNoTwoConsecutiveDays'
                },
                { 
                    label: 'Limite vides quotidiens pour un enseignant',
                    component: 'ConstraintTeacherMaxGapsPerDay'
                },
                { 
                    label: 'Limite vides par semaine pour un enseignant',
                    component: 'ConstraintTeacherMaxGapsPerWeek'
                },
                { 
                    label: 'Limite vide unique dans les créneaux horaires sélectionnés pour un enseignant',
                    component: 'ConstraintTeacherMaxSingleGapsInSelectedTimeSlots'
                },
                { 
                    label: 'Limite heures quotidiennes pour un enseignant',
                    component: 'ConstraintTeacherMaxHoursDaily'
                },
                { 
                    label: 'Limite heures quotidiennes dans un intervalle horaire pour un enseignant',
                    component: 'ConstraintTeacherMaxHoursDailyInInterval'
                },
                { 
                    label: 'Un enseignant a une paire de créneaux horaires mutuellement exclusifs',
                    component: 'ConstraintTeacherPairOfMutuallyExclusiveTimeSlots'
                },
                { 
                    label: 'Limite amplitude quotidienne pour un enseignant',
                    component: 'ConstraintTeacherMaxSpanPerDay'
                },
                { 
                    label: 'Limite heures quotidiennes avec un code activité pour un enseignant',
                    component: 'ConstraintTeacherActivityTagMaxHoursDaily'
                }
            ],
            temporalTeacherConstraints2: [
                { 
                    label: 'Limite codes activité depuis un jeu par jour pour un enseignant',
                    component: 'ConstraintTeacherMaxActivityTagsPerDayFromSet'
                },
                { 
                    label: 'Heures minimum quotidiennes pour un enseignant',
                    component: 'ConstraintTeacherMinHoursDaily'
                },
                { 
                    label: 'Minimum heures quotidiennes avec un code activité pour un enseignant',
                    component: 'ConstraintTeacherActivityTagMinHoursDaily'
                },
                { 
                    label: 'Limite heures continues pour un enseignant',
                    component: 'ConstraintTeacherMaxHoursContinuously'
                },
                { 
                    label: 'Limite heures continues avec un code activité pour un enseignant',
                    component: 'ConstraintTeacherActivityTagMaxHoursContinuously'
                },
                { 
                    label: 'Vides minimum entre un code activité pour un enseignant',
                    component: 'ConstraintTeacherMinGapsBetweenActivityTag'
                },
                { 
                    label: 'Vides minimum entre un couple ordonné de codes activité pour un enseignant',
                    component: 'ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags'
                },
                { 
                    label: 'Un enseignant travaille dans un intervalle horaire limite jours par semaine',
                    component: 'ConstraintTeacherIntervalMaxDaysPerWeek'
                },
                { 
                    label: 'Heures de repos minimum pour un enseignant',
                    component: 'ConstraintTeacherMinRestingHours'
                }
            ],
            temporalAllTeachersConstraints1: [
                { 
                    label: 'Limite jours par semaine pour les enseignants',
                    component: 'ConstraintTeachersMaxDaysPerWeek'
                },
                { 
                    label: 'Jours minimum par semaine pour les enseignants',
                    component: 'ConstraintTeachersMinDaysPerWeek'
                },
                { 
                    label: 'Tous les enseignants ne doivent pas travailler deux jours consécutifs',
                    component: 'ConstraintTeachersNoTwoConsecutiveDays'
                },
                { 
                    label: 'Limite vides quotidiens pour les enseignants',
                    component: 'ConstraintTeachersMaxGapsPerDay'
                },
                { 
                    label: 'Limite vides par semaine pour les enseignants',
                    component: 'ConstraintTeachersMaxGapsPerWeek'
                },
                { 
                    label: 'Limite vide unique dans les créneaux horaires sélectionnés pour tous les enseignants',
                    component: 'ConstraintTeachersMaxSingleGapsInSelectedTimeSlots'
                },
                { 
                    label: 'Limite heures quotidiennes pour les enseignants',
                    component: 'ConstraintTeachersMaxHoursDaily'
                },
                { 
                    label: 'Limite heures quotidiennes dans un intervalle horaire pour tous les enseignants',
                    component: 'ConstraintTeachersMaxHoursDailyInInterval'
                },
                { 
                    label: 'Tous les enseignants ont une paire de créneaux horaires mutuellement exclusifs',
                    component: 'ConstraintTeachersPairOfMutuallyExclusiveTimeSlots'
                },
                { 
                    label: 'Limite amplitude quotidienne pour tous les enseignants',
                    component: 'ConstraintTeachersMaxSpanPerDay'
                },
                { 
                    label: 'Limite heures quotidiennes avec un code activité pour les enseignants',
                    component: 'ConstraintTeachersActivityTagMaxHoursDaily'
                }
            ],
            temporalAllTeachersConstraints2: [
                                { 
                    label: 'Limite codes activité depuis un jeu par jour pour tous les enseignants',
                    component: 'ConstraintTeachersMaxActivityTagsPerDayFromSet'
                },
                { 
                    label: 'Heures minimum quotidiennes pour les enseignants',
                    component: 'ConstraintTeachersMinHoursDaily'
                },
                { 
                    label: 'Minimum heures quotidiennes avec un code activité pour les enseignants',
                    component: 'ConstraintTeachersActivityTagMinHoursDaily'
                },
                { 
                    label: 'Limite heures continues pour les enseignants',
                    component: 'ConstraintTeachersMaxHoursContinuously'
                },
                { 
                    label: 'Limite heures continues avec un code activité pour les enseignants',
                    component: 'ConstraintTeachersActivityTagMaxHoursContinuously'
                },
                { 
                    label: 'Vides minimum entre un code activité pour tous les enseignants',
                    component: 'ConstraintTeachersMinGapsBetweenActivityTag'
                },
                { 
                    label: 'Vides minimum entre un couple ordonné de codes activité pour tous les enseignants',
                    component: 'ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags'
                },
                { 
                    label: 'Tous les enseignants travaillent dans un intervalle horaire limite jours par semaine',
                    component: 'ConstraintTeachersIntervalMaxDaysPerWeek'
                },
                { 
                    label: 'Heures de repos minimum pour tous les enseignants',
                    component: 'ConstraintTeachersMinRestingHours'
                }
            ],
            spatialTabs: [
                { id: 'spatialmatieres', label: 'Matières', icon: 'fas fa-book' },
                { id: 'spatialbalises', label: 'Balises', icon: 'fas fa-tag' },
                { id: 'spatialmatieresbalises', label: 'Matières et Balises', icon: 'fas fa-brain' },
                { id: 'spatialsalles', label: 'Salles', icon: 'fas fa-door-open' },
                { id: 'spatialactivites', label: 'Activités', icon: 'fas fa-tasks' },
                { id: 'spatialenseignants', label: 'Enseignants', icon: 'fas fa-chalkboard-teacher' },
                { id: 'spatialapprenants', label: 'Apprenants', icon: 'fas fa-user-graduate' },
            ],
            spatialMatiereConstraints: [
                { 
                    label: 'Une matière a un jeu de salles préférées',
                    component: 'ConstraintSubjectPreferredRooms'
                }
            ],
            spatialBaliseConstraints: [
                { 
                    label: 'Un code activité a un jeu de salles préférées',
                    component: 'ConstraintActivityTagPreferredRooms'
                }
            ],
            spatialMatiereBaliseConstraints: [
                { 
                    label: 'Une matière et un code activité ont un jeu de salles préférées',
                    component: 'ConstraintSubjectActivityTagPreferredRooms'
                }
            ],
            spatialSalleConstraints: [
                { 
                    label: 'Une salle a des temps non disponibles',
                    component: 'ConstraintRoomNotAvailableTimes'
                },
                { 
                    label: 'Temps non disponibles pour un enseignant + une salle',
                    component: 'ConstraintTeacherRoomNotAvailableTimes'
                },
                { 
                    label: 'Limite codes activité depuis un jeu par jour pour une salle',
                    component: 'ConstraintRoomMaxActivityTagsPerDayFromSet'
                },
                { 
                    label: 'Limite codes activité depuis un jeu par semaine pour une salle',
                    component: 'ConstraintRoomMaxActivityTagsPerWeekFromSet'
                }
            ],
            spatialActivitesConstraints: [
                { 
                    label: 'Une activité a un jeu de salles préférées',
                    component: 'ConstraintActivityPreferredRooms'
                },
                { 
                    label: 'Un jeu d\'activités est dans la même salle si consécutives',
                    component: 'ConstraintActivitiesSameRoomIfConsecutive'
                },
                { 
                    label: 'Un jeu d\'activités occupe limite salles différentes',
                    component: 'ConstraintActivitiesOccupyMaxDifferentRooms'
                }
            ],
        }
    }
}
</script>