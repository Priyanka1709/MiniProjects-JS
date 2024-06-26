const pubsub = require("./pubsub");

module.exports = {
  publishEvent() {
    pubsub.publish("AEvent", "ModuleA has fired AEvent");
  },
};
