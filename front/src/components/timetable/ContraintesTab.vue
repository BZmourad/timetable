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
            <!-- Main Tab: Temporelles -->
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
                            {{ tab.label }}
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="temporelTabContent">
                    <!-- Pause Tab -->
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
                                        <BreakTimesConstraint :formData="formData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Enseignants Tab -->
                    <div class="tab-pane fade" id="enseignants" role="tabpanel">
                        <ul class="nav nav-tabs" id="temporelEnseignantTab" role="tablist">
                            <li v-for="(tab, index) in teacherTabs" :key="index" class="nav-item" role="presentation">
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
                            <!-- Teacher Tab 1 -->
                            <div class="tab-pane fade show active" id="temporelenseignant1" role="tabpanel">
                                <div class="accordion p-3" id="temporelenseignant1Accordion">
                                    <div v-for="(constraint, index) in teacherConstraints" :key="index" class="accordion-item">
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
                            
                            <!-- Other teacher tabs -->
                            <div v-for="(tab, index) in teacherTabs.slice(1)" :key="index" class="tab-pane fade" :id="tab.id" role="tabpanel"></div>
                        </div>
                    </div>
                    
                    <!-- Other temporal tabs -->
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
                            {{ tab.label }}
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="spatialTabContent">
                    <div v-for="(tab, index) in spatialTabs" :key="index" class="tab-pane fade" :class="{ 'show active': index === 0 }" :id="tab.id" role="tabpanel"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BreakTimesConstraint from './contraintes/temporel/BreakTimesConstraint.vue';
import ConstraintTeacherNotAvailableTimes from './contraintes/temporel/Enseignant/ConstraintTeacherNotAvailableTimes.vue';
import ConstraintTeacherMaxDaysPerWeek from './contraintes/temporel/Enseignant/ConstraintTeacherMaxDaysPerWeek.vue';
import ConstraintTeacherMinDaysPerWeek from './contraintes/temporel/Enseignant/ConstraintTeacherMinDaysPerWeek.vue';
import ConstraintTeacherNoTwoConsecutiveDays from './contraintes/temporel/Enseignant/ConstraintTeacherNoTwoConsecutiveDays.vue';
import ConstraintTeacherMaxGapsPerDay from './contraintes/temporel/Enseignant/ConstraintTeacherMaxGapsPerDay.vue';
import ConstraintTeacherMaxGapsPerWeek from './contraintes/temporel/Enseignant/ConstraintTeacherMaxGapsPerWeek.vue';
import ConstraintTeacherMaxSingleGapsInSelectedTimeSlots from './contraintes/temporel/Enseignant/ConstraintTeacherMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintTeacherMaxHoursDailyInInterval from './contraintes/temporel/Enseignant/ConstraintTeacherMaxHoursDailyInInterval.vue';
import ConstraintTeacherMaxHoursDaily from './contraintes/temporel/Enseignant/ConstraintTeacherMaxHoursDaily.vue';
import ConstraintTeacherPairOfMutuallyExclusiveTimeSlots from './contraintes/temporel/Enseignant/ConstraintTeacherPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintTeacherMaxSpanPerDay from './contraintes/temporel/Enseignant/ConstraintTeacherMaxSpanPerDay.vue';
import ConstraintTeacherActivityTagMaxHoursDaily from './contraintes/temporel/Enseignant/ConstraintTeacherActivityTagMaxHoursDaily.vue';

export default {
    name: 'ContraintesTab',
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    components: {
        BreakTimesConstraint,
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
        ConstraintTeacherActivityTagMaxHoursDaily
    },
    data() {
        return {
            mainTabs: [
                { id: 'temporelles', label: 'Contraintes temporelles', icon: 'fas fa-clock' },
                { id: 'spatiales', label: 'Contraintes spatiales', icon: 'fas fa-building' }
            ],
            temporalTabs: [
                { id: 'pause', label: 'Temps de pause' },
                { id: 'enseignants', label: 'Enseignants' },
                { id: 'apprenants', label: 'Apprenants' },
                { id: 'activites', label: 'Activités' }
            ],
            teacherTabs: [
                { id: 'temporelenseignant1', label: 'Un enseignant (1)' },
                { id: 'temporelenseignant2', label: 'Un enseignant (2)' },
                { id: 'temporelenseignants1', label: 'Tous les enseignants (1)' },
                { id: 'temporelenseignants2', label: 'Tous les enseignants (2)' }
            ],
            spatialTabs: [
                { id: 'matieres', label: 'Matières' },
                { id: 'enseignantsSpatial', label: 'Enseignants' },
                { id: 'apprenantsSpatial', label: 'Apprenants' },
                { id: 'salles', label: 'Salles' },
                { id: 'activitesSpatial', label: 'Activités' }
            ],
            teacherConstraints: [
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
            ]
        }
    }
}
</script>