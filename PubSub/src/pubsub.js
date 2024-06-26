const pubsub = function () {
  const subscribers = {};

  function subscribe(event, callback) {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    const index = subscribers[event].push(callback);

    return {
      unsubscribe() {
        subscribers[event].splice(index - 1, 1);
      },
    };
  }

  function publish(event, data) {
    if (!subscribers[event]) {
      return;
    }
    subscribers[event].forEach(function (subscriberCallback) {
      subscriberCallback(data);
    });
  }

  return {
    publish,
    subscribe,
  };
};

module.exports = pubsub();
