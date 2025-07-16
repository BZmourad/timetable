const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// API Routes
router.get('/timetables', timetableController.getAllTimetables);
router.post('/timetables', timetableController.submitTimetable);
router.get('/timetables/:id', timetableController.getTimetable);
router.put('/timetables/:id', timetableController.updateTimetable);
router.delete('/timetables/:id', timetableController.deleteTimetable);
router.get('/timetables/:id/show', timetableController.getTimetableShow);

module.exports = router;