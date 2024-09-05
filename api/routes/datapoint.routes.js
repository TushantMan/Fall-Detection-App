module.exports = app => {
  const dataPoints = require("../controllers/datapoint.controller.js");
  
    var router = require("express").Router();
  
    // Create a new DataPoint
    router.post("/dataPoints/", dataPoints.create);
  
    // Retrieve all DataPoints
    router.get("/dataPoints/", dataPoints.findAll);
  
    // Retrieve all DataPoints for a specific Device
    router.get("/devices/:deviceId/dataPoints", dataPoints.findAllForDevice);
  
    // Retrieve a single DataPoint with id
    router.get("/dataPoints/:dataPointId", dataPoints.findOne);
  
    // Update a DataPoint with id
    router.put("/dataPoints/:dataPointId", dataPoints.update);
  
    // Delete a DataPoint with id
    router.delete("/dataPoints/:dataPointId", dataPoints.delete);
  
    // Generate dummy data points
    router.post("/devices/:deviceId/dataPoints/generate", dataPoints.generateDummyData);

  app.use('/api', router);
};