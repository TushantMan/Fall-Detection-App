const db = require("../models");
const DataPoint = db.DataPoint;
const Op = db.Sequelize.Op;

// Create data point
exports.create = (req, res) => {
  const dataPoint = {
    deviceId: req.body.deviceId,
    timestamp: req.body.timestamp,
    value: req.body.value,
    area: req.body.area
  };

  DataPoint.create(dataPoint)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Get all data points
exports.findAll = (req, res) => {
  DataPoint.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data points.",
      });
    });
};

// Get all data points for a specific device
exports.findAllForDevice = (req, res) => {
  const deviceId = req.params.deviceId;
  DataPoint.findAll({ where: { deviceId: deviceId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || `Some error occurred while retrieving data points for device id=${deviceId}.`,
      });
    });
};

// Get one data point by id
exports.findOne = (req, res) => {
  const id = req.params.dataPointId;
  DataPoint.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find DataPoint with id=${id}.`
        });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Update one data point by id
exports.update = (req, res) => {
  const id = req.params.dataPointId;
  DataPoint.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "DataPoint was updated successfully." });
      } else {
        res.send({ message: `Cannot update DataPoint with id=${id}. Maybe DataPoint was not found or req.body is empty!` });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Delete one data point by id
exports.delete = (req, res) => {
  const id = req.params.dataPointId;
  DataPoint.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "DataPoint was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete DataPoint with id=${id}. Maybe DataPoint was not found!` });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Generate dummy data points
exports.generateDummyData = async (req, res) => {
  const areas = ["North", "South", "East", "West"];
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
  const generateRandomValue = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

  try {
    const devices = await Device.findAll();
    console.log(`Found ${devices.length} devices for data point generation.`);

    // Ensure there are exactly 4 devices before generating data points
    if (devices.length !== 4) {
      return res.status(400).send({
        message: "Data points will only be generated when there are exactly 4 devices."
      });
    }

    const dataPoints = [];
    const startDate = new Date(2023, 0, 1);

    for (const device of devices) {
      for (let i = 0; i < 100; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dataPoint = await DataPoint.create({
          deviceId: device.id,
          timestamp: date,
          value: generateRandomValue(0, 100),
          area: getRandomElement(areas)
        });
        dataPoints.push(dataPoint);
        console.log(`Data point created: ${JSON.stringify(dataPoint)}`);
      }
    }

    res.send({ message: "Dummy data points generated successfully", count: dataPoints.length });
  } catch (err) {
    console.error("Error generating dummy data points:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while generating dummy data points."
    });
  }
};