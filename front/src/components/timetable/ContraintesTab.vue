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
            <div class="tab-pane fade show active" id="temporalles" role="tabpanel">
                <ul class="nav nav-tabs" id="temporalTab" role="tablist">
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
                <div class="tab-content" id="temporalTabContent">
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
                        <ul class="nav nav-tabs" id="temporalEnseignantTab" role="tablist">
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
                        <div class="tab-content" id="temporalEnseignantTabContent">
                            <div class="tab-pane fade show active" id="temporalenseignant1" role="tabpanel">
                                <div class="accordion p-3" id="temporalenseignant1Accordion">
                                    <div v-for="(constraint, index) in temporalTeacherConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalenseignant1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalenseignant1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalenseignant1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalenseignant2" role="tabpanel">
                                <div class="accordion p-3" id="temporalenseignant2Accordion">
                                    <div v-for="(constraint, index) in temporalTeacherConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalenseignant2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalenseignant2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalenseignant2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalenseignants1" role="tabpanel">
                                <div class="accordion p-3" id="temporalenseignants1Accordion">
                                    <div v-for="(constraint, index) in temporalAllTeachersConstraints1" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalenseignants1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalenseignants1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalenseignants1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalenseignants2" role="tabpanel">
                                <div class="accordion p-3" id="temporalenseignants2Accordion">
                                    <div v-for="(constraint, index) in temporalAllTeachersConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalenseignants2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalenseignants2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalenseignants2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="activites" role="tabpanel">
                        <ul class="nav nav-tabs" id="temporalActivityTab" role="tablist">
                            <li v-for="(tab, index) in temporalActivityTabs" :key="index" class="nav-item" role="presentation">
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
                        <div class="tab-content" id="temporalActivityTabContent">
                            <div class="tab-pane fade show active" id="temporalactivity1" role="tabpanel">
                                <div class="accordion p-3" id="temporalActivityConstraints1Accordion">
                                    <div v-for="(constraint, index) in temporalActivityConstraints1" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalActivityConstraints1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalActivityConstraints1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalActivityConstraints1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalactivity2" role="tabpanel">
                                <div class="accordion p-3" id="temporalActivityConstraints2Accordion">
                                    <div v-for="(constraint, index) in temporalActivityConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalActivityConstraints2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalActivityConstraints2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalActivityConstraints2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalactivity3" role="tabpanel">
                                <div class="accordion p-3" id="temporalActivityConstraints3Accordion">
                                    <div v-for="(constraint, index) in temporalActivityConstraints3" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalActivityConstraints3Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalActivityConstraints3Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalActivityConstraints3Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="apprenants" role="tabpanel">
                        <ul class="nav nav-tabs" id="temporalApprenantTab" role="tablist">
                            <li v-for="(tab, index) in temporalStudentTabs" :key="index" class="nav-item" role="presentation">
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
                        <div class="tab-content" id="temporalApprenantTabContent">
                            <div class="tab-pane fade show active" id="temporalapprenant1" role="tabpanel">
                                <div class="accordion p-3" id="temporalapprenant1Accordion">
                                    <div v-for="(constraint, index) in temporalStudentConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalapprenant1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalapprenant1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalapprenant1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalapprenant2" role="tabpanel">
                                <div class="accordion p-3" id="temporalapprenant2Accordion">
                                    <div v-for="(constraint, index) in temporalStudentConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalapprenant2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalapprenant2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalapprenant2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalapprenants1" role="tabpanel">
                                <div class="accordion p-3" id="temporalapprenants1Accordion">
                                    <div v-for="(constraint, index) in temporalAllStudentsConstraints1" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalapprenants1Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalapprenants1Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalapprenants1Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="temporalapprenants2" role="tabpanel">
                                <div class="accordion p-3" id="temporalapprenants2Accordion">
                                    <div v-for="(constraint, index) in temporalAllStudentsConstraints2" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#temporalapprenants2Accordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`temporalapprenants2Accordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#temporalapprenants2Accordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div class="tab-pane fade" id="spatialteachers" role="tabpanel">
                        <ul class="nav nav-tabs" id="spatialEnseignantTab" role="tablist">
                            <li v-for="(tab, index) in spatialTeacherTabs" :key="index" class="nav-item" role="presentation">
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
                        <div class="tab-content" id="spatialEnseignantTabContent">
                            <div class="tab-pane fade show active" id="spatialenseignant" role="tabpanel">
                                <div class="accordion p-3" id="spatialenseignantAccordion">
                                    <div v-for="(constraint, index) in spatialTeacherConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialenseignantAccordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`spatialenseignantAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialenseignantAccordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="spatialenseignants" role="tabpanel">
                                <div class="accordion p-3" id="spatialenseignantsAccordion">
                                    <div v-for="(constraint, index) in spatialAllTeachersConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialenseignantsAccordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`spatialenseignantsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialenseignantsAccordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="spatialapprenants" role="tabpanel">
                        <ul class="nav nav-tabs" id="spatialapprenantsTab" role="tablist">
                            <li v-for="(tab, index) in spatialStudentsTabs" :key="index" class="nav-item" role="presentation">
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
                        <div class="tab-content" id="spatialapprenantsTabContent">
                            <div class="tab-pane fade show active" id="spatialstudent" role="tabpanel">
                                <div class="accordion p-3" id="spatialapprenantAccordion">
                                    <div v-for="(constraint, index) in spatialStudentConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialapprenantAccordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`spatialapprenantAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialapprenantAccordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="spatialstudents" role="tabpanel">
                                <div class="accordion p-3" id="spatialapprenantsAccordion">
                                    <div v-for="(constraint, index) in spatialAllStudentsConstraints" :key="index" class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#spatialapprenantsAccordion${index < 10 ? '0' + index : index}`">
                                                {{ constraint.label }}
                                            </button>
                                        </h2>
                                        <div :id="`spatialapprenantsAccordion${index < 10 ? '0' + index : index}`" class="accordion-collapse collapse" data-bs-parent="#spatialapprenantsAccordion">
                                            <div class="accordion-body">
                                                <component :is="constraint.component" :formData="formData" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConstraintBreakTimes from './contraintes/temporal/General/ConstraintBreakTimes.vue';
import ConstraintTeacherNotAvailableTimes from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherNotAvailableTimes.vue';
import ConstraintTeacherMaxDaysPerWeek from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxDaysPerWeek.vue';
import ConstraintTeacherMinDaysPerWeek from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMinDaysPerWeek.vue';
import ConstraintTeacherNoTwoConsecutiveDays from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherNoTwoConsecutiveDays.vue';
import ConstraintTeacherMaxGapsPerDay from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxGapsPerDay.vue';
import ConstraintTeacherMaxGapsPerWeek from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxGapsPerWeek.vue';
import ConstraintTeacherMaxSingleGapsInSelectedTimeSlots from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintTeacherMaxHoursDailyInInterval from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxHoursDailyInInterval.vue';
import ConstraintTeacherMaxHoursDaily from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxHoursDaily.vue';
import ConstraintTeacherPairOfMutuallyExclusiveTimeSlots from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintTeacherMaxSpanPerDay from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherMaxSpanPerDay.vue';
import ConstraintTeacherActivityTagMaxHoursDaily from './contraintes/temporal/Enseignant/Enseignant1/ConstraintTeacherActivityTagMaxHoursDaily.vue';
import ConstraintTeacherMaxActivityTagsPerDayFromSet from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherMaxActivityTagsPerDayFromSet.vue';
import ConstraintTeacherMinHoursDaily from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherMinHoursDaily.vue';
import ConstraintTeacherActivityTagMinHoursDaily from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherActivityTagMinHoursDaily.vue';
import ConstraintTeacherMaxHoursContinuously from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherMaxHoursContinuously.vue';
import ConstraintTeacherActivityTagMaxHoursContinuously from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherActivityTagMaxHoursContinuously.vue';
import ConstraintTeacherMinGapsBetweenActivityTag from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherMinGapsBetweenActivityTag.vue';
import ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags.vue';
import ConstraintTeacherIntervalMaxDaysPerWeek from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherIntervalMaxDaysPerWeek.vue';
import ConstraintTeacherMinRestingHours from './contraintes/temporal/Enseignant/Enseignant2/ConstraintTeacherMinRestingHours.vue';
import ConstraintTeachersMaxDaysPerWeek from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxDaysPerWeek.vue';
import ConstraintTeachersMinDaysPerWeek from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMinDaysPerWeek.vue';
import ConstraintTeachersNoTwoConsecutiveDays from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersNoTwoConsecutiveDays.vue';
import ConstraintTeachersMaxGapsPerDay from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxGapsPerDay.vue';
import ConstraintTeachersMaxGapsPerWeek from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxGapsPerWeek.vue';
import ConstraintTeachersMaxSingleGapsInSelectedTimeSlots from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintTeachersMaxHoursDaily from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxHoursDaily.vue';
import ConstraintTeachersMaxHoursDailyInInterval from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxHoursDailyInInterval.vue';
import ConstraintTeachersPairOfMutuallyExclusiveTimeSlots from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintTeachersMaxSpanPerDay from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersMaxSpanPerDay.vue';
import ConstraintTeachersActivityTagMaxHoursDaily from './contraintes/temporal/Enseignant/Enseignants1/ConstraintTeachersActivityTagMaxHoursDaily.vue';
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
import ConstraintTeachersMaxActivityTagsPerDayFromSet from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersMaxActivityTagsPerDayFromSet.vue';
import ConstraintTeachersMinHoursDaily from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersMinHoursDaily.vue';
import ConstraintTeachersActivityTagMinHoursDaily from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersActivityTagMinHoursDaily.vue';
import ConstraintTeachersMaxHoursContinuously from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersMaxHoursContinuously.vue';
import ConstraintTeachersActivityTagMaxHoursContinuously from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersActivityTagMaxHoursContinuously.vue';
import ConstraintTeachersMinGapsBetweenActivityTag from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersMinGapsBetweenActivityTag.vue';
import ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags.vue';
import ConstraintTeachersIntervalMaxDaysPerWeek from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersIntervalMaxDaysPerWeek.vue';
import ConstraintTeachersMinRestingHours from './contraintes/temporal/Enseignant/Enseignants2/ConstraintTeachersMinRestingHours.vue';
import ConstraintActivityPreferredStartingTime from './contraintes/temporal/Activity/TempsPreferes/ConstraintActivityPreferredStartingTime.vue';
import ConstraintActivityPreferredStartingTimes from './contraintes/temporal/Activity/TempsPreferes/ConstraintActivityPreferredStartingTimes.vue';
import ConstraintActivityPreferredTimeSlots from './contraintes/temporal/Activity/TempsPreferes/ConstraintActivityPreferredTimeSlots.vue';
import ConstraintActivitiesPreferredStartingTimes from './contraintes/temporal/Activity/TempsPreferes/ConstraintActivitiesPreferredStartingTimes.vue';
import ConstraintActivitiesPreferredTimeSlots from './contraintes/temporal/Activity/TempsPreferes/ConstraintActivitiesPreferredTimeSlots.vue';
import ConstraintSubactivitiesPreferredStartingTimes from './contraintes/temporal/Activity/TempsPreferes/ConstraintSubactivitiesPreferredStartingTimes.vue';
import ConstraintSubactivitiesPreferredTimeSlots from './contraintes/temporal/Activity/TempsPreferes/ConstraintSubactivitiesPreferredTimeSlots.vue';
import ConstraintMinDaysBetweenActivities from './contraintes/temporal/Activity/Autres1/ConstraintMinDaysBetweenActivities.vue';
import ConstraintMaxDaysBetweenActivities from './contraintes/temporal/Activity/Autres1/ConstraintMaxDaysBetweenActivities.vue';
import ConstraintActivityBeginsStudentsDay from './contraintes/temporal/Activity/Autres1/ConstraintActivityBeginsStudentsDay.vue';
import ConstraintActivitiesBeginStudentsDay from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesBeginStudentsDay.vue';
import ConstraintActivityBeginsTeachersDay from './contraintes/temporal/Activity/Autres1/ConstraintActivityBeginsTeachersDay.vue';
import ConstraintActivitiesBeginTeachersDay from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesBeginTeachersDay.vue';
import ConstraintActivityEndsStudentsDay from './contraintes/temporal/Activity/Autres1/ConstraintActivityEndsStudentsDay.vue';
import ConstraintActivitiesEndStudentsDay from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesEndStudentsDay.vue';
import ConstraintActivityEndsTeachersDay from './contraintes/temporal/Activity/Autres1/ConstraintActivityEndsTeachersDay.vue';
import ConstraintActivitiesEndTeachersDay from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesEndTeachersDay.vue';
import ConstraintActivitiesSameStartingTime from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesSameStartingTime.vue';
import ConstraintActivitiesSameStartingDay from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesSameStartingDay.vue';
import ConstraintActivitiesSameStartingHour from './contraintes/temporal/Activity/Autres1/ConstraintActivitiesSameStartingHour.vue';
import ConstraintActivitiesOccupyMaxTimeSlotsFromSelection from './contraintes/temporal/Activity/Autres2/ConstraintActivitiesOccupyMaxTimeSlotsFromSelection.vue';
import ConstraintActivitiesOccupyMinTimeSlotsFromSelection from './contraintes/temporal/Activity/Autres2/ConstraintActivitiesOccupyMinTimeSlotsFromSelection.vue';
import ConstraintTwoActivitiesOrdered from './contraintes/temporal/Activity/Autres2/ConstraintTwoActivitiesOrdered.vue';
import ConstraintTwoSetsOfActivitiesOrdered from './contraintes/temporal/Activity/Autres2/ConstraintTwoSetsOfActivitiesOrdered.vue';
import ConstraintTwoActivitiesOrderedIfSameDay from './contraintes/temporal/Activity/Autres2/ConstraintTwoActivitiesOrderedIfSameDay.vue';
import ConstraintTwoActivitiesConsecutive from './contraintes/temporal/Activity/Autres2/ConstraintTwoActivitiesConsecutive.vue';
import ConstraintTwoActivitiesGrouped from './contraintes/temporal/Activity/Autres2/ConstraintTwoActivitiesGrouped.vue';
import ConstraintThreeActivitiesGrouped from './contraintes/temporal/Activity/Autres2/ConstraintThreeActivitiesGrouped.vue';
import ConstraintActivitiesMaxHourlySpan from './contraintes/temporal/Activity/Autres2/ConstraintActivitiesMaxHourlySpan.vue';
import ConstraintActivitiesNotOverlapping from './contraintes/temporal/Activity/Autres2/ConstraintActivitiesNotOverlapping.vue';
import ConstraintActivityTagsNotOverlapping from './contraintes/temporal/Activity/Autres2/ConstraintActivityTagsNotOverlapping.vue';
import ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots from './contraintes/temporal/Activity/Autres2/ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots.vue';
import ConstraintActivitiesMinSimultaneousInSelectedTimeSlots from './contraintes/temporal/Activity/Autres2/ConstraintActivitiesMinSimultaneousInSelectedTimeSlots.vue';
import ConstraintMinGapsBetweenActivities from './contraintes/temporal/Activity/Autres2/ConstraintMinGapsBetweenActivities.vue';
import ConstraintTeacherHomeRoom from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherHomeRoom.vue';
import ConstraintTeacherHomeRooms from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherHomeRooms.vue';
import ConstraintTeacherMaxRoomChangesPerDay from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMaxRoomChangesPerDay.vue';
import ConstraintTeacherMaxRoomChangesPerDayInInterval from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMaxRoomChangesPerDayInInterval.vue';
import ConstraintTeacherMaxRoomChangesPerWeek from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMaxRoomChangesPerWeek.vue';
import ConstraintTeacherMinGapsBetweenRoomChanges from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMinGapsBetweenRoomChanges.vue';
import ConstraintTeacherMaxBuildingChangesPerDay from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMaxBuildingChangesPerDay.vue';
import ConstraintTeacherMaxBuildingChangesPerDayInInterval from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMaxBuildingChangesPerDayInInterval.vue';
import ConstraintTeacherMaxBuildingChangesPerWeek from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMaxBuildingChangesPerWeek.vue';
import ConstraintTeacherMinGapsBetweenBuildingChanges from './contraintes/spatial/Enseignant/Enseignant/ConstraintTeacherMinGapsBetweenBuildingChanges.vue';
import ConstraintTeachersMaxRoomChangesPerDay from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMaxRoomChangesPerDay.vue';
import ConstraintTeachersMaxRoomChangesPerDayInInterval from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMaxRoomChangesPerDayInInterval.vue';
import ConstraintTeachersMaxRoomChangesPerWeek from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMaxRoomChangesPerWeek.vue';
import ConstraintTeachersMinGapsBetweenRoomChanges from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMinGapsBetweenRoomChanges.vue';
import ConstraintTeachersMaxBuildingChangesPerDay from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMaxBuildingChangesPerDay.vue';
import ConstraintTeachersMaxBuildingChangesPerDayInInterval from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMaxBuildingChangesPerDayInInterval.vue';
import ConstraintTeachersMaxBuildingChangesPerWeek from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMaxBuildingChangesPerWeek.vue';
import ConstraintTeachersMinGapsBetweenBuildingChanges from './contraintes/spatial/Enseignant/Enseignants/ConstraintTeachersMinGapsBetweenBuildingChanges.vue';
import ConstraintStudentsSetHomeRoom from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetHomeRoom.vue';
import ConstraintStudentsSetHomeRooms from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetHomeRooms.vue';
import ConstraintStudentsSetMaxRoomChangesPerDay from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMaxRoomChangesPerDay.vue';
import ConstraintStudentsSetMaxRoomChangesPerDayInInterval from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMaxRoomChangesPerDayInInterval.vue';
import ConstraintStudentsSetMaxRoomChangesPerWeek from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMaxRoomChangesPerWeek.vue';
import ConstraintStudentsSetMinGapsBetweenRoomChanges from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMinGapsBetweenRoomChanges.vue';
import ConstraintStudentsSetMaxBuildingChangesPerDay from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMaxBuildingChangesPerDay.vue';
import ConstraintStudentsSetMaxBuildingChangesPerDayInInterval from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMaxBuildingChangesPerDayInInterval.vue';
import ConstraintStudentsSetMaxBuildingChangesPerWeek from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMaxBuildingChangesPerWeek.vue';
import ConstraintStudentsSetMinGapsBetweenBuildingChanges from './contraintes/spatial/Apprenant/Apprenant/ConstraintStudentsSetMinGapsBetweenBuildingChanges.vue';
import ConstraintStudentsMaxRoomChangesPerDay from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMaxRoomChangesPerDay.vue';
import ConstraintStudentsMaxRoomChangesPerDayInInterval from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMaxRoomChangesPerDayInInterval.vue';
import ConstraintStudentsMaxRoomChangesPerWeek from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMaxRoomChangesPerWeek.vue';
import ConstraintStudentsMinGapsBetweenRoomChanges from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMinGapsBetweenRoomChanges.vue';
import ConstraintStudentsMaxBuildingChangesPerDay from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMaxBuildingChangesPerDay.vue';
import ConstraintStudentsMaxBuildingChangesPerDayInInterval from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMaxBuildingChangesPerDayInInterval.vue';
import ConstraintStudentsMaxBuildingChangesPerWeek from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMaxBuildingChangesPerWeek.vue';
import ConstraintStudentsMinGapsBetweenBuildingChanges from './contraintes/spatial/Apprenant/Apprenants/ConstraintStudentsMinGapsBetweenBuildingChanges.vue';
import ConstraintStudentsSetNotAvailableTimes from './contraintes/temporal/Student/Student1/ConstraintStudentsSetNotAvailableTimes.vue';
import ConstraintStudentsSetMaxDaysPerWeek from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxDaysPerWeek.vue';
import ConstraintStudentsSetMaxGapsPerDay from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxGapsPerDay.vue';
import ConstraintStudentsSetMaxGapsPerWeek from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxGapsPerWeek.vue';
import ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour from './contraintes/temporal/Student/Student1/ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour.vue';
import ConstraintStudentsSetMaxHoursDaily from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxHoursDaily.vue';
import ConstraintStudentsSetMaxHoursDailyInInterval from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxHoursDailyInInterval.vue';
import ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots from './contraintes/temporal/Student/Student1/ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintStudentsSetMaxSpanPerDay from './contraintes/temporal/Student/Student1/ConstraintStudentsSetMaxSpanPerDay.vue';
import ConstraintStudentsSetActivityTagMaxHoursDaily from './contraintes/temporal/Student/Student1/ConstraintStudentsSetActivityTagMaxHoursDaily.vue';
import ConstraintStudentsSetMaxActivityTagsPerDayFromSet from './contraintes/temporal/Student/Student2/ConstraintStudentsSetMaxActivityTagsPerDayFromSet.vue';
import ConstraintStudentsSetMinHoursDaily from './contraintes/temporal/Student/Student2/ConstraintStudentsSetMinHoursDaily.vue';
import ConstraintStudentsSetActivityTagMinHoursDaily from './contraintes/temporal/Student/Student2/ConstraintStudentsSetActivityTagMinHoursDaily.vue';
import ConstraintStudentsSetMaxHoursContinuously from './contraintes/temporal/Student/Student2/ConstraintStudentsSetMaxHoursContinuously.vue';
import ConstraintStudentsSetActivityTagMaxHoursContinuously from './contraintes/temporal/Student/Student2/ConstraintStudentsSetActivityTagMaxHoursContinuously.vue';
import ConstraintStudentsSetMinGapsBetweenActivityTag from './contraintes/temporal/Student/Student2/ConstraintStudentsSetMinGapsBetweenActivityTag.vue';
import ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags from './contraintes/temporal/Student/Student2/ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags.vue';
import ConstraintStudentsSetIntervalMaxDaysPerWeek from './contraintes/temporal/Student/Student2/ConstraintStudentsSetIntervalMaxDaysPerWeek.vue';
import ConstraintStudentsSetMinRestingHours from './contraintes/temporal/Student/Student2/ConstraintStudentsSetMinRestingHours.vue';
import ConstraintStudentsMaxDaysPerWeek from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxDaysPerWeek.vue';
import ConstraintStudentsMaxGapsPerDay from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxGapsPerDay.vue';
import ConstraintStudentsMaxGapsPerWeek from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxGapsPerWeek.vue';
import ConstraintStudentsMaxSingleGapsInSelectedTimeSlots from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxSingleGapsInSelectedTimeSlots.vue';
import ConstraintStudentsEarlyMaxBeginningsAtSecondHour from './contraintes/temporal/Student/Students1/ConstraintStudentsEarlyMaxBeginningsAtSecondHour.vue';
import ConstraintStudentsMaxHoursDaily from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxHoursDaily.vue';
import ConstraintStudentsMaxHoursDailyInInterval from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxHoursDailyInInterval.vue';
import ConstraintStudentsPairOfMutuallyExclusiveTimeSlots from './contraintes/temporal/Student/Students1/ConstraintStudentsPairOfMutuallyExclusiveTimeSlots.vue';
import ConstraintStudentsMaxSpanPerDay from './contraintes/temporal/Student/Students1/ConstraintStudentsMaxSpanPerDay.vue';
import ConstraintStudentsActivityTagMaxHoursDaily from './contraintes/temporal/Student/Students1/ConstraintStudentsActivityTagMaxHoursDaily.vue';
import ConstraintStudentsMaxActivityTagsPerDayFromSet from './contraintes/temporal/Student/Students2/ConstraintStudentsMaxActivityTagsPerDayFromSet.vue';
import ConstraintStudentsMinHoursDaily from './contraintes/temporal/Student/Students2/ConstraintStudentsMinHoursDaily.vue';
import ConstraintStudentsActivityTagMinHoursDaily from './contraintes/temporal/Student/Students2/ConstraintStudentsActivityTagMinHoursDaily.vue';
import ConstraintStudentsMaxHoursContinuously from './contraintes/temporal/Student/Students2/ConstraintStudentsMaxHoursContinuously.vue';
import ConstraintStudentsActivityTagMaxHoursContinuously from './contraintes/temporal/Student/Students2/ConstraintStudentsActivityTagMaxHoursContinuously.vue';
import ConstraintStudentsMinGapsBetweenActivityTag from './contraintes/temporal/Student/Students2/ConstraintStudentsMinGapsBetweenActivityTag.vue';
import ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags from './contraintes/temporal/Student/Students2/ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags.vue';
import ConstraintStudentsIntervalMaxDaysPerWeek from './contraintes/temporal/Student/Students2/ConstraintStudentsIntervalMaxDaysPerWeek.vue';
import ConstraintStudentsMinRestingHours from './contraintes/temporal/Student/Students2/ConstraintStudentsMinRestingHours.vue';

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
        ConstraintTeachersMinRestingHours,
        ConstraintActivityPreferredStartingTime,
        ConstraintActivityPreferredStartingTimes,
        ConstraintActivityPreferredTimeSlots,
        ConstraintActivitiesPreferredStartingTimes,
        ConstraintActivitiesPreferredTimeSlots,
        ConstraintSubactivitiesPreferredStartingTimes,
        ConstraintSubactivitiesPreferredTimeSlots,
        ConstraintMinDaysBetweenActivities,
        ConstraintMaxDaysBetweenActivities,
        ConstraintActivityBeginsStudentsDay,
        ConstraintActivitiesBeginStudentsDay,
        ConstraintActivityBeginsTeachersDay,
        ConstraintActivitiesBeginTeachersDay,
        ConstraintActivityEndsStudentsDay,
        ConstraintActivitiesEndStudentsDay,
        ConstraintActivityEndsTeachersDay,
        ConstraintActivitiesEndTeachersDay,
        ConstraintActivitiesSameStartingTime,
        ConstraintActivitiesSameStartingDay,
        ConstraintActivitiesSameStartingHour,
        ConstraintActivitiesOccupyMaxTimeSlotsFromSelection,
        ConstraintActivitiesOccupyMinTimeSlotsFromSelection,
        ConstraintTwoActivitiesOrdered,
        ConstraintTwoSetsOfActivitiesOrdered,
        ConstraintTwoActivitiesOrderedIfSameDay,
        ConstraintTwoActivitiesConsecutive,
        ConstraintTwoActivitiesGrouped,
        ConstraintThreeActivitiesGrouped,
        ConstraintActivitiesMaxHourlySpan,
        ConstraintActivitiesNotOverlapping,
        ConstraintActivityTagsNotOverlapping,
        ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots,
        ConstraintActivitiesMinSimultaneousInSelectedTimeSlots,
        ConstraintMinGapsBetweenActivities,
        ConstraintTeacherHomeRoom,
        ConstraintTeacherHomeRooms,
        ConstraintTeacherMaxRoomChangesPerDay,
        ConstraintTeacherMaxRoomChangesPerDayInInterval,
        ConstraintTeacherMaxRoomChangesPerWeek,
        ConstraintTeacherMinGapsBetweenRoomChanges,
        ConstraintTeacherMaxBuildingChangesPerDay,
        ConstraintTeacherMaxBuildingChangesPerDayInInterval,
        ConstraintTeacherMaxBuildingChangesPerWeek,
        ConstraintTeacherMinGapsBetweenBuildingChanges,
        ConstraintTeachersMaxRoomChangesPerDay,
        ConstraintTeachersMaxRoomChangesPerDayInInterval,
        ConstraintTeachersMaxRoomChangesPerWeek,
        ConstraintTeachersMinGapsBetweenRoomChanges,
        ConstraintTeachersMaxBuildingChangesPerDay,
        ConstraintTeachersMaxBuildingChangesPerDayInInterval,
        ConstraintTeachersMaxBuildingChangesPerWeek,
        ConstraintTeachersMinGapsBetweenBuildingChanges,
        ConstraintStudentsSetHomeRoom,
        ConstraintStudentsSetHomeRooms,
        ConstraintStudentsSetMaxRoomChangesPerDay,
        ConstraintStudentsSetMaxRoomChangesPerDayInInterval,
        ConstraintStudentsSetMaxRoomChangesPerWeek,
        ConstraintStudentsSetMinGapsBetweenRoomChanges,
        ConstraintStudentsSetMaxBuildingChangesPerDay,
        ConstraintStudentsSetMaxBuildingChangesPerDayInInterval,
        ConstraintStudentsSetMaxBuildingChangesPerWeek,
        ConstraintStudentsSetMinGapsBetweenBuildingChanges,
        ConstraintStudentsMaxRoomChangesPerDay,
        ConstraintStudentsMaxRoomChangesPerDayInInterval,
        ConstraintStudentsMaxRoomChangesPerWeek,
        ConstraintStudentsMinGapsBetweenRoomChanges,
        ConstraintStudentsMaxBuildingChangesPerDay,
        ConstraintStudentsMaxBuildingChangesPerDayInInterval,
        ConstraintStudentsMaxBuildingChangesPerWeek,
        ConstraintStudentsMinGapsBetweenBuildingChanges,
        ConstraintStudentsSetNotAvailableTimes,
        ConstraintStudentsSetMaxDaysPerWeek,
        ConstraintStudentsSetMaxGapsPerDay,
        ConstraintStudentsSetMaxGapsPerWeek,
        ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots,
        ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour,
        ConstraintStudentsSetMaxHoursDaily,
        ConstraintStudentsSetMaxHoursDailyInInterval,
        ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots,
        ConstraintStudentsSetMaxSpanPerDay,
        ConstraintStudentsSetActivityTagMaxHoursDaily,
        ConstraintStudentsSetMaxActivityTagsPerDayFromSet,
        ConstraintStudentsSetMinHoursDaily,
        ConstraintStudentsSetActivityTagMinHoursDaily,
        ConstraintStudentsSetMaxHoursContinuously,
        ConstraintStudentsSetActivityTagMaxHoursContinuously,
        ConstraintStudentsSetMinGapsBetweenActivityTag,
        ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags,
        ConstraintStudentsSetIntervalMaxDaysPerWeek,
        ConstraintStudentsSetMinRestingHours,
        ConstraintStudentsMaxDaysPerWeek,
        ConstraintStudentsMaxGapsPerDay,
        ConstraintStudentsMaxGapsPerWeek,
        ConstraintStudentsMaxSingleGapsInSelectedTimeSlots,
        ConstraintStudentsEarlyMaxBeginningsAtSecondHour,
        ConstraintStudentsMaxHoursDaily,
        ConstraintStudentsMaxHoursDailyInInterval,
        ConstraintStudentsPairOfMutuallyExclusiveTimeSlots,
        ConstraintStudentsMaxSpanPerDay,
        ConstraintStudentsActivityTagMaxHoursDaily,
        ConstraintStudentsMaxActivityTagsPerDayFromSet,
        ConstraintStudentsMinHoursDaily,
        ConstraintStudentsActivityTagMinHoursDaily,
        ConstraintStudentsMaxHoursContinuously,
        ConstraintStudentsActivityTagMaxHoursContinuously,
        ConstraintStudentsMinGapsBetweenActivityTag,
        ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags,
        ConstraintStudentsIntervalMaxDaysPerWeek,
        ConstraintStudentsMinRestingHours,
    },
    data() {
        return {
            mainTabs: [
                { id: 'temporalles', label: 'Contraintes temporalles', icon: 'fas fa-clock' },
                { id: 'spatiales', label: 'Contraintes spatiales', icon: 'fas fa-building' }
            ],
            temporalTabs: [
                { id: 'pause', label: 'Temps de pause', icon: 'fa-solid fa-pause' },
                { id: 'enseignants', label: 'Enseignants', icon: 'fas fa-chalkboard-teacher' },
                { id: 'apprenants', label: 'Apprenants', icon: 'fas fa-user-graduate' },
                { id: 'activites', label: 'Activités', icon: 'fas fa-tasks' }
            ],
            temporalTeacherTabs: [
                { id: 'temporalenseignant1', label: 'Un enseignant (1)' },
                { id: 'temporalenseignant2', label: 'Un enseignant (2)' },
                { id: 'temporalenseignants1', label: 'Tous les enseignants (1)' },
                { id: 'temporalenseignants2', label: 'Tous les enseignants (2)' }
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
            temporalActivityTabs: [
                { id: 'temporalactivity1', label: 'Temps préférés' },
                { id: 'temporalactivity2', label: 'Autres (1)' },
                { id: 'temporalactivity3', label: 'Autres (2)' }
            ],
            temporalActivityConstraints1: [
                { 
                    label: 'Une activité a un temps préféré de démarrage',
                    component: 'ConstraintActivityPreferredStartingTime'
                },
                { 
                    label: 'Une activité a un jeu de temps préférés de démarrage',
                    component: 'ConstraintActivityPreferredStartingTimes'
                },
                { 
                    label: 'Un activité a un jeu de créneaux horaires préférés',
                    component: 'ConstraintActivityPreferredTimeSlots'
                },
                { 
                    label: 'Un jeu d\'activités a un jeu de temps préférés de démarrage',
                    component: 'ConstraintActivitiesPreferredStartingTimes'
                },
                { 
                    label: 'Un jeu d\'activités a un jeu de créneaux horaires préférés',
                    component: 'ConstraintActivitiesPreferredTimeSlots'
                },
                { 
                    label: 'Un jeu de sous-activités a un jeu de temps préférés de démarrage',
                    component: 'ConstraintSubactivitiesPreferredStartingTimes'
                },
                { 
                    label: 'Un jeu de sous-activités a un jeu de créneaux horaires préférés',
                    component: 'ConstraintSubactivitiesPreferredTimeSlots'
                }
            ],
            temporalActivityConstraints2: [
                { 
                    label: 'Jours minimum entre un jeu d\'activités',
                    component: 'ConstraintMinDaysBetweenActivities'
                },
                { 
                    label: 'Limite jours entre un jeu d\'activités',
                    component: 'ConstraintMaxDaysBetweenActivities'
                },
                { 
                    label: 'Une activité débute la journée des apprenants',
                    component: 'ConstraintActivityBeginsStudentsDay'
                },
                { 
                    label: 'Un jeu d\'activités débute la journée des apprenants',
                    component: 'ConstraintActivitiesBeginStudentsDay'
                },
                { 
                    label: 'Une activité débute journée enseignants',
                    component: 'ConstraintActivityBeginsTeachersDay'
                },
                { 
                    label: 'Un jeu d\'activités débute la journée des enseignants',
                    component: 'ConstraintActivitiesBeginTeachersDay'
                },
                { 
                    label: 'Une activité termine la journée des apprenants',
                    component: 'ConstraintActivityEndsStudentsDay'
                },
                { 
                    label: 'Un jeu d\'activités termine la journée des apprenants',
                    component: 'ConstraintActivitiesEndStudentsDay'
                },
                { 
                    label: 'Une activité termine la journée des enseignants',
                    component: 'ConstraintActivityEndsTeachersDay'
                },
                { 
                    label: 'Un jeu d\'activités termine la journée des enseignants',
                    component: 'ConstraintActivitiesEndTeachersDay'
                },
                { 
                    label: 'Un jeu d\'activités a le même temps de démarrage (jour et heure)',
                    component: 'ConstraintActivitiesSameStartingTime'
                },
                { 
                    label: 'Un jeu d\'activités a le même jour de démarrage (n\'importe quelle heure) ',
                    component: 'ConstraintActivitiesSameStartingDay'
                },
                { 
                    label: 'Un jeu d\'activités a la même heure de démarrage (n\'importe quel jour)',
                    component: 'ConstraintActivitiesSameStartingHour'
                }
            ],
            temporalActivityConstraints3: [
                { 
                    label: 'Un jeu d\'activités occupe un nombre maximum de créneaux dans une sélection',
                    component: 'ConstraintActivitiesOccupyMaxTimeSlotsFromSelection'
                },
                { 
                    label: 'Un jeu d\'activités occupe un nombre minimum de créneaux dans une sélection',
                    component: 'ConstraintActivitiesOccupyMinTimeSlotsFromSelection'
                },
                { 
                    label: 'Deux activités sont ordonnées',
                    component: 'ConstraintTwoActivitiesOrdered'
                },
                { 
                    label: 'Deux jeux d\'activités sont ordonnés',
                    component: 'ConstraintTwoSetsOfActivitiesOrdered'
                },
                { 
                    label: 'Deux activités sont ordonnées si elles ont lieu le même jour',
                    component: 'ConstraintTwoActivitiesOrderedIfSameDay'
                },
                { 
                    label: 'Deux activités sont consécutives',
                    component: 'ConstraintTwoActivitiesConsecutive'
                },
                { 
                    label: 'Deux activités sont groupées',
                    component: 'ConstraintTwoActivitiesGrouped'
                },
                { 
                    label: 'Trois activités sont groupées',
                    component: 'ConstraintThreeActivitiesGrouped'
                },
                { 
                    label: 'Écart maximal horaire d\'un jeu d\'activités',
                    component: 'ConstraintActivitiesMaxHourlySpan'
                },
                { 
                    label: 'Un jeu d\'activités est sans chevauchement',
                    component: 'ConstraintActivitiesNotOverlapping'
                },
                { 
                    label: 'Un jeu de codes activité est sans chevauchement',
                    component: 'ConstraintActivityTagsNotOverlapping'
                },
                { 
                    label: 'Limite activités simultanées dans un jeu dans des créneaux horaires sélectionnés',
                    component: 'ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots'
                },
                { 
                    label: 'Minimum activités simultanées dans un jeu dans des créneaux horaires sélectionnés ',
                    component: 'ConstraintActivitiesMinSimultaneousInSelectedTimeSlots'
                },
                { 
                    label: 'Vides minimum (heures) entre un jeu d\'activités',
                    component: 'ConstraintMinGapsBetweenActivities'
                }
            ],
            spatialTabs: [
                { id: 'spatialmatieres', label: 'Matières', icon: 'fas fa-book' },
                { id: 'spatialbalises', label: 'Balises', icon: 'fas fa-tag' },
                { id: 'spatialteachers', label: 'Enseignants', icon: 'fas fa-chalkboard-teacher' },
                { id: 'spatialapprenants', label: 'Apprenants', icon: 'fas fa-user-graduate' },
                { id: 'spatialsalles', label: 'Salles', icon: 'fas fa-door-open' },
                { id: 'spatialactivites', label: 'Activités', icon: 'fas fa-tasks' },
                { id: 'spatialmatieresbalises', label: 'Matières et Balises', icon: 'fas fa-brain' },
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
            spatialTeacherTabs: [
                { id: 'spatialenseignant', label: 'Un enseignant' },
                { id: 'spatialenseignants', label: 'Tous les enseignants' }
            ],
            spatialTeacherConstraints: [
                { 
                    label: 'Un enseignant a une salle de référence',
                    component: 'ConstraintTeacherHomeRoom'
                },
                { 
                    label: 'Un enseignant a un jeu de salles de référence',
                    component: 'ConstraintTeacherHomeRooms'
                },
                { 
                    label: 'Limite changements salles quotidiens pour un enseignant',
                    component: 'ConstraintTeacherMaxRoomChangesPerDay'
                },
                { 
                    label: 'Limite changements salles quotidiens dans un intervalle horaire pour un enseignant',
                    component: 'ConstraintTeacherMaxRoomChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements salles hebdomadaires pour un enseignant',
                    component: 'ConstraintTeacherMaxRoomChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements salles pour un enseignant',
                    component: 'ConstraintTeacherMinGapsBetweenRoomChanges'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens pour un enseignant',
                    component: 'ConstraintTeacherMaxBuildingChangesPerDay'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens dans un intervalle horaire pour un enseignant',
                    component: 'ConstraintTeacherMaxBuildingChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements bâtiments par semaine pour un enseignant',
                    component: 'ConstraintTeacherMaxBuildingChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements bâtiments pour un enseignant',
                    component: 'ConstraintTeacherMinGapsBetweenBuildingChanges'
                }
            ],
            spatialAllTeachersConstraints: [
                { 
                    label: 'Limite changements salles quotidiens pour tous les enseignants',
                    component: 'ConstraintTeachersMaxRoomChangesPerDay'
                },
                { 
                    label: 'Limite changements salles quotidiens dans un intervalle horaire pour tous les enseignants',
                    component: 'ConstraintTeachersMaxRoomChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements salles hebdomadaires pour tous les enseignants',
                    component: 'ConstraintTeachersMaxRoomChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements salles pour tous les enseignants',
                    component: 'ConstraintTeachersMinGapsBetweenRoomChanges'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens pour les enseignants',
                    component: 'ConstraintTeachersMaxBuildingChangesPerDay'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens dans un intervalle horaire pour tous les enseignants',
                    component: 'ConstraintTeachersMaxBuildingChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements bâtiments par semaine pour les enseignants',
                    component: 'ConstraintTeachersMaxBuildingChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements bâtiments pour les enseignants',
                    component: 'ConstraintTeachersMinGapsBetweenBuildingChanges'
                }
            ],
            spatialStudentsTabs: [
                { id: 'spatialstudent', label: 'Un groupe d\'apprenant' },
                { id: 'spatialstudents', label: 'Tous les apprenants' }
            ],
            spatialStudentConstraints: [
                { 
                    label: 'Un jeu d\'apprenants a une salle de référence',
                    component: 'ConstraintStudentsSetHomeRoom'
                },
                { 
                    label: 'Un jeu d\'apprenants a un jeu de salles de référence',
                    component: 'ConstraintStudentsSetHomeRooms'
                },
                { 
                    label: 'Limite changements salles quotidiens pour un groupe',
                    component: 'ConstraintStudentsSetMaxRoomChangesPerDay'
                },
                { 
                    label: 'Limite changements salles quotidiens dans un intervalle horaire pour un groupe',
                    component: 'ConstraintStudentsSetMaxRoomChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements salles hebdomadaires pour un groupe',
                    component: 'ConstraintStudentsSetMaxRoomChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements salles pour un groupe',
                    component: 'ConstraintStudentsSetMinGapsBetweenRoomChanges'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens pour un groupe',
                    component: 'ConstraintStudentsSetMaxBuildingChangesPerDay'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens dans un intervalle horaire pour un groupe',
                    component: 'ConstraintStudentsSetMaxBuildingChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements bâtiments par semaine pour un groupe',
                    component: 'ConstraintStudentsSetMaxBuildingChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements bâtiments pour un groupe',
                    component: 'ConstraintStudentsSetMinGapsBetweenBuildingChanges'
                }
            ],
            spatialAllStudentsConstraints: [
                { 
                    label: 'Limite changements salles quotidiens pour tous les apprenants',
                    component: 'ConstraintStudentsMaxRoomChangesPerDay'
                },
                { 
                    label: 'Limite changements salles quotidiens dans un intervalle horaire pour tous les apprenants',
                    component: 'ConstraintStudentsMaxRoomChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements salles hebdomadaires pour tous les apprenants',
                    component: 'ConstraintStudentsMaxRoomChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements salles pour tous les apprenants',
                    component: 'ConstraintStudentsMinGapsBetweenRoomChanges'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens pour les apprenants',
                    component: 'ConstraintStudentsMaxBuildingChangesPerDay'
                },
                { 
                    label: 'Limite changements bâtiments quotidiens dans un intervalle horaire pour tous les apprenants',
                    component: 'ConstraintStudentsMaxBuildingChangesPerDayInInterval'
                },
                { 
                    label: 'Limite changements bâtiments par semaine pour les apprenants',
                    component: 'ConstraintStudentsMaxBuildingChangesPerWeek'
                },
                { 
                    label: 'Vides minimum entre changements bâtiments pour les apprenants',
                    component: 'ConstraintStudentsMinGapsBetweenBuildingChanges'
                }
            ],
            temporalStudentTabs: [
                { id: 'temporalapprenant1', label: 'Un groupe d\'apprenant (1)' },
                { id: 'temporalapprenant2', label: 'Un groupe d\'apprenant (2)' },
                { id: 'temporalapprenants1', label: 'Tous les apprenants (1)' },
                { id: 'temporalapprenants2', label: 'Tous les apprenants (2)' }
            ],
            temporalStudentConstraints: [
                { 
                    label: 'Un groupe a des temps non disponibles',
                    component: 'ConstraintStudentsSetNotAvailableTimes'
                },
                { 
                    label: 'Limite jours par semaine pour un groupe',
                    component: 'ConstraintStudentsSetMaxDaysPerWeek'
                },
                { 
                    label: 'Limite vides quotidiens pour un groupe',
                    component: 'ConstraintStudentsSetMaxGapsPerDay'
                },
                { 
                    label: 'Limite vides par semaine pour un groupe',
                    component: 'ConstraintStudentsSetMaxGapsPerWeek'
                },
                { 
                    label: 'Limite vide unique dans les créneaux horaires sélectionnés pour un groupe',
                    component: 'ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots'
                },
                { 
                    label: 'Un groupe débute tôt (limite débuts en seconde heure)',
                    component: 'ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour'
                },
                { 
                    label: 'Limite heures quotidiennes pour un groupe',
                    component: 'ConstraintStudentsSetMaxHoursDaily'
                },
                { 
                    label: 'Limite heures quotidiennes dans un intervalle horaire pour un groupe',
                    component: 'ConstraintStudentsSetMaxHoursDailyInInterval'
                },
                { 
                    label: 'Un groupe a une paire de créneaux horaires mutuellement exclusifs',
                    component: 'ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots'
                },
                { 
                    label: 'Limite amplitude quotidienne pour un groupe',
                    component: 'ConstraintStudentsSetMaxSpanPerDay'
                },
                { 
                    label: 'Limite heures quotidiennes avec un code activité pour un groupe',
                    component: 'ConstraintStudentsSetActivityTagMaxHoursDaily'
                }
            ],
            temporalStudentConstraints2: [
                { 
                    label: 'Limite codes activité depuis un jeu par jour pour un groupe',
                    component: 'ConstraintStudentsSetMaxActivityTagsPerDayFromSet'
                },
                { 
                    label: 'Heures minimum quotidiennes pour un groupe',
                    component: 'ConstraintStudentsSetMinHoursDaily'
                },
                { 
                    label: 'Minimum heures quotidiennes avec un code activité pour un groupe',
                    component: 'ConstraintStudentsSetActivityTagMinHoursDaily'
                },
                { 
                    label: 'Limite heures continues pour un groupe',
                    component: 'ConstraintStudentsSetMaxHoursContinuously'
                },
                { 
                    label: 'Limite heures continues avec un code activité pour un groupe',
                    component: 'ConstraintStudentsSetActivityTagMaxHoursContinuously'
                },
                { 
                    label: 'Vides minimum entre un code activité pour un groupe',
                    component: 'ConstraintStudentsSetMinGapsBetweenActivityTag'
                },
                { 
                    label: 'Vides minimum entre un couple ordonné de codes activité pour un groupe',
                    component: 'ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags'
                },
                { 
                    label: 'Un groupe travaille dans un intervalle horaire limite jours par semaine',
                    component: 'ConstraintStudentsSetIntervalMaxDaysPerWeek'
                },
                { 
                    label: 'Heures de repos minimum pour un groupe',
                    component: 'ConstraintStudentsSetMinRestingHours'
                }
            ],
            temporalAllStudentsConstraints1: [
                { 
                    label: 'Limite jours par semaine pour les apprenants',
                    component: 'ConstraintStudentsMaxDaysPerWeek'
                },
                { 
                    label: 'Limite vides quotidiens pour les apprenants',
                    component: 'ConstraintStudentsMaxGapsPerDay'
                },
                { 
                    label: 'Limite vides par semaine pour les apprenants',
                    component: 'ConstraintStudentsMaxGapsPerWeek'
                },
                { 
                    label: 'Limite vide unique dans les créneaux horaires sélectionnés pour tous les apprenants',
                    component: 'ConstraintStudentsMaxSingleGapsInSelectedTimeSlots'
                },
                { 
                    label: 'Tous les apprenants débutent tôt (limite débuts en seconde heure)',
                    component: 'ConstraintStudentsEarlyMaxBeginningsAtSecondHour'
                },
                { 
                    label: 'Limite heures quotidiennes par les apprenants',
                    component: 'ConstraintStudentsMaxHoursDaily'
                },
                { 
                    label: 'Limite heures quotidiennes dans un intervalle horaire pour tous les apprenants',
                    component: 'ConstraintStudentsMaxHoursDailyInInterval'
                },
                { 
                    label: 'Tous les apprenants ont une paire de créneaux horaires mutuellement exclusifs',
                    component: 'ConstraintStudentsPairOfMutuallyExclusiveTimeSlots'
                },
                { 
                    label: 'Limite amplitude quotidienne pour tous les apprenants',
                    component: 'ConstraintStudentsMaxSpanPerDay'
                },
                { 
                    label: 'Limite heures quotidiennes avec un code activité pour les apprenants',
                    component: 'ConstraintStudentsActivityTagMaxHoursDaily'
                }
            ],
            temporalAllStudentsConstraints2: [
                {
                    label: 'Limite codes activité depuis un jeu par jour pour tous les apprenants',
                    component: 'ConstraintStudentsMaxActivityTagsPerDayFromSet'
                },
                {
                    label: 'Heures minimum quotidiennes pour les apprenants',
                    component: 'ConstraintStudentsMinHoursDaily'
                },
                {
                    label: 'Minimum heures quotidiennes avec un code activité pour tous les apprenants',
                    component: 'ConstraintStudentsActivityTagMinHoursDaily'
                },
                {
                    label: 'Limite heures continues pour les apprenants',
                    component: 'ConstraintStudentsMaxHoursContinuously'
                },
                {
                    label: 'Limite heures continues avec un code activité pour les apprenants',
                    component: 'ConstraintStudentsActivityTagMaxHoursContinuously'
                },
                {
                    label: 'Vides minimum entre un code activité pour tous les apprenants',
                    component: 'ConstraintStudentsMinGapsBetweenActivityTag'
                },
                {
                    label: 'Vides minimum entre un couple ordonné de codes activité pour tous les apprenants',
                    component: 'ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags'
                },
                {
                    label: 'Tous les apprenants travaillent dans un intervalle horaire limite jours par semaine',
                    component: 'ConstraintStudentsIntervalMaxDaysPerWeek'
                },
                {
                    label: 'Heures de repos minimum pour tous les apprenants',
                    component: 'ConstraintStudentsMinRestingHours'
                }
            ],
        }
    }
}
</script>