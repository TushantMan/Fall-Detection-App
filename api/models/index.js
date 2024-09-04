const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


/* Create database tables and models */
db.Device = require("./device.js")(sequelize, Sequelize);
db.DataPoint = require("./datapoint.js")(sequelize, Sequelize);

// Set up the relationships
db.Device.hasMany(db.DataPoint, { foreignKey: 'deviceId', onDelete: 'CASCADE' });
db.DataPoint.belongsTo(db.Device, { foreignKey: 'deviceId' });
module.exports = db;