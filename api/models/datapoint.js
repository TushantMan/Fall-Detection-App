module.exports = (sequelize, Sequelize) => {
  const DataPoint = sequelize.define("dataPoint", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deviceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'devices',
        key: 'id',
      },
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    area: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return DataPoint;
};