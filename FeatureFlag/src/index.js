function FeatureFlagService() {
  // this.api = api;
  this.cache = null;
  this.pending = false;
}
FeatureFlagService.prototype.fetchAllFeatures = function () {
  console.log("Fetching from api");
  return new Promise((resolve) => {
    const sampleFeatures = {
      "extended-summary": true,
      "feedback-dialog": false,
      "test-flag": "",
    };
    setTimeout(resolve, 100, sampleFeatures);
  });
};
FeatureFlagService.prototype.fetchFeatureFlags = async function () {
  if (this.cache) {
    return Promise.resolve(this.cache);
  }

  try {
    await this.fetchAllFeatures();
    console.log("serving from api");
    this.cache = this.pending;
    return this.pending;
  } catch (e) {
    console.log("Feature flags api failed", e);
    return {};
  } finally {
    this.pending = null;
  }
};
FeatureFlagService.prototype.getFeatureState = async function (
  featureFlag,
  defaultValue
) {
  const allFeatureFlags = await this.fetchFeatureFlags();
  if (allFeatureFlags[featureFlag] === undefined) {
    return defaultValue;
  }
  return allFeatureFlags[featureFlag];
};

// usage example
const featureFlagServiceObj = new FeatureFlagService();
featureFlagServiceObj
  .getFeatureState("extended-summary", true)
  .then(function (isEnabled) {
    if (isEnabled) {
      console.log("Extended summary enabled");
    } else {
      console.log("Brief summary enabled");
    }
  });
// src/feature-y/feedback-dialog.js
featureFlagServiceObj
  .getFeatureState("feedback-dialog", true)
  .then(function (isEnabled) {
    if (isEnabled) {
      console.log("Feedback dialog enabled");
    } else {
      console.log("Feedback dialog disabled");
    }
  });
