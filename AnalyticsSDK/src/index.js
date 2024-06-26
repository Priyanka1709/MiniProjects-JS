function AnalyticsFactory(api, batchSize = 10, batchInterval = 5000) {
  this.api = api;
  this.batchSize = batchSize;
  this.batchInterval = batchInterval;
  this.eventQueue = [];
  this.isPublishing = false;
  this.init();
  this.intervalId;
}
AnalyticsFactory.prototype.init = function () {
  const context = this;
  this.intervalId = setInterval(function () {
    context.publishEvents();
  }, this.batchInterval);
};
AnalyticsFactory.prototype.stopAnalytics = function () {
  if (this.intervalId) {
    console.log("Stopping analytics service");
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
};
AnalyticsFactory.prototype.eventMapper = function (event) {
  return {
    type: event.type,
    data: event.data,
    timestamp: Date.now(),
  };
};
AnalyticsFactory.prototype.sendAnalyticsEvent = function (event) {
  const mappedevent = this.eventMapper(event);
  this.eventQueue.push(mappedevent);

  if (this.eventQueue.length >= this.batchSize) {
    this.publishEvents();
  }
};
AnalyticsFactory.prototype.publishEvents = async function () {
  if (this.isPublishing === true || this.eventQueue.length === 0) {
    console.log("Publishing in progress or no events to send");
    return;
  }
  this.isPublishing = true;
  const eventsToPublish = [...this.eventQueue];
  this.eventQueue = [];
  try {
    const response = await Promise.resolve({ ok: true });
    // const response = await fetch(this.api, {
    //   method: "POST",
    //   body: JSON.stringify(eventsToPublish),
    // });
    if (response.ok) {
      console.log("events sent successfully", eventsToPublish);
    } else {
      console.log("Failure in sending events", eventsToPublish);
      this.eventQueue = [...eventsToPublish, ...this.eventQueue];
    }
  } catch (e) {
    console.log("Failure in sending events", e);
    this.eventQueue = [...eventsToPublish, ...this.eventQueue];
  } finally {
    this.isPublishing = false;
  }
};

//usage example
const analyticsFactory = new AnalyticsFactory(
  "https://example.com/analytics",
  3
);
analyticsFactory.sendAnalyticsEvent({
  type: "test1",
  data: "testing the factory",
});

setTimeout(function () {
  analyticsFactory.stopAnalytics();
}, 20000);
