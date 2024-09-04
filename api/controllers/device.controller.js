const db = require("../models");
const Device = db.Device;
const Op = db.Sequelize.Op;

// Create device
exports.create = (req, res) => {
  const device = {
    name: req.body.name,
    deviceId: req.body.deviceId,
    location: req.body.location,
    status: req.body.status
  };

  Device.create(device)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Get all devices
exports.findAll = (req, res) => {
  Device.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving devices.",
      });
    });
};

// Get one device by id
exports.findOne = (req, res) => {
  const id = req.params.deviceId;
  Device.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Device with id=${id}.`
        });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Update one device by id
exports.update = (req, res) => {
  const id = req.params.deviceId;
  Device.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Device was updated successfully." });
      } else {
        res.send({ message: `Cannot update Device with id=${id}. Maybe Device was not found or req.body is empty!` });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Delete one device by id
exports.delete = (req, res) => {
  const id = req.params.deviceId;
  Device.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Device was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete Device with id=${id}. Maybe Device was not found!` });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Generate dummy devices
exports.generateDummyData = async (req, res) => {
  const deviceNames = ["Rasberry Pi 1", "Rasberry Pi 2", "Rasberry Pi 3", "Rasberry Pi 4"];
  const locations = ["Room A", "Room B", "Room C", "Outdoor"];
  const statuses = ["Active", "Inactive", "Maintenance"];

  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  try {
    // Check the current number of devices
    const existingDevices = await Device.findAll();
    if (existingDevices.length >= 4) {
      return res.send({ message: "4 devices already exist. No new devices will be generated." });
    }

    const devicesToCreate = 4 - existingDevices.length;
    const devices = [];

    // Create devices up to 4
    for (let i = 0; i < devicesToCreate; i++) {
      const device = await Device.create({
        name: deviceNames[i], // Ensure unique names
        location: getRandomElement(locations),
        status: getRandomElement(statuses)
      });
      devices.push(device);
    }

    res.send({ message: `${devicesToCreate} dummy devices generated successfully`, devices });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while generating dummy devices."
    });
  }
};