const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const timetableRoutes = require('./routes/timetableRoutes');
const sequelize = require('./config/db');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes API
app.use('/api', timetableRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Quelque chose a mal tourné!' });
});

// Synchronisation de la base de données et démarrage du serveur
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
});