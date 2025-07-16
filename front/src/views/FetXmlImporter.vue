<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h5><i class="fas fa-file-import me-2"></i>Importer un emploi du temps FET</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="xmlFile" class="form-label">Sélectionner un fichier XML FET</label>
          <input 
            type="file" 
            id="xmlFile" 
            class="form-control" 
            accept=".xml"
            @change="handleFileUpload"
          >
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p>Conversion en cours...</p>
        </div>

        <div v-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <div v-if="convertedData" class="mt-4">
          <h5>Données converties :</h5>
          <pre class="p-3 bg-light rounded">{{ convertedData }}</pre>
          
          <button 
            @click="saveConvertedData" 
            class="btn btn-success mt-3"
            :disabled="saving"
          >
            <i class="fas fa-save me-2"></i>
            {{ saving ? 'Enregistrement...' : 'Enregistrer le planning' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { xml2js } from 'xml-js';
import toastr from 'toastr';
import axios from 'axios';

export default {
  name: 'FetXmlImporter',
  data() {
    return {
      loading: false,
      saving: false,
      error: null,
      convertedData: null,
      xmlContent: null
    };
  },
  methods: {
    handleFileUpload(event) {
      this.error = null;
      this.convertedData = null;
      const file = event.target.files[0];
      
      if (!file) return;

      if (file.type !== 'text/xml' && !file.name.endsWith('.xml')) {
        this.error = "Veuillez sélectionner un fichier XML valide";
        return;
      }

      this.loading = true;
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          this.xmlContent = e.target.result;
          this.convertXmlToJson(this.xmlContent);
        } catch (err) {
          this.error = "Erreur lors de la lecture du fichier XML";
          console.error(err);
        } finally {
          this.loading = false;
        }
      };

      reader.onerror = () => {
        this.error = "Erreur lors de la lecture du fichier";
        this.loading = false;
      };

      reader.readAsText(file);
    },

    convertXmlToJson(xmlString) {
      try {
        // Convert XML to JavaScript object
        const result = xml2js(xmlString, { compact: true, spaces: 2 });
        
        if (!result.fet) {
          throw new Error("Format XML FET non reconnu");
        }

        // Transform the XML structure to our JSON format
        const jsonData = this.transformFetToJson(result.fet);
        this.convertedData = jsonData;
      } catch (err) {
        this.error = "Erreur lors de la conversion du XML en JSON";
        console.error(err);
      }
    },

    transformFetToJson(fetData) {
      // Map FET days to our format
      const daysMap = {
        'D1': 'Lundi',
        'D2': 'Mardi',
        'D3': 'Mercredi',
        'D4': 'Jeudi',
        'D5': 'Vendredi',
        'D6': 'Samedi',
        'D7': 'Dimanche'
      };

      // Map FET hours to our format (H1 -> p1)
      const hourMap = (hour) => hour.startsWith('H') ? `p${hour.substring(1)}` : hour;

      // Transform the data structure
      const jsonData = {
        institutionName: fetData.Institution_Name._text || '',
        institutionComment: fetData.Comments._text || '',
        selectedDays: fetData.Days_List.Day.map(day => daysMap[day.Name._text] || day.Name._text),
        periods: fetData.Hours_List.Hour.map(hour => ({
          name: hourMap(hour.Name._text),
          description: hour.Long_Name._text || ''
        })),
        subjects: fetData.Subjects_List.Subject.map(subject => ({
          name: subject.Name._text,
          longName: subject.Long_Name._text || '',
          code: subject.Code._text || '',
          comments: subject.Comments._text || ''
        })),
        teachers: fetData.Teachers_List.Teacher.map(teacher => ({
          name: teacher.Name._text,
          longName: teacher.Long_Name._text || '',
          code: teacher.Code._text || '',
          targetHours: parseInt(teacher.Target_Number_of_Hours._text) || 0,
          qualifiedSubjects: teacher.Qualified_Subjects?.Qualified_Subject?.map(sub => sub._text) || [],
          comments: teacher.Comments._text || ''
        })),
        students: fetData.Students_List.Year.Group.map(group => ({
          name: group.Name._text,
          longName: group.Long_Name._text || '',
          code: group.Code._text || '',
          studentCount: parseInt(group.Number_of_Students._text) || 0,
          comments: group.Comments._text || ''
        })),
        rooms: fetData.Rooms_List.Room.map(room => ({
          name: room.Name._text,
          longName: room.Long_Name._text || '',
          code: room.Code._text || '',
          capacity: parseInt(room.Capacity._text) || 0,
          comments: room.Comments._text || ''
        })),
        balises: fetData.Activity_Tags_List.Activity_Tag.map(tag => ({
          name: tag.Name._text,
          longName: tag.Long_Name._text || '',
          code: tag.Code._text || '',
          comments: tag.Comments._text || '',
          Imprimable: tag.Printable._text || 'true'
        })),
        activities: fetData.Activities_List.Activity.map(activity => ({
          subject: activity.Subject._text,
          teacher: activity.Teacher._text,
          student: activity.Students._text,
          durations: [parseInt(activity.Duration._text) || 1],
          balise: '' // You might need to extract this from activity tags
        })),
        // Handle constraints
        ConstraintBreakTimes: fetData.Time_Constraints_List?.ConstraintBreakTimes?.Break_Time?.map(bt => ({
          Day: daysMap[bt.Day._text] || bt.Day._text,
          Hour: hourMap(bt.Hour._text)
        })) || [],
        // Add other constraints similarly...
      };

      return jsonData;
    },

    async saveConvertedData() {
      if (!this.convertedData) return;

      this.saving = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/timetables`, this.convertedData);
        toastr.success('Emploi du temps enregistré avec succès');
        this.$router.push(`/show/${response.data.data.id}`);
      } catch (error) {
        toastr.error("Erreur lors de l'enregistrement");
        console.error(error);
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
pre {
  max-height: 500px;
  overflow-y: auto;
}
</style>