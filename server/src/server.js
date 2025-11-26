const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet()); // Sécurité HTTP headers
app.use(compression()); // Compression des réponses
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging des requêtes

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API BRX.MA',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes API (à ajouter dans les prochaines phases)
// app.use('/api/stocks', require('./routes/stocks'));
// app.use('/api/history', require('./routes/history'));
// app.use('/api/watchlist', require('./routes/watchlist'));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Serveur BRX.MA démarré           ║
║   📡 Port: ${PORT}                      ║
║   🌍 Environnement: ${process.env.NODE_ENV || 'development'}      ║
║   📅 ${new Date().toLocaleString('fr-MA')}  ║
╚═══════════════════════════════════════╝
  `);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

module.exports = app;
