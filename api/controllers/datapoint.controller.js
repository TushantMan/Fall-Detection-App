const db = require("../models");
const DataPoint = db.DataPoint;
const Device = db.Device
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
  const deviceId = req.params.deviceId;
  const areas = ["North", "South", "East", "West"];
  const categories = [
    { value: 1, name: "Standby", label: 0 },
    { value: 6, name: "Fast Fall", label: 1 },
    { value: 7, name: "Slow Fall", label: 1 },
    { value: 8, name: "Stand Up", label: 0 }
  ];

  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  try {
    const device = await Device.findByPk(deviceId);
    if (!device) {
      return res.status(404).send({
        message: "Device not found."
      });
    }

    if (device.paused) {
      return res.status(400).send({
        message: "Device is paused. Cannot generate data."
      });
    }

    let count = 0;
    const intervalId = setInterval(async () => {
      if (count >= 50) {
        clearInterval(intervalId);
        return;
      }

      // Check if the device is still not paused before generating a data point
      const updatedDevice = await Device.findByPk(deviceId);
      if (updatedDevice.paused) {
        clearInterval(intervalId);
        return;
      }

      const category = getRandomElement(categories);
      const dataPoint = await DataPoint.create({
        deviceId: device.id,
        timestamp: new Date(),
        value: category.value,
        category: category.name,
        label: category.label,
        area: getRandomElement(areas)
      });
      console.log("Generated data point:", dataPoint);

      if (dataPoint.value === 6 || dataPoint.value === 7) {
        // TODO: Send notification for the relevant data point
        console.log("Sending notification for data point:", dataPoint);
      }

      count++;
    }, 5000);

    res.send({ message: "Successfully connected" });
  } catch (err) {
    console.error("Error generating dummy data points:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while generating dummy data points."
    });
  }
};

// Get the latest data point for a specific device
exports.getLatestDataPoint = async (req, res) => {
  const deviceId = req.params.deviceId;

  try {
    const device = await Device.findByPk(deviceId);
    if (!device) {
      return res.status(404).send({ message: 'Device not found.' });
    }

    if (device.paused) {
      return res.status(400).send({ message: 'Device is paused. No new data available.' });
    }

    const latestDataPoint = await DataPoint.findOne({
      where: { deviceId: deviceId },
      order: [['createdAt', 'DESC']],
    });

    if (latestDataPoint) {
      // Check if the data point has a label of 1 or a value of 6 or 7
      if (latestDataPoint.value === 6 || latestDataPoint.value === 7) {
        // TODO: Send notification for the relevant data point
        console.log("Sending notification for data point:", latestDataPoint);
      }
      res.send(latestDataPoint);
    } else {
      res.status(404).send({ message: 'No data points found for the specified device.' });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving the latest data point.',
    });
  }
};