module.exports = app => {
    const devices = require("../controllers/device.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Device
    router.post("/devices/", devices.create);
  
    // Retrieve all Devices
    router.get("/devices/", devices.findAll);
  
    // Retrieve a single Device with id
    router.get("/devices/:deviceId", devices.findOne);
  
    // Update a Device with id
    router.put("/devices/:deviceId", devices.update);
  
    // Delete a Device with id
    router.delete("/devices/:deviceId", devices.delete);
  
    // Generate dummy devices
  router.post("/devices/generate", devices.generateDummyData);

  router.post('/devices/:deviceId/pause', devices.pauseDevice);
  router.post('/devices/:deviceId/resume', devices.resumeDevice);

  app.use('/api', router);
};