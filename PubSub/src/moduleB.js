const pubsub = require("./pubsub");

const subscription = pubsub.subscribe("AEvent", function (data) {
  console.log(data);
    subscription.unsubscribe();
});
