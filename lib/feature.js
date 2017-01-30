/** feature.js **/
// let {} = require("chrome");

const prefSvc = require("sdk/preferences/service");

const searchResetPref = "browser.search.reset.enabled";
const searchTelemetryMirrorPref = "browser.search.experiment.search-reset.telemetry.enabled.mirror";
const telemetryEnabledPref = "toolkit.telemetry.enabled";

const feature = {
  isEligible() {
    return !prefSvc.get(searchResetPref);
  },

  // Note: install runs on startup as well.
  install(variation) {
    if (variation === "reset-ui") {
      prefSvc.set(searchResetPref, true);
    }
    // Enable extended telemetry if needed, but note this requires a restart
    // before we can start collecting data.
    if (!prefSvc.isSet(searchTelemetryMirrorPref)) {
      let telemetryEnabled = prefSvc.get(telemetryEnabledPref, false);
      if (!telemetryEnabled) {
        prefSvc.set(searchTelemetryMirrorPref, telemetryEnabled);
        prefSvc.set(telemetryEnabledPref, true);
      }
    }
  },

  uninstall() {
    if (prefSvc.isSet(searchTelemetryMirrorPref)) {
      let telemetryEnabled = prefSvc.get(searchTelemetryMirrorPref, false);
      prefSvc.reset(searchTelemetryMirrorPref);
      prefSvc.set(telemetryEnabledPref, telemetryEnabled);
    }
    prefSvc.reset(searchResetPref);
  }
};

exports.feature = feature;
