const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'brx_db',
  process.env.DB_USER || 'brx_user',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test de la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à PostgreSQL:', error.message);
    return false;
  }
};

// Synchronisation des modèles (à utiliser en développement uniquement)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(`✅ Base de données synchronisée ${force ? '(FORCE MODE)' : ''}`);
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
