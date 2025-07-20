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
/*
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
        const result = runFet(command);
        const output_html = `${process.env.HTML_OUT_URL}/${filename}/${filename}_index.html`;

        res.json({
            ...timetable.toJSON(), // Inclut created_at
            data,
            xmlData,
            inputFilePath,
            command,
            output_html,
            result
        });
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        res.status(500).json({ error: "Une erreur est survenue", "error":error });
    }
};*/

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
            _attributes: { version: '7.2.6' },
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
                Selected_Time_Slot: Not_Available_Times.map(bt => bt.Not_Available_Time),
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
                Number_of_Preferred_Rooms: item.Preferred_Room.Number_of_Preferred_Rooms,
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
                Number_of_Preferred_Rooms: item.Preferred_Room.Number_of_Preferred_Rooms,
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
                Number_of_Preferred_Rooms: item.Preferred_Room.Number_of_Preferred_Rooms,
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
                Selected_Time_Slot: Not_Available_Times.map(bt => bt.Not_Available_Time),
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
                Selected_Time_Slot: Not_Available_Times.map(bt => bt.Not_Available_Time),
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