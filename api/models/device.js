module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define("device", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('Active', 'Inactive', 'Maintenance'),
      defaultValue: 'Active',
    },
    paused: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Device;
};