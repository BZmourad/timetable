const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Timetable = require('../models/Timetable');

const storagePath = path.join(__dirname, '../storage/json');

const { js2xml } = require('xml-js');

//const { exec } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);




// Créer le dossier de stockage s'il n'existe pas
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
}

exports.getAllTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(timetables);
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        res.status(500).json({ error: "Une erreur est survenue" });
    }
};

exports.submitTimetable = async (req, res) => {
    try {
        // Validation des données
        if (!req.body.institutionName || !req.body.institutionName.trim()) {
            return res.status(400).json({ error: "Le nom de l'institution est obligatoire" });
        }

        // Créer un nom de fichier unique
        const filename = `timetable_${uuidv4()}.json`;
        const filePath = path.join(storagePath, filename);

        // Sauvegarder les données dans un fichier JSON
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

        // Enregistrer dans la base de données
        const timetable = await Timetable.create({
            institutionName: req.body.institutionName,
            path_json: filePath
        });

        res.status(201).json({
            message: "Données enregistrées avec succès",
            data: timetable
        });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'enregistrement" });
    }
};

exports.getTimetable = async (req, res) => {
    try {
        const id = req.params.id;
        const timetable = await Timetable.findByPk(id);

        if (!timetable) {
            return res.status(404).json({ error: "Emploi du temps non trouvé" });
        }

        // Lire le fichier JSON
        const data = JSON.parse(fs.readFileSync(timetable.path_json, 'utf8'));

        res.json({
            ...timetable.toJSON(),
            data
        });
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        res.status(500).json({ error: "Une erreur est survenue" });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const id = req.params.id;
        const timetable = await Timetable.findByPk(id);

        if (!timetable) {
            return res.status(404).json({ error: "Emploi du temps non trouvé" });
        }

        // Validation des données
        if (!req.body.institutionName || !req.body.institutionName.trim()) {
            return res.status(400).json({ error: "Le nom de l'institution est obligatoire" });
        }

        // Mettre à jour le fichier JSON
        fs.writeFileSync(timetable.path_json, JSON.stringify(req.body, null, 2));

        // Mettre à jour dans la base de données
        timetable.institutionName = req.body.institutionName;
        await timetable.save();

        res.json({
            message: "Emploi du temps mis à jour avec succès",
            data: timetable
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour" });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const id = req.params.id;
        const timetable = await Timetable.findByPk(id);

        if (!timetable) {
            return res.status(404).json({ error: "Emploi du temps non trouvé" });
        }

        // Supprimer le fichier JSON
        if (fs.existsSync(timetable.path_json)) {
            fs.unlinkSync(timetable.path_json);
        }

        // Supprimer de la base de données
        await timetable.destroy();

        res.json({ message: "Emploi du temps supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression" });
    }
};

exports.getTimetableShow = async (req, res) => {
    try {
        const id = req.params.id;
        const timetable = await Timetable.findByPk(id);

        if (!timetable) {
            return res.status(404).json({ error: "Emploi du temps non trouvé" });
        }

        const data = JSON.parse(fs.readFileSync(timetable.path_json, 'utf8'));
        
        const xmlData = convertToFetXml(data);

        // Path configuration
        const baseDir = process.env.BASE_DIR || "C:/laragon/www/timetable";
        const inputDir = path.join(baseDir, "input");
        const outputDir = path.join(baseDir, "front/public/output");
        const fetCl = process.env.FET_CL_PATH || "C:/laragon/www/timetableold/fet-7.2.6/fet-cl";

        // Create directories if they don't exist
        [inputDir, outputDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });

        // Generate unique filename
        const filename = `timetable_${id}_${Date.now()}`;
        const inputFilePath = path.join(inputDir, `${filename}.fet`);
        
        // Save XML data
        fs.writeFileSync(inputFilePath, xmlData);

        const command = `"${fetCl}" --inputfile="${inputFilePath}" --outputdir="${outputDir}" --htmllevel=7 --language=fr`;

        const result = runFet(command);

        res.json({
            ...timetable.toJSON(), // Inclut created_at
            data,
            xmlData,
            inputFilePath,
            command,
            result
        });
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        res.status(500).json({ error: "Une erreur est survenue", "error":error });
    }
};

async function runFet(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur d'exécution: ${error.message}`);
            return error.message;
        }
        if (stderr) {
            console.error(`Erreur: ${stderr}`);
            return stderr;
        }
        console.log(`Sortie: ${stdout}`);
        return stdout;
    });
}

// Fonction de conversion JSON vers XML FET
function convertToFetXml(jsonData) {
    const daysMap = {
        Lundi: { name: 'D1', longName: 'Lundi' },
        Mardi: { name: 'D2', longName: 'Mardi' },
        Mercredi: { name: 'D3', longName: 'Mercredi' },
        Jeudi: { name: 'D4', longName: 'Jeudi' },
        Vendredi: { name: 'D5', longName: 'Vendredi' },
        Samedi: { name: 'D6', longName: 'Samedi' },
        Dimanche: { name: 'D7', longName: 'Dimanche' }
    };

    var fetData = {
        _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
        fet: {
            _attributes: { version: process.env.FET_VERSION },
            Mode: 'Official',
            Institution_Name: jsonData.institutionName || 'Institution par défaut',
            Comments: jsonData.institutionComment || 'Commentaire par défaut',
            Days_List: {
                Number_of_Days: jsonData.selectedDays.length,
                Day: jsonData.selectedDays.map(day => ({
                    Name: day,
                    Long_Name: ''
                }))
            },
            Hours_List: {
                Number_of_Hours: jsonData.periods.length,
                Hour: jsonData.periods.map((period, index) => ({
                    Name: period.name,
                    Long_Name: period.description,
                }))
            },
            Subjects_List: {
                Subject: jsonData.subjects.map(subject => ({
                    Name: subject.code || subject.name.replace(/\s+/g, ''),
                    Long_Name: subject.longName || '',
                    Code: subject.code || '',
                    Comments: subject.comments || ''
                }))
            },
            Teachers_List: {
                Teacher: jsonData.teachers.map(teacher => ({
                    Name: teacher.code || teacher.name.replace(/\s+/g, ''),
                    Long_Name: teacher.longName || '',
                    Code: teacher.code || '',
                    Target_Number_of_Hours: teacher.targetHours || 0,
                    Qualified_Subjects: {
                        Qualified_Subject: teacher.qualifiedSubjects || []
                    },
                    Comments: teacher.comments || ''
                }))
            },
            Students_List: {
                Year: {
                    Name: new Date().getFullYear() + '-' + (new Date().getFullYear()+1),
                    Number_of_Students: jsonData.students.reduce((sum, s) => sum + (s.studentCount || 0), 0),
                    Group: jsonData.students.map(student => ({
                        Name: student.code || student.name.replace(/\s+/g, ''),
                        Long_Name: student.longName || '',
                        Code: student.code || '',
                        Number_of_Students: student.studentCount || 0,
                        Comments: student.comments || ''
                    }))
                }
            },
            Activity_Tags_List: {
                Activity_Tag: jsonData.balises.map(balise => ({
                    Name: balise.name ,
                    Long_Name: balise.longName || '',
                    Code: balise.code || '',
                    Comments: balise.comments || '',
                    Printable: balise.Imprimable
                }))
            },
            Activities_List: {
                Activity: []
            },
            Rooms_List: {
                Room: jsonData.rooms.map(room => ({
                    Name: room.code || room.name.replace(/\s+/g, ''),
                    Long_Name: room.longName || '',
                    Code: room.code || '',
                    Capacity: room.capacity || 0,
                    Virtual: 'false',
                    Comments: room.comments || ''
                }))
            }
        }
    };
    let activityId = 1;
    const activities = [];

    jsonData.activities.forEach((activity) => {
        const totalDuration = activity.durations.reduce((sum, d) => sum + d, 0);
        if (activity.durations.length > 1) {
            let firstId = 0;
            activity.durations.forEach((duration, i) => {
                if (i == 0) {
                    firstId = activityId;
                }
                const newActivity = {
                    Teacher: activity.teacher,
                    Subject: activity.subject,
                    Students: activity.student,
                    Activity_Tag: activity.balise,
                    Duration: duration,
                    Total_Duration: totalDuration, 
                    Id: activityId,
                    Activity_Group_Id: firstId, 
                    Active: 'true',
                    Comments: ''
                };
                activities.push(newActivity);
                activityId++;
            });
        } else {
            const newActivity = {
                Teacher: activity.teacher,
                Subject: activity.subject,
                Students: activity.student,
                Activity_Tag: activity.balise,
                Duration: activity.durations[0] || 1,
                Total_Duration: totalDuration,
                Id: activityId,
                Activity_Group_Id: 0,
                Active: 'true',
                Comments: ''
            };
            activities.push(newActivity);
            activityId++;
        }
    });
    activities.sort((a, b) => a.Id - b.Id);
    fetData.fet.Activities_List.Activity = activities;
    const timeConstraints = {
        ConstraintBasicCompulsoryTime: {
            Weight_Percentage: 100,
            Active: 'true',
            Comments: '',
        }
    };
    if (jsonData.ConstraintBreakTimes.length) {
        const breakTimes = jsonData.ConstraintBreakTimes.map(breakTime => {
            return {
                Break_Time: {
                    Day: breakTime.Day,
                    Hour: breakTime.Hour
                }
            };
        });
        timeConstraints.ConstraintBreakTimes = {
            Weight_Percentage: 100,
            Number_of_Break_Times: jsonData.ConstraintBreakTimes.length,
            Break_Time: breakTimes.map(bt => bt.Break_Time),
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeacherMaxDaysPerWeek.length) {
        timeConstraints.ConstraintTeacherMaxDaysPerWeek = jsonData.ConstraintTeacherMaxDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Days_Per_Week: item.Max_Days_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinDaysPerWeek.length) {
        timeConstraints.ConstraintTeacherMinDaysPerWeek = jsonData.ConstraintTeacherMinDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Minimum_Days_Per_Week: item.Minimum_Days_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxGapsPerDay.length) {
        timeConstraints.ConstraintTeacherMaxGapsPerDay = jsonData.ConstraintTeacherMaxGapsPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Gaps: item.Max_Gaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherNoTwoConsecutiveDays.length) {
        timeConstraints.ConstraintTeacherNoTwoConsecutiveDays = jsonData.ConstraintTeacherNoTwoConsecutiveDays.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxGapsPerWeek.length) {
        timeConstraints.ConstraintTeacherMaxGapsPerWeek = jsonData.ConstraintTeacherMaxGapsPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Gaps: item.Max_Gaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxHoursDaily.length) {
        timeConstraints.ConstraintTeacherMaxHoursDaily = jsonData.ConstraintTeacherMaxHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherActivityTagMaxHoursDaily.length) {
        timeConstraints.ConstraintTeacherActivityTagMaxHoursDaily = jsonData.ConstraintTeacherActivityTagMaxHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxHoursDailyInInterval.length) {
        timeConstraints.ConstraintTeacherMaxHoursDailyInInterval = jsonData.ConstraintTeacherMaxHoursDailyInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxSpanPerDay.length) {
        timeConstraints.ConstraintTeacherMaxSpanPerDay = jsonData.ConstraintTeacherMaxSpanPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Span: item.Max_Span,
                Allow_One_Day_Exception_of_Plus_One: item.Allow_One_Day_Exception_of_Plus_One ? 'true': 'false',
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherPairOfMutuallyExclusiveTimeSlots.length) {
        timeConstraints.ConstraintTeacherPairOfMutuallyExclusiveTimeSlots = jsonData.ConstraintTeacherPairOfMutuallyExclusiveTimeSlots.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                First_Time_Slot: {
                    Day: item.First_Time_Slot.Day,
                    Hour: item.First_Time_Slot.Hour
                },
                Second_Time_Slot: {
                    Day: item.Second_Time_Slot.Day,
                    Hour: item.Second_Time_Slot.Hour
                },
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxSingleGapsInSelectedTimeSlots.length) {
        timeConstraints.ConstraintTeacherMaxSingleGapsInSelectedTimeSlots = jsonData.ConstraintTeacherMaxSingleGapsInSelectedTimeSlots.map(item => {
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Single_Gaps: item.Max_Single_Gaps,
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherNotAvailableTimes.length) {
        timeConstraints.ConstraintTeacherNotAvailableTimes = jsonData.ConstraintTeacherNotAvailableTimes.map(item => {
            const Not_Available_Times = item.Not_Available_Time.map(item2 => {
                return {
                    Not_Available_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Number_of_Not_Available_Times: item.Not_Available_Time.length,
                Not_Available_Time: Not_Available_Times.map(bt => bt.Not_Available_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxActivityTagsPerDayFromSet.length) {
        timeConstraints.ConstraintTeacherMaxActivityTagsPerDayFromSet = jsonData.ConstraintTeacherMaxActivityTagsPerDayFromSet.map(item => {
            const Activity_Tags = item.Activity_Tags.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Maximum_Allowed_Activity_Tags: item.Maximum_Allowed_Activity_Tags,
                Number_of_Activity_Tags: item.Activity_Tags.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinHoursDaily.length) {
        timeConstraints.ConstraintTeacherMinHoursDaily = jsonData.ConstraintTeacherMinHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Minimum_Hours_Daily: item.Minimum_Hours_Daily,
                Allow_Empty_Days: item.Allow_Empty_Days ? 'true' : 'false',
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherActivityTagMinHoursDaily.length) {
        timeConstraints.ConstraintTeacherActivityTagMinHoursDaily = jsonData.ConstraintTeacherActivityTagMinHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Minimum_Hours_Daily: item.Minimum_Hours_Daily,
                Minimum_Days_With_Tag: item.Minimum_Days_With_Tag,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxHoursContinuously.length) {
        timeConstraints.ConstraintTeacherMaxHoursContinuously = jsonData.ConstraintTeacherMaxHoursContinuously.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Maximum_Hours_Continuously: item.Maximum_Hours_Continuously,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherActivityTagMaxHoursContinuously.length) {
        timeConstraints.ConstraintTeacherActivityTagMaxHoursContinuously = jsonData.ConstraintTeacherActivityTagMaxHoursContinuously.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Activity_Tag: item.Activity_Tag,
                Maximum_Hours_Continuously: item.Maximum_Hours_Continuously,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinGapsBetweenActivityTag.length) {
        timeConstraints.ConstraintTeacherMinGapsBetweenActivityTag = jsonData.ConstraintTeacherMinGapsBetweenActivityTag.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Activity_Tag: item.Activity_Tag,
                MinGaps: item.MinGaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags.length) {
        timeConstraints.ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags = jsonData.ConstraintTeacherMinGapsBetweenOrderedPairOfActivityTags.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                First_Activity_Tag: item.First_Activity_Tag,
                Second_Activity_Tag: item.Second_Activity_Tag,
                MinGaps: item.MinGaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherIntervalMaxDaysPerWeek.length) {
        timeConstraints.ConstraintTeacherIntervalMaxDaysPerWeek = jsonData.ConstraintTeacherIntervalMaxDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Max_Days_Per_Week: item.Max_Days_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinRestingHours.length) {
        timeConstraints.ConstraintTeacherMinRestingHours = jsonData.ConstraintTeacherMinRestingHours.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Minimum_Resting_Hours: item.Minimum_Resting_Hours,
                Circular: item.Circular ? 'true' : 'false',
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersMaxDaysPerWeek.Active) {
        timeConstraints.ConstraintTeachersMaxDaysPerWeek = {
            Weight_Percentage: 100,
            Max_Days_Per_Week: jsonData.ConstraintTeachersMaxGapsPerDay.Max_Days_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxDaysPerWeek.Active) {
        timeConstraints.ConstraintTeachersMaxDaysPerWeek = {
            Weight_Percentage: 100,
            Max_Days_Per_Week: jsonData.ConstraintTeachersMaxGapsPerDay.Max_Days_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMinDaysPerWeek.Active) {
        timeConstraints.ConstraintTeachersMinDaysPerWeek = {
            Weight_Percentage: 100,
            Minimum_Days_Per_Week: jsonData.ConstraintTeachersMaxGapsPerDay.Minimum_Days_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersNoTwoConsecutiveDays.Active) {
        timeConstraints.ConstraintTeachersNoTwoConsecutiveDays = {
            Weight_Percentage: 100,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxGapsPerDay.Active) {
        timeConstraints.ConstraintTeachersMaxGapsPerDay = {
            Weight_Percentage: 100,
            Max_Gaps: jsonData.ConstraintTeachersMaxGapsPerDay.Max_Gaps,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxGapsPerWeek.Active) {
        timeConstraints.ConstraintTeachersMaxGapsPerWeek = {
            Weight_Percentage: 100,
            Max_Gaps: jsonData.ConstraintTeachersMaxGapsPerWeek.Max_Gaps,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxHoursDaily.Active) {
        timeConstraints.ConstraintTeachersMaxHoursDaily = {
            Weight_Percentage: 100,
            Maximum_Hours_Daily: jsonData.ConstraintTeachersMaxHoursDaily.Maximum_Hours_Daily,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxHoursDailyInInterval.Active) {
        timeConstraints.ConstraintTeachersMaxHoursDailyInInterval = {
            Weight_Percentage: 100,
            Maximum_Hours_Daily: jsonData.ConstraintTeachersMaxHoursDailyInInterval.Maximum_Hours_Daily,
            Interval_Start_Hour: jsonData.ConstraintTeachersMaxHoursDailyInInterval.Interval_Start_Hour,
            Interval_End_Hour: jsonData.ConstraintTeachersMaxHoursDailyInInterval.Interval_End_Hour,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxSpanPerDay.Active) {
        timeConstraints.ConstraintTeachersMaxSpanPerDay = {
            Weight_Percentage: 100,
            Max_Span: jsonData.ConstraintTeachersMaxSpanPerDay.Max_Span,
            Allow_One_Day_Exception_of_Plus_One: jsonData.ConstraintTeachersMaxSpanPerDay.Allow_One_Day_Exception_of_Plus_One ? 'true' : 'false',
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersActivityTagMaxHoursDaily.Active) {
        timeConstraints.ConstraintTeachersActivityTagMaxHoursDaily = {
            Weight_Percentage: 100,
            Maximum_Hours_Daily: jsonData.ConstraintTeachersActivityTagMaxHoursDaily.Maximum_Hours_Daily,
            Activity_Tag: jsonData.ConstraintTeachersActivityTagMaxHoursDaily.Activity_Tag,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersActivityTagMaxHoursDaily.Active) {
        timeConstraints.ConstraintTeachersActivityTagMaxHoursDaily = {
            Weight_Percentage: 100,
            First_Time_Slot: {
                Day: jsonData.ConstraintTeachersActivityTagMaxHoursDaily.First_Time_Slot.Day,
                Hour: jsonData.ConstraintTeachersActivityTagMaxHoursDaily.First_Time_Slot.Day,
            },
            Second_Time_Slot: {
                Day: jsonData.ConstraintTeachersActivityTagMaxHoursDaily.Second_Time_Slot.Day,
                Hour: jsonData.ConstraintTeachersActivityTagMaxHoursDaily.Second_Time_Slot.Day,
            },
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Active) {
        const Selected_Time_Slots = jsonData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Selected_Time_Slot.map(item => {
            return {
                Selected_Time_Slot: {
                    Day: item.Day,
                    Hour: item.Hour
                }
            };
        });
        timeConstraints.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots = {
            Weight_Percentage: 100,
            Max_Single_Gaps: jsonData.ConstraintTeachersMaxSingleGapsInSelectedTimeSlots.Max_Single_Gaps,
            Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMinHoursDaily.Active) {
        timeConstraints.ConstraintTeachersMinHoursDaily = {
            Weight_Percentage: 100,
            Minimum_Hours_Daily: jsonData.ConstraintTeachersMinHoursDaily.Minimum_Hours_Daily,
            Allow_Empty_Days: jsonData.ConstraintTeachersMinHoursDaily.Allow_Empty_Days,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxHoursContinuously.Active) {
        timeConstraints.ConstraintTeachersMaxHoursContinuously = {
            Weight_Percentage: 100,
            Maximum_Hours_Continuously: jsonData.ConstraintTeachersMaxHoursContinuously.Maximum_Hours_Continuously,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMinRestingHours.Active) {
        timeConstraints.ConstraintTeachersMinRestingHours = {
            Weight_Percentage: 100,
            Minimum_Resting_Hours: jsonData.ConstraintTeachersMinRestingHours.Minimum_Resting_Hours,
            Circular: jsonData.ConstraintTeachersMinRestingHours.Circular ? 'true' : 'false',
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersIntervalMaxDaysPerWeek.length) {
        timeConstraints.ConstraintTeachersIntervalMaxDaysPerWeek = jsonData.ConstraintTeachersIntervalMaxDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Max_Days_Per_Week: item.Max_Days_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags.length) {
        timeConstraints.ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags = jsonData.ConstraintTeachersMinGapsBetweenOrderedPairOfActivityTags.map(item => {
            return {
                Weight_Percentage: 100,
                First_Activity_Tag: item.First_Activity_Tag,
                Second_Activity_Tag: item.Second_Activity_Tag,
                MinGaps: item.MinGaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersMinGapsBetweenActivityTag.length) {
        timeConstraints.ConstraintTeachersMinGapsBetweenActivityTag = jsonData.ConstraintTeachersMinGapsBetweenActivityTag.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Tag: item.Activity_Tag,
                MinGaps: item.MinGaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersActivityTagMaxHoursContinuously.length) {
        timeConstraints.ConstraintTeachersActivityTagMaxHoursContinuously = jsonData.ConstraintTeachersActivityTagMaxHoursContinuously.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Tag: item.Activity_Tag,
                Maximum_Hours_Continuously: item.Maximum_Hours_Continuously,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersActivityTagMinHoursDaily.length) {
        timeConstraints.ConstraintTeachersActivityTagMinHoursDaily = jsonData.ConstraintTeachersActivityTagMinHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Tag: item.Activity_Tag,
                Minimum_Hours_Daily: item.Minimum_Hours_Daily,
                Minimum_Days_With_Tag: item.Minimum_Days_With_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersMaxActivityTagsPerDayFromSet.length) {
        timeConstraints.ConstraintTeachersMaxActivityTagsPerDayFromSet = jsonData.ConstraintTeachersMaxActivityTagsPerDayFromSet.map(item => {
            const Activity_Tags = item.Activity_Tags.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Maximum_Allowed_Activity_Tags: item.Maximum_Allowed_Activity_Tags,
                Number_of_Activity_Tags: item.Activity_Tags.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityPreferredStartingTime.length) {
        timeConstraints.ConstraintActivityPreferredStartingTime = jsonData.ConstraintActivityPreferredStartingTime.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Permanently_Locked: item.Permanently_Locked ? 'true': 'false',
                Day: item.Day,
                Hour: item.Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityPreferredStartingTimes.length) {
        timeConstraints.ConstraintActivityPreferredStartingTimes = jsonData.ConstraintActivityPreferredStartingTimes.map(item => {
            const Preferred_Starting_Times = item.Preferred_Starting_Time.map(item2 => {
                return {
                    Preferred_Starting_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Number_of_Preferred_Starting_Times: item.Preferred_Starting_Time.length,
                Preferred_Starting_Time: Preferred_Starting_Times.map(bt => bt.Preferred_Starting_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityPreferredTimeSlots.length) {
        timeConstraints.ConstraintActivityPreferredTimeSlots = jsonData.ConstraintActivityPreferredTimeSlots.map(item => {
            const Preferred_Time_Slots = item.Preferred_Time_Slot.map(item2 => {
                return {
                    Preferred_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Number_of_Preferred_Time_Slots: item.Preferred_Time_Slot.length,
                Preferred_Time_Slot: Preferred_Time_Slots.map(bt => bt.Preferred_Time_Slot),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesPreferredStartingTimes.length) {
        timeConstraints.ConstraintActivitiesPreferredStartingTimes = jsonData.ConstraintActivitiesPreferredStartingTimes.map(item => {
            const Preferred_Starting_Times = item.Preferred_Starting_Time.map(item2 => {
                return {
                    Preferred_Starting_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Duration: item.Duration,
                Number_of_Preferred_Starting_Times: item.Preferred_Starting_Time.length,
                Preferred_Starting_Time: Preferred_Starting_Times.map(bt => bt.Preferred_Starting_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesPreferredTimeSlots.length) {
        timeConstraints.ConstraintActivitiesPreferredTimeSlots = jsonData.ConstraintActivitiesPreferredTimeSlots.map(item => {
            const Preferred_Time_Slots = item.Preferred_Time_Slot.map(item2 => {
                return {
                    Preferred_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Duration: item.Duration,
                Number_of_Preferred_Time_Slots: item.Preferred_Time_Slot.length,
                Preferred_Time_Slot: Preferred_Time_Slots.map(bt => bt.Preferred_Time_Slot),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintSubactivitiesPreferredStartingTimes.length) {
        timeConstraints.ConstraintSubactivitiesPreferredStartingTimes = jsonData.ConstraintSubactivitiesPreferredStartingTimes.map(item => {
            const Preferred_Starting_Times = item.Preferred_Starting_Time.map(item2 => {
                return {
                    Preferred_Starting_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Duration: item.Duration,
                Component_Number: item.Component_Number,
                Number_of_Preferred_Starting_Times: item.Preferred_Starting_Time.length,
                Preferred_Starting_Time: Preferred_Starting_Times.map(bt => bt.Preferred_Starting_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintSubactivitiesPreferredTimeSlots.length) {
        timeConstraints.ConstraintSubactivitiesPreferredTimeSlots = jsonData.ConstraintSubactivitiesPreferredTimeSlots.map(item => {
            const Preferred_Time_Slots = item.Preferred_Time_Slot.map(item2 => {
                return {
                    Preferred_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Component_Number: item.Component_Number,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Duration: item.Duration,
                Number_of_Preferred_Time_Slots: item.Preferred_Time_Slot.length,
                Preferred_Time_Slot: Preferred_Time_Slots.map(bt => bt.Preferred_Time_Slot),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintMinDaysBetweenActivities.length) {
        timeConstraints.ConstraintMinDaysBetweenActivities = jsonData.ConstraintMinDaysBetweenActivities.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                MinDays: item.MinDays,
                Consecutive_If_Same_Day: item.Consecutive_If_Same_Day ? 'true':'false',
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintMaxDaysBetweenActivities.length) {
        timeConstraints.ConstraintMaxDaysBetweenActivities = jsonData.ConstraintMaxDaysBetweenActivities.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                MaxDays: item.MaxDays,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityBeginsStudentsDay.length) {
        timeConstraints.ConstraintActivityBeginsStudentsDay = jsonData.ConstraintActivityBeginsStudentsDay.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityBeginsTeachersDay.length) {
        timeConstraints.ConstraintActivityBeginsTeachersDay = jsonData.ConstraintActivityBeginsTeachersDay.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityEndsStudentsDay.length) {
        timeConstraints.ConstraintActivityEndsStudentsDay = jsonData.ConstraintActivityEndsStudentsDay.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityEndsTeachersDay.length) {
        timeConstraints.ConstraintActivityEndsTeachersDay = jsonData.ConstraintActivityEndsTeachersDay.map(item => {
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesBeginStudentsDay.length) {
        timeConstraints.ConstraintActivitiesBeginStudentsDay = jsonData.ConstraintActivitiesBeginStudentsDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesBeginTeachersDay.length) {
        timeConstraints.ConstraintActivitiesBeginTeachersDay = jsonData.ConstraintActivitiesBeginTeachersDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesEndStudentsDay.length) {
        timeConstraints.ConstraintActivitiesEndStudentsDay = jsonData.ConstraintActivitiesEndStudentsDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesEndTeachersDay.length) {
        timeConstraints.ConstraintActivitiesEndTeachersDay = jsonData.ConstraintActivitiesEndTeachersDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Students: item.Students,
                Subject: item.Subject,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesSameStartingTime.length) {
        timeConstraints.ConstraintActivitiesSameStartingTime = jsonData.ConstraintActivitiesSameStartingTime.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesSameStartingDay.length) {
        timeConstraints.ConstraintActivitiesSameStartingDay = jsonData.ConstraintActivitiesSameStartingDay.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesSameStartingHour.length) {
        timeConstraints.ConstraintActivitiesSameStartingHour = jsonData.ConstraintActivitiesSameStartingHour.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesOccupyMaxTimeSlotsFromSelection.length) {
        timeConstraints.ConstraintActivitiesOccupyMaxTimeSlotsFromSelection = jsonData.ConstraintActivitiesOccupyMaxTimeSlotsFromSelection.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Max_Number_of_Occupied_Time_Slots: item.Max_Number_of_Occupied_Time_Slots,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesOccupyMinTimeSlotsFromSelection.length) {
        timeConstraints.ConstraintActivitiesOccupyMinTimeSlotsFromSelection = jsonData.ConstraintActivitiesOccupyMinTimeSlotsFromSelection.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Min_Number_of_Occupied_Time_Slots: item.Min_Number_of_Occupied_Time_Slots,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots.length) {
        timeConstraints.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots = jsonData.ConstraintActivitiesMaxSimultaneousInSelectedTimeSlots.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Max_Number_of_Simultaneous_Activities: item.Max_Number_of_Simultaneous_Activities,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesMinSimultaneousInSelectedTimeSlots.length) {
        timeConstraints.ConstraintActivitiesMinSimultaneousInSelectedTimeSlots = jsonData.ConstraintActivitiesMinSimultaneousInSelectedTimeSlots.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Min_Number_of_Simultaneous_Activities: item.Min_Number_of_Simultaneous_Activities,
                Allow_Empty_Slots: item.Allow_Empty_Slots ? 'true' : 'false',
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTwoActivitiesOrdered.length) {
        timeConstraints.ConstraintTwoActivitiesOrdered = jsonData.ConstraintTwoActivitiesOrdered.map(item => {
            return {
                Weight_Percentage: 100,
                First_Activity_Id: getActivityId(jsonData.activities, item.First_Activity_Id),
                Second_Activity_Id: getActivityId(jsonData.activities, item.Second_Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTwoActivitiesOrderedIfSameDay.length) {
        timeConstraints.ConstraintTwoActivitiesOrderedIfSameDay = jsonData.ConstraintTwoActivitiesOrderedIfSameDay.map(item => {
            return {
                Weight_Percentage: 100,
                First_Activity_Id: getActivityId(jsonData.activities, item.First_Activity_Id),
                Second_Activity_Id: getActivityId(jsonData.activities, item.Second_Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTwoActivitiesConsecutive.length) {
        timeConstraints.ConstraintTwoActivitiesConsecutive = jsonData.ConstraintTwoActivitiesConsecutive.map(item => {
            return {
                Weight_Percentage: 100,
                First_Activity_Id: getActivityId(jsonData.activities, item.First_Activity_Id),
                Second_Activity_Id: getActivityId(jsonData.activities, item.Second_Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTwoActivitiesGrouped.length) {
        timeConstraints.ConstraintTwoActivitiesGrouped = jsonData.ConstraintTwoActivitiesGrouped.map(item => {
            return {
                Weight_Percentage: 100,
                First_Activity_Id: getActivityId(jsonData.activities, item.First_Activity_Id),
                Second_Activity_Id: getActivityId(jsonData.activities, item.Second_Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintThreeActivitiesGrouped.length) {
        timeConstraints.ConstraintThreeActivitiesGrouped = jsonData.ConstraintThreeActivitiesGrouped.map(item => {
            return {
                Weight_Percentage: 100,
                First_Activity_Id: getActivityId(jsonData.activities, item.First_Activity_Id),
                Second_Activity_Id: getActivityId(jsonData.activities, item.Second_Activity_Id),
                Third_Activity_Id: getActivityId(jsonData.activities, item.Third_Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesMaxHourlySpan.length) {
        timeConstraints.ConstraintActivitiesMaxHourlySpan = jsonData.ConstraintActivitiesMaxHourlySpan.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                MaxHourlySpan: item.MaxHourlySpan,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintMinGapsBetweenActivities.length) {
        timeConstraints.ConstraintMinGapsBetweenActivities = jsonData.ConstraintMinGapsBetweenActivities.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                MinGaps: item.MinGaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesNotOverlapping.length) {
        timeConstraints.ConstraintActivitiesNotOverlapping = jsonData.ConstraintActivitiesNotOverlapping.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityTagsNotOverlapping.length) {
        timeConstraints.ConstraintActivityTagsNotOverlapping = jsonData.ConstraintActivityTagsNotOverlapping.map(item => {
            const Activity_Tags = item.Activity_Tags.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activity_Tags: item.Activity_Tags.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTwoSetsOfActivitiesOrdered.length) {
        timeConstraints.ConstraintTwoSetsOfActivitiesOrdered = jsonData.ConstraintTwoSetsOfActivitiesOrdered.map(item => {
            const First_Activities_Ids_Sets = item.First_Activities_Ids_Set.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            First_Activities_Ids_Sets.Number_of_Activities = item.First_Activities_Ids_Set.length;
            const Second_Activities_Ids_Sets = item.Second_Activities_Ids_Set.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            Second_Activities_Ids_Sets.Number_of_Activities = item.Second_Activities_Ids_Set.length;
            return {
                Weight_Percentage: 100,
                First_Activities_Ids_Set: First_Activities_Ids_Sets,
                Second_Activities_Ids_Set: Second_Activities_Ids_Sets,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetNotAvailableTimes.length) {
        timeConstraints.ConstraintStudentsSetNotAvailableTimes = jsonData.ConstraintStudentsSetNotAvailableTimes.map(item => {
            const Not_Available_Times = item.Not_Available_Time.map(item2 => {
                return {
                    Not_Available_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Number_of_Not_Available_Times: item.Not_Available_Time.length,
                Not_Available_Time: Not_Available_Times.map(bt => bt.Not_Available_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxDaysPerWeek.length) {
        timeConstraints.ConstraintStudentsSetMaxDaysPerWeek = jsonData.ConstraintStudentsSetMaxDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Days_Per_Week: item.Max_Days_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxGapsPerDay.length) {
        timeConstraints.ConstraintStudentsSetMaxGapsPerDay = jsonData.ConstraintStudentsSetMaxGapsPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Gaps: item.Max_Gaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxGapsPerWeek.length) {
        timeConstraints.ConstraintStudentsSetMaxGapsPerWeek = jsonData.ConstraintStudentsSetMaxGapsPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Gaps: item.Max_Gaps,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots.length) {
        timeConstraints.ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots = jsonData.ConstraintStudentsSetMaxSingleGapsInSelectedTimeSlots.map(item => {
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Single_Gaps: item.Max_Single_Gaps,
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour.length) {
        timeConstraints.ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour = jsonData.ConstraintStudentsSetEarlyMaxBeginningsAtSecondHour.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Beginnings_At_Second_Hour: item.Max_Beginnings_At_Second_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxHoursDaily.length) {
        timeConstraints.ConstraintStudentsSetMaxHoursDaily = jsonData.ConstraintStudentsSetMaxHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxHoursDailyInInterval.length) {
        timeConstraints.ConstraintStudentsSetMaxHoursDailyInInterval = jsonData.ConstraintStudentsSetMaxHoursDailyInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots.length) {
        timeConstraints.ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots = jsonData.ConstraintStudentsSetPairOfMutuallyExclusiveTimeSlots.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                First_Time_Slot: {
                    Day: item.First_Time_Slot.Day,
                    Hour: item.First_Time_Slot.Hour
                },
                Second_Time_Slot: {
                    Day: item.Second_Time_Slot.Day,
                    Hour: item.Second_Time_Slot.Hour
                },
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxSpanPerDay.length) {
        timeConstraints.ConstraintStudentsSetMaxSpanPerDay = jsonData.ConstraintStudentsSetMaxSpanPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Span: item.Max_Span,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetActivityTagMaxHoursDaily.length) {
        timeConstraints.ConstraintStudentsSetActivityTagMaxHoursDaily = jsonData.ConstraintStudentsSetActivityTagMaxHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxActivityTagsPerDayFromSet.length) {
        timeConstraints.ConstraintStudentsSetMaxActivityTagsPerDayFromSet = jsonData.ConstraintStudentsSetMaxActivityTagsPerDayFromSet.map(item => {
            const Activity_Tags = item.Activity_Tags.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Maximum_Allowed_Activity_Tags: item.Maximum_Allowed_Activity_Tags,
                Number_of_Activity_Tags: item.Activity_Tags.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMinHoursDaily.length) {
        timeConstraints.ConstraintStudentsSetMinHoursDaily = jsonData.ConstraintStudentsSetMinHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Minimum_Hours_Daily: item.Minimum_Hours_Daily,
                Allow_Empty_Days: item.Allow_Empty_Days ? 'true' : 'false',
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetActivityTagMinHoursDaily.length) {
        timeConstraints.ConstraintStudentsSetActivityTagMinHoursDaily = jsonData.ConstraintStudentsSetActivityTagMinHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Minimum_Hours_Daily: item.Minimum_Hours_Daily,
                Minimum_Days_With_Tag: item.Minimum_Days_With_Tag,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxHoursContinuously.length) {
        timeConstraints.ConstraintStudentsSetMaxHoursContinuously = jsonData.ConstraintStudentsSetMaxHoursContinuously.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Maximum_Hours_Continuously: item.Maximum_Hours_Continuously,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetActivityTagMaxHoursContinuously.length) {
        timeConstraints.ConstraintStudentsSetActivityTagMaxHoursContinuously = jsonData.ConstraintStudentsSetActivityTagMaxHoursContinuously.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Maximum_Hours_Continuously: item.Maximum_Hours_Continuously,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMinGapsBetweenActivityTag.length) {
        timeConstraints.ConstraintStudentsSetMinGapsBetweenActivityTag = jsonData.ConstraintStudentsSetMinGapsBetweenActivityTag.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                MinGaps: item.MinGaps,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags.length) {
        timeConstraints.ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags = jsonData.ConstraintStudentsSetMinGapsBetweenOrderedPairOfActivityTags.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                MinGaps: item.MinGaps,
                First_Activity_Tag: item.First_Activity_Tag,
                Second_Activity_Tag: item.Second_Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetIntervalMaxDaysPerWeek.length) {
        timeConstraints.ConstraintStudentsSetIntervalMaxDaysPerWeek = jsonData.ConstraintStudentsSetIntervalMaxDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Days_Per_Week: item.Max_Days_Per_Week,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMinRestingHours.length) {
        timeConstraints.ConstraintStudentsSetMinRestingHours = jsonData.ConstraintStudentsSetMinRestingHours.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Minimum_Resting_Hours: item.Minimum_Resting_Hours,
                Circular: item.Circular ? 'true' : 'false',
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsMaxDaysPerWeek.Active) {
        timeConstraints.ConstraintStudentsMaxDaysPerWeek = {
            Weight_Percentage: 100,
            Max_Days_Per_Week: jsonData.ConstraintStudentsMaxDaysPerWeek.Max_Days_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxGapsPerWeek.Active) {
        timeConstraints.ConstraintStudentsMaxGapsPerWeek = {
            Weight_Percentage: 100,
            Max_Gaps: jsonData.ConstraintStudentsMaxGapsPerWeek.Max_Gaps,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxGapsPerDay.Active) {
        timeConstraints.ConstraintStudentsMaxGapsPerDay = {
            Weight_Percentage: 100,
            Max_Gaps: jsonData.ConstraintStudentsMaxGapsPerDay.Max_Gaps,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsEarlyMaxBeginningsAtSecondHour.Active) {
        timeConstraints.ConstraintStudentsEarlyMaxBeginningsAtSecondHour = {
            Weight_Percentage: 100,
            Max_Beginnings_At_Second_Hour: jsonData.ConstraintStudentsEarlyMaxBeginningsAtSecondHour.Max_Beginnings_At_Second_Hour,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxHoursDaily.Active) {
        timeConstraints.ConstraintStudentsMaxHoursDaily = {
            Weight_Percentage: 100,
            Maximum_Hours_Daily: jsonData.ConstraintStudentsMaxHoursDaily.Maximum_Hours_Daily,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxSpanPerDay.Active) {
        timeConstraints.ConstraintStudentsMaxSpanPerDay = {
            Weight_Percentage: 100,
            Max_Span: jsonData.ConstraintStudentsMaxSpanPerDay.Max_Span,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxSingleGapsInSelectedTimeSlots.length) {
        timeConstraints.ConstraintStudentsMaxSingleGapsInSelectedTimeSlots = jsonData.ConstraintStudentsMaxSingleGapsInSelectedTimeSlots.map(item => {
            const Selected_Time_Slots = item.Selected_Time_Slot.map(item2 => {
                return {
                    Selected_Time_Slot: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Max_Single_Gaps: item.Max_Single_Gaps,
                Number_of_Selected_Time_Slots: item.Selected_Time_Slot.length,
                Selected_Time_Slot: Selected_Time_Slots.map(bt => bt.Selected_Time_Slot),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsMaxHoursDailyInInterval.length) {
        timeConstraints.ConstraintStudentsMaxHoursDailyInInterval = jsonData.ConstraintStudentsMaxHoursDailyInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsActivityTagMaxHoursDaily.length) {
        timeConstraints.ConstraintStudentsActivityTagMaxHoursDaily = jsonData.ConstraintStudentsActivityTagMaxHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Maximum_Hours_Daily: item.Maximum_Hours_Daily,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsPairOfMutuallyExclusiveTimeSlots.length) {
        timeConstraints.ConstraintStudentsPairOfMutuallyExclusiveTimeSlots = jsonData.ConstraintStudentsPairOfMutuallyExclusiveTimeSlots.map(item => {
            return {
                Weight_Percentage: 100,
                First_Time_Slot: {
                    Day: item.First_Time_Slot.Day,
                    Hour: item.First_Time_Slot.Hour
                },
                Second_Time_Slot: {
                    Day: item.Second_Time_Slot.Day,
                    Hour: item.Second_Time_Slot.Hour
                },
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsMinHoursDaily.Active) {
        timeConstraints.ConstraintStudentsMinHoursDaily = {
            Weight_Percentage: 100,
            Minimum_Hours_Daily: jsonData.ConstraintStudentsMinHoursDaily.Minimum_Hours_Daily,
            Allow_Empty_Days: jsonData.ConstraintStudentsMinHoursDaily.Allow_Empty_Days ? 'true' : 'false',
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMinRestingHours.Active) {
        timeConstraints.ConstraintStudentsMinRestingHours = {
            Weight_Percentage: 100,
            Minimum_Resting_Hours: jsonData.ConstraintStudentsMinRestingHours.Minimum_Resting_Hours,
            Circular: jsonData.ConstraintStudentsMinRestingHours.Circular ? 'true' : 'false',
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxHoursContinuously.Active) {
        timeConstraints.ConstraintStudentsMaxHoursContinuously = {
            Weight_Percentage: 100,
            Maximum_Hours_Continuously: jsonData.ConstraintStudentsMaxHoursContinuously.Maximum_Hours_Continuously,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxActivityTagsPerDayFromSet.length) {
        timeConstraints.ConstraintStudentsMaxActivityTagsPerDayFromSet = jsonData.ConstraintStudentsMaxActivityTagsPerDayFromSet.map(item => {
            const Activity_Tags = item.Activity_Tags.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Maximum_Allowed_Activity_Tags: item.Maximum_Allowed_Activity_Tags,
                Number_of_Activity_Tags: item.Activity_Tags.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsActivityTagMinHoursDaily.length) {
        timeConstraints.ConstraintStudentsActivityTagMinHoursDaily = jsonData.ConstraintStudentsActivityTagMinHoursDaily.map(item => {
            return {
                Weight_Percentage: 100,
                Minimum_Hours_Daily: item.Minimum_Hours_Daily,
                Minimum_Days_With_Tag: item.Minimum_Days_With_Tag,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsActivityTagMaxHoursContinuously.length) {
        timeConstraints.ConstraintStudentsActivityTagMaxHoursContinuously = jsonData.ConstraintStudentsActivityTagMaxHoursContinuously.map(item => {
            return {
                Weight_Percentage: 100,
                Maximum_Hours_Continuously: item.Maximum_Hours_Continuously,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsMinGapsBetweenActivityTag.length) {
        timeConstraints.ConstraintStudentsMinGapsBetweenActivityTag = jsonData.ConstraintStudentsMinGapsBetweenActivityTag.map(item => {
            return {
                Weight_Percentage: 100,
                MinGaps: item.MinGaps,
                Activity_Tag: item.Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags.length) {
        timeConstraints.ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags = jsonData.ConstraintStudentsMinGapsBetweenOrderedPairOfActivityTags.map(item => {
            return {
                Weight_Percentage: 100,
                MinGaps: item.MinGaps,
                First_Activity_Tag: item.First_Activity_Tag,
                Second_Activity_Tag: item.Second_Activity_Tag,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsIntervalMaxDaysPerWeek.length) {
        timeConstraints.ConstraintStudentsIntervalMaxDaysPerWeek = jsonData.ConstraintStudentsIntervalMaxDaysPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Max_Days_Per_Week: item.Max_Days_Per_Week,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }

    fetData.fet.Time_Constraints_List = timeConstraints;
    const spaceConstraints = {
        ConstraintBasicCompulsorySpace: {
            Weight_Percentage: 100,
            Active: 'true',
            Comments: '',
        }
    };
    if (jsonData.ConstraintSubjectPreferredRooms.length) {
        spaceConstraints.ConstraintSubjectPreferredRooms = jsonData.ConstraintSubjectPreferredRooms.map(item => {
            const Preferred_Rooms = item.Preferred_Room.map(item2 => {
                return {
                    Preferred_Room: item2.Preferred_Room
                };
            });
            return {
                Weight_Percentage: 100,
                Subject: item.Subject,
                Number_of_Preferred_Rooms: item.Preferred_Room.length,
                Preferred_Room: Preferred_Rooms.map(bt => bt.Preferred_Room),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityTagPreferredRooms.length) {
        spaceConstraints.ConstraintActivityTagPreferredRooms = jsonData.ConstraintActivityTagPreferredRooms.map(item => {
            const Preferred_Rooms = item.Preferred_Room.map(item2 => {
                return {
                    Preferred_Room: item2.Preferred_Room
                };
            });
            return {
                Weight_Percentage: 100,
                Activity_Tag: item.Activity_Tag,
                Number_of_Preferred_Rooms: item.Preferred_Room.length,
                Preferred_Room: Preferred_Rooms.map(bt => bt.Preferred_Room),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintSubjectActivityTagPreferredRooms.length) {
        spaceConstraints.ConstraintSubjectActivityTagPreferredRooms = jsonData.ConstraintSubjectActivityTagPreferredRooms.map(item => {
            const Preferred_Rooms = item.Preferred_Room.map(item2 => {
                return {
                    Preferred_Room: item2.Preferred_Room
                };
            });
            return {
                Weight_Percentage: 100,
                Activity_Tag: item.Activity_Tag,
                Subject: item.Subject,
                Number_of_Preferred_Rooms: item.Preferred_Room.length,
                Preferred_Room: Preferred_Rooms.map(bt => bt.Preferred_Room),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintRoomNotAvailableTimes.length) {
        spaceConstraints.ConstraintRoomNotAvailableTimes = jsonData.ConstraintRoomNotAvailableTimes.map(item => {
            const Not_Available_Times = item.Not_Available_Time.map(item2 => {
                return {
                    Not_Available_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Room: item.Room,
                Number_of_Not_Available_Times: item.Not_Available_Time.length,
                Not_Available_Time: Not_Available_Times.map(bt => bt.Not_Available_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherRoomNotAvailableTimes.length) {
        spaceConstraints.ConstraintTeacherRoomNotAvailableTimes = jsonData.ConstraintTeacherRoomNotAvailableTimes.map(item => {
            const Not_Available_Times = item.Not_Available_Time.map(item2 => {
                return {
                    Not_Available_Time: {
                        Day: item2.Day,
                        Hour: item2.Hour
                    }
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Number_of_Not_Available_Times: item.Not_Available_Time.length,
                Not_Available_Time: Not_Available_Times.map(bt => bt.Not_Available_Time),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintRoomMaxActivityTagsPerDayFromSet.length) {
        spaceConstraints.ConstraintRoomMaxActivityTagsPerDayFromSet = jsonData.ConstraintRoomMaxActivityTagsPerDayFromSet.map(item => {
            const Activity_Tags = item.Activity_Tag.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Room: item.Room,
                Maximum_Allowed_Activity_Tags: item.Maximum_Allowed_Activity_Tags,
                Number_of_Activity_Tags: item.Activity_Tag.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintRoomMaxActivityTagsPerWeekFromSet.length) {
        spaceConstraints.ConstraintRoomMaxActivityTagsPerWeekFromSet = jsonData.ConstraintRoomMaxActivityTagsPerWeekFromSet.map(item => {
            const Activity_Tags = item.Activity_Tag.map(item2 => {
                return {
                    Activity_Tag: item2.Activity_Tag
                };
            });
            return {
                Weight_Percentage: 100,
                Room: item.Room,
                Maximum_Allowed_Activity_Tags: item.Maximum_Allowed_Activity_Tags,
                Number_of_Activity_Tags: item.Activity_Tag.length,
                Activity_Tag: Activity_Tags.map(bt => bt.Activity_Tag),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivityPreferredRooms.length) {
        spaceConstraints.ConstraintActivityPreferredRooms = jsonData.ConstraintActivityPreferredRooms.map(item => {
            const Preferred_Rooms = item.Preferred_Room.map(item2 => {
                return {
                    Preferred_Room: item2.Preferred_Room
                };
            });
            return {
                Weight_Percentage: 100,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Number_of_Preferred_Rooms: item.Preferred_Room.length,
                Preferred_Room: Preferred_Rooms.map(bt => bt.Preferred_Room),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesSameRoomIfConsecutive.length) {
        spaceConstraints.ConstraintActivitiesSameRoomIfConsecutive = jsonData.ConstraintActivitiesSameRoomIfConsecutive.map(item => {
            return {
                Weight_Percentage: 100,
                Number_of_Activities: 1,
                Activity_Id: getActivityId(jsonData.activities, item.Activity_Id),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintActivitiesOccupyMaxDifferentRooms.length) {
        spaceConstraints.ConstraintActivitiesOccupyMaxDifferentRooms = jsonData.ConstraintActivitiesOccupyMaxDifferentRooms.map(item => {
            const Activity_Ids = item.Activity.map(item2 => {
                return {
                    Activity_Id: getActivityId(jsonData.activities, item2.Activity_Id)
                };
            });
            return {
                Weight_Percentage: 100,
                Number_of_Activities: item.Activity.length,
                Activity_Id: Activity_Ids.map(bt => bt.Activity_Id),
                Max_Number_of_Different_Rooms: item.Max_Number_of_Different_Rooms,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherHomeRoom.length) {
        spaceConstraints.ConstraintTeacherHomeRoom = jsonData.ConstraintTeacherHomeRoom.map(item => {
            return {
                Weight_Percentage: 100,
                Room: item.Room,
                Teacher: item.Teacher,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherHomeRooms.length) {
        spaceConstraints.ConstraintTeacherHomeRooms = jsonData.ConstraintTeacherHomeRooms.map(item => {
            const Preferred_Rooms = item.Preferred_Room.map(item2 => {
                return {
                    Preferred_Room: item2.Preferred_Room
                };
            });
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Number_of_Preferred_Rooms: item.Preferred_Room.length,
                Preferred_Room: Preferred_Rooms.map(bt => bt.Preferred_Room),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxRoomChangesPerDay.length) {
        spaceConstraints.ConstraintTeacherMaxRoomChangesPerDay = jsonData.ConstraintTeacherMaxRoomChangesPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Room_Changes_Per_Day: item.Max_Room_Changes_Per_Day,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxRoomChangesPerDayInInterval.length) {
        spaceConstraints.ConstraintTeacherMaxRoomChangesPerDayInInterval = jsonData.ConstraintTeacherMaxRoomChangesPerDayInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Room_Changes_Per_Day: item.Max_Room_Changes_Per_Day,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxRoomChangesPerWeek.length) {
        spaceConstraints.ConstraintTeacherMaxRoomChangesPerWeek = jsonData.ConstraintTeacherMaxRoomChangesPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Room_Changes_Per_Week: item.Max_Room_Changes_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinGapsBetweenRoomChanges.length) {
        spaceConstraints.ConstraintTeacherMinGapsBetweenRoomChanges = jsonData.ConstraintTeacherMinGapsBetweenRoomChanges.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Min_Gaps_Between_Room_Changes: item.Min_Gaps_Between_Room_Changes,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxBuildingChangesPerDay.length) {
        spaceConstraints.ConstraintTeacherMaxBuildingChangesPerDay = jsonData.ConstraintTeacherMaxBuildingChangesPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Building_Changes_Per_Day: item.Max_Building_Changes_Per_Day,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxBuildingChangesPerDayInInterval.length) {
        spaceConstraints.ConstraintTeacherMaxBuildingChangesPerDayInInterval = jsonData.ConstraintTeacherMaxBuildingChangesPerDayInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Building_Changes_Per_Day: item.Max_Building_Changes_Per_Day,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMaxBuildingChangesPerWeek.length) {
        spaceConstraints.ConstraintTeacherMaxBuildingChangesPerWeek = jsonData.ConstraintTeacherMaxBuildingChangesPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Max_Building_Changes_Per_Week: item.Max_Building_Changes_Per_Week,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeacherMinGapsBetweenBuildingChanges.length) {
        spaceConstraints.ConstraintTeacherMinGapsBetweenBuildingChanges = jsonData.ConstraintTeacherMinGapsBetweenBuildingChanges.map(item => {
            return {
                Weight_Percentage: 100,
                Teacher: item.Teacher,
                Min_Gaps_Between_Building_Changes: item.Min_Gaps_Between_Building_Changes,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintTeachersMaxRoomChangesPerDay.Active) {
        spaceConstraints.ConstraintTeachersMaxRoomChangesPerDay = {
            Weight_Percentage: 100,
            Max_Room_Changes_Per_Day: jsonData.ConstraintTeachersMaxRoomChangesPerDay.Max_Room_Changes_Per_Day,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxRoomChangesPerDayInInterval.Active) {
        spaceConstraints.ConstraintTeachersMaxRoomChangesPerDayInInterval = {
            Weight_Percentage: 100,
            Max_Room_Changes_Per_Day: jsonData.ConstraintTeachersMaxRoomChangesPerDayInInterval.Max_Room_Changes_Per_Day,
            Interval_Start_Hour: jsonData.ConstraintTeachersMaxRoomChangesPerDayInInterval.Interval_Start_Hour,
            Interval_End_Hour: jsonData.ConstraintTeachersMaxRoomChangesPerDayInInterval.Interval_End_Hour,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxRoomChangesPerWeek.Active) {
        spaceConstraints.ConstraintTeachersMaxRoomChangesPerWeek = {
            Weight_Percentage: 100,
            Max_Room_Changes_Per_Week: jsonData.ConstraintTeachersMaxRoomChangesPerWeek.Max_Room_Changes_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMinGapsBetweenRoomChanges.Active) {
        spaceConstraints.ConstraintTeachersMinGapsBetweenRoomChanges = {
            Weight_Percentage: 100,
            Min_Gaps_Between_Room_Changes: jsonData.ConstraintTeachersMinGapsBetweenRoomChanges.Min_Gaps_Between_Room_Changes,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxBuildingChangesPerDay.Active) {
        spaceConstraints.ConstraintTeachersMaxBuildingChangesPerDay = {
            Weight_Percentage: 100,
            Max_Building_Changes_Per_Day: jsonData.ConstraintTeachersMaxBuildingChangesPerDay.Max_Building_Changes_Per_Day,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxBuildingChangesPerWeek.Active) {
        spaceConstraints.ConstraintTeachersMaxBuildingChangesPerWeek = {
            Weight_Percentage: 100,
            Max_Building_Changes_Per_Week: jsonData.ConstraintTeachersMaxBuildingChangesPerWeek.Max_Building_Changes_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMinGapsBetweenBuildingChanges.Active) {
        spaceConstraints.ConstraintTeachersMinGapsBetweenBuildingChanges = {
            Weight_Percentage: 100,
            Min_Gaps_Between_Building_Changes: jsonData.ConstraintTeachersMinGapsBetweenBuildingChanges.Min_Gaps_Between_Building_Changes,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintTeachersMaxBuildingChangesPerDayInInterval.Active) {
        spaceConstraints.ConstraintTeachersMaxBuildingChangesPerDayInInterval = {
            Weight_Percentage: 100,
            Max_Building_Changes_Per_Day: jsonData.ConstraintTeachersMaxBuildingChangesPerDayInInterval.Max_Building_Changes_Per_Day,
            Interval_Start_Hour: jsonData.ConstraintTeachersMaxBuildingChangesPerDayInInterval.Interval_Start_Hour,
            Interval_End_Hour: jsonData.ConstraintTeachersMaxBuildingChangesPerDayInInterval.Interval_End_Hour,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsSetHomeRoom.length) {
        spaceConstraints.ConstraintStudentsSetHomeRoom = jsonData.ConstraintStudentsSetHomeRoom.map(item => {
            return {
                Weight_Percentage: 100,
                Room: item.Room,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetHomeRooms.length) {
        spaceConstraints.ConstraintStudentsSetHomeRooms = jsonData.ConstraintStudentsSetHomeRooms.map(item => {
            const Preferred_Rooms = item.Preferred_Room.map(item2 => {
                return {
                    Preferred_Room: item2.Preferred_Room
                };
            });
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Number_of_Preferred_Rooms: item.Preferred_Room.length,
                Preferred_Room: Preferred_Rooms.map(bt => bt.Preferred_Room),
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxRoomChangesPerDay.length) {
        spaceConstraints.ConstraintStudentsSetMaxRoomChangesPerDay = jsonData.ConstraintStudentsSetMaxRoomChangesPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Max_Room_Changes_Per_Day: item.Max_Room_Changes_Per_Day,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxRoomChangesPerDayInInterval.length) {
        spaceConstraints.ConstraintStudentsSetMaxRoomChangesPerDayInInterval = jsonData.ConstraintStudentsSetMaxRoomChangesPerDayInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Room_Changes_Per_Day: item.Max_Room_Changes_Per_Day,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxRoomChangesPerWeek.length) {
        spaceConstraints.ConstraintStudentsSetMaxRoomChangesPerWeek = jsonData.ConstraintStudentsSetMaxRoomChangesPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Max_Room_Changes_Per_Week: item.Max_Room_Changes_Per_Week,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMinGapsBetweenRoomChanges.length) {
        spaceConstraints.ConstraintStudentsSetMinGapsBetweenRoomChanges = jsonData.ConstraintStudentsSetMinGapsBetweenRoomChanges.map(item => {
            return {
                Weight_Percentage: 100,
                Min_Gaps_Between_Room_Changes: item.Min_Gaps_Between_Room_Changes,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxBuildingChangesPerDay.length) {
        spaceConstraints.ConstraintStudentsSetMaxBuildingChangesPerDay = jsonData.ConstraintStudentsSetMaxBuildingChangesPerDay.map(item => {
            return {
                Weight_Percentage: 100,
                Max_Building_Changes_Per_Day: item.Max_Building_Changes_Per_Day,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxBuildingChangesPerDayInInterval.length) {
        spaceConstraints.ConstraintStudentsSetMaxBuildingChangesPerDayInInterval = jsonData.ConstraintStudentsSetMaxBuildingChangesPerDayInInterval.map(item => {
            return {
                Weight_Percentage: 100,
                Students: item.Students,
                Max_Building_Changes_Per_Day: item.Max_Building_Changes_Per_Day,
                Interval_Start_Hour: item.Interval_Start_Hour,
                Interval_End_Hour: item.Interval_End_Hour,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMaxBuildingChangesPerWeek.length) {
        spaceConstraints.ConstraintStudentsSetMaxBuildingChangesPerWeek = jsonData.ConstraintStudentsSetMaxBuildingChangesPerWeek.map(item => {
            return {
                Weight_Percentage: 100,
                Max_Building_Changes_Per_Week: item.Max_Building_Changes_Per_Week,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsSetMinGapsBetweenBuildingChanges.length) {
        spaceConstraints.ConstraintStudentsSetMinGapsBetweenBuildingChanges = jsonData.ConstraintStudentsSetMinGapsBetweenBuildingChanges.map(item => {
            return {
                Weight_Percentage: 100,
                Min_Gaps_Between_Building_Changes: item.Min_Gaps_Between_Building_Changes,
                Students: item.Students,
                Active: 'true',
                Comments: ''
            };
        });
    }
    if (jsonData.ConstraintStudentsMaxRoomChangesPerDay.Active) {
        spaceConstraints.ConstraintStudentsMaxRoomChangesPerDay = {
            Weight_Percentage: 100,
            Max_Room_Changes_Per_Day: jsonData.ConstraintStudentsMaxRoomChangesPerDay.Max_Room_Changes_Per_Day,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxRoomChangesPerWeek.Active) {
        spaceConstraints.ConstraintStudentsMaxRoomChangesPerWeek = {
            Weight_Percentage: 100,
            Max_Room_Changes_Per_Week: jsonData.ConstraintStudentsMaxRoomChangesPerWeek.Max_Room_Changes_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMinGapsBetweenRoomChanges.Active) {
        spaceConstraints.ConstraintStudentsMinGapsBetweenRoomChanges = {
            Weight_Percentage: 100,
            Min_Gaps_Between_Room_Changes: jsonData.ConstraintStudentsMinGapsBetweenRoomChanges.Min_Gaps_Between_Room_Changes,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxBuildingChangesPerDay.Active) {
        spaceConstraints.ConstraintStudentsMaxBuildingChangesPerDay = {
            Weight_Percentage: 100,
            Max_Building_Changes_Per_Day: jsonData.ConstraintStudentsMaxBuildingChangesPerDay.Max_Building_Changes_Per_Day,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxBuildingChangesPerWeek.Active) {
        spaceConstraints.ConstraintStudentsMaxBuildingChangesPerWeek = {
            Weight_Percentage: 100,
            Max_Building_Changes_Per_Week: jsonData.ConstraintStudentsMaxBuildingChangesPerWeek.Max_Building_Changes_Per_Week,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMinGapsBetweenBuildingChanges.Active) {
        spaceConstraints.ConstraintStudentsMinGapsBetweenBuildingChanges = {
            Weight_Percentage: 100,
            Min_Gaps_Between_Building_Changes: jsonData.ConstraintStudentsMinGapsBetweenBuildingChanges.Min_Gaps_Between_Building_Changes,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxRoomChangesPerDayInInterval.Active) {
        spaceConstraints.ConstraintStudentsMaxRoomChangesPerDayInInterval = {
            Weight_Percentage: 100,
            Max_Room_Changes_Per_Day: jsonData.ConstraintStudentsMaxRoomChangesPerDayInInterval.Max_Room_Changes_Per_Day,
            Interval_Start_Hour: jsonData.ConstraintStudentsMaxRoomChangesPerDayInInterval.Interval_Start_Hour,
            Interval_End_Hour: jsonData.ConstraintStudentsMaxRoomChangesPerDayInInterval.Interval_End_Hour,
            Active: 'true',
            Comments: ''
        };
    }
    if (jsonData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Active) {
        spaceConstraints.ConstraintStudentsMaxBuildingChangesPerDayInInterval = {
            Weight_Percentage: 100,
            Max_Building_Changes_Per_Day: jsonData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Max_Building_Changes_Per_Day,
            Interval_Start_Hour: jsonData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Interval_Start_Hour,
            Interval_End_Hour: jsonData.ConstraintStudentsMaxBuildingChangesPerDayInInterval.Interval_End_Hour,
            Active: 'true',
            Comments: ''
        };
    }
    fetData.fet.Space_Constraints_List = spaceConstraints;

    return js2xml(fetData, { compact: true, spaces: 4, fullTagEmptyElement: true });
}

exports.getTimetableTest = async (req, res) => {
    try {
        const id = req.params.id;
        const timetable = await Timetable.findByPk(id);

        if (!timetable) {
            return res.status(404).json({ error: "Emploi du temps non trouvé" });
        }

        const data = JSON.parse(fs.readFileSync(timetable.path_json, 'utf8'));
        const xmlData = convertToFetXml(data);
        const baseDir = process.env.BASE_DIR;
        const inputDir = process.env.INPUT_DIR;
        const outputDir = process.env.OUTPUT_DIR;

        [inputDir, outputDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
        
        const filename = `timetable_${id}_${Date.now()}`;
        const inputFilePath = path.join(inputDir, `${filename}.fet`);
        fs.writeFileSync(inputFilePath, xmlData);
        
        const fetCl = process.env.FET_CL_PATH;
        const command = `"${fetCl}" --inputfile="${inputFilePath}" --outputdir="${outputDir}" --htmllevel=7 --language=fr`;
        try {
            // Run FET and wait for generation to be successful
            const { stdout, stderr } = await exec(command);
            console.log('stdout', stdout);
            if (!stdout.includes("Generation successful")) {
                throw new Error("Generation failed: " + (stderr || stdout));
            }
            
            // Check for output HTML file existence
            const outputPath = path.join(outputDir, 'timetables', filename);
            const outputHtmlPath = path.join(outputDir, 'timetables', filename, `${filename}_index.html`);
            const maxAttempts = 100;
            const delay = 5000; // milliseconds
            
            let attempts = 0;
            let htmlExists = false;
            
            while (attempts < maxAttempts && !htmlExists) {
                attempts++;
                htmlExists = fs.existsSync(outputHtmlPath);
                if (!htmlExists) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            if (!htmlExists) {
                throw new Error("HTML output file was not created");
            } else {
                const files = fs.readdirSync(outputPath);
                for (const file of files) {
                    const filePath = path.join(outputPath, file);
                    if (fs.statSync(filePath).isFile()) {
                        let content = fs.readFileSync(filePath, 'utf8');
                        content = content.replace(
                            new RegExp(escapeRegExp(process.env.FET_NAME), 'g'),
                            process.env.APP_NAME
                        );
                        fs.writeFileSync(filePath, content);
                    }
                }
            }
            
            const output_html = `${process.env.HTML_OUT_URL}/${filename}/${filename}_index.html`;

            res.json({
                ...timetable.toJSON(), // Inclut created_at
                data,
                xmlData,
                inputFilePath,
                command,
                output_html,
                result: stdout
            });
        } catch (execError) {
            // Handle execution errors specifically
            const warningsPath = path.join(outputDir, 'logs', 'warnings.txt');
            const errorsPath = path.join(outputDir, 'logs', 'errors.txt');
            let warningsContent = 'No warnings file found';
            
            try {
                if (fs.existsSync(warningsPath)) {
                    warningsContent = fs.readFileSync(warningsPath, 'utf8');
                } else if (fs.existsSync(errorsPath)) {
                    warningsContent = fs.readFileSync(errorsPath, 'utf8');
                }
            } catch (readError) {
                warningsContent = `Could not read warnings file: ${readError.message}`;
            }
            
            console.error("FET Execution Error:", execError);
            console.error("Warnings:", warningsContent);
            
            res.json({ 
                ...timetable.toJSON(), // Inclut created_at
                data,
                xmlData,
                error: "FET generation failed",
                details: execError.message,
                warnings: warningsContent,
                stdout: execError.stdout,
                stderr: execError.stderr
            });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        res.status(500).json({ error: "Une erreur est survenue", details: error.message });
    }
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getActivityId(activities, id) {
    let activityId = 1;
    activities.forEach((activity, index) => {
        if (activity.durations.length > 1) {
            let firstId = 0;
            if (id == index) {
                return activityId;
            }
            activity.durations.forEach((duration, i) => {
                if (i == 0) {
                    firstId = activityId;
                }
                activityId++;
            });
        } else {
            if (id == index) {
                return activityId;
            }
            activityId++;
        }
    });
    return 0;
}