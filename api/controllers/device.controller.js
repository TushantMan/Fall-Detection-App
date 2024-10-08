const db = require("../models");
const Device = db.Device;
const Op = db.Sequelize.Op;

// Create device
exports.create = (req, res) => {
  const device = {
    name: req.body.name,
    deviceId: req.body.deviceId,
    location: req.body.location,
    status: req.body.status,
    area: req.body.location
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
// Pause device
exports.pauseDevice = async (req, res) => {
  const id = req.params.deviceId;
  try {
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).send({ message: `Device with id=${id} not found.` });
    }
    
    await device.update({ paused: true });
    res.send({ message: "Device paused successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error pausing device." });
  }
};

// Resume device
exports.resumeDevice = async (req, res) => {
  const id = req.params.deviceId;
  try {
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).send({ message: `Device with id=${id} not found.` });
    }
    
    await device.update({ paused: false });
    res.send({ message: "Device resumed successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error resuming device." });
  }
};
// Generate dummy devices
exports.generateDummyData = async (req, res) => {
  const rooms = ["Room 101", "Room 102", "Room 103", "Room 104"];
  const statuses = ["Active", "Maintenance"];

  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  try {
    const existingDevices = await Device.findAll();
    if (existingDevices.length >= 4) {
      return res.status(400).send({ message: "Maximum number of devices (4) reached. No new device will be added." });
    }

    // Determine the next available room
    const nextRoomIndex = existingDevices.length;
    const nextRoom = rooms[nextRoomIndex];

    const device = await Device.create({
      name: `Raspberry Pi ${nextRoomIndex + 1}`,
      location: nextRoom,
      status: getRandomElement(statuses),
      area: nextRoom  // Set area to be the same as location
    });

    res.send({ message: "Device added successfully", device: device });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while generating the dummy device."
    });
  }
}